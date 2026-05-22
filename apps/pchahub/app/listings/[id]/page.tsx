import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildBreadcrumbsJsonLd, buildPageMetadata, buildRealEstateListingJsonLd, JsonLd } from '@amakers/design-system'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  MapPin,
  MessageSquare,
  Store,
  Tag,
} from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { LISTINGS, listingById, type MockListing } from '@/lib/mock-listings'
import { ListingCard } from '@/components/listing-card'
import { BrandCard } from '@/components/brand-card'
import { BRANDS, CATEGORIES } from '@/lib/mock-data'
import { ListingContactPanel } from './listing-contact-panel'
import { ShareListingButton } from './share-listing-button'
import { ListingViewTracker } from './listing-view-tracker'

interface ListingDetailProps {
  params: { id: string }
}

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }))
}

export function generateMetadata({ params }: ListingDetailProps): Metadata {
  const listing = listingById(params.id)
  if (!listing) return {}
  return buildPageMetadata('pchahub', {
    title: `${listing.title} — ${listing.listingType}`,
    description: `${listing.region} ${listing.district} · ${listing.area}평 · 보증금 ${listing.deposit}만 / 월세 ${listing.monthlyRent}만${listing.rightFee ? ` / 권리금 ${listing.rightFee}만` : ''}. ${listing.tags.slice(0, 3).join(' · ')}.`,
    path: `/listings/${listing.id}`,
  })
}

export default function ListingDetailPage({ params }: ListingDetailProps) {
  const listing = listingById(params.id)
  if (!listing) notFound()

  const others = LISTINGS.filter((l) => l.id !== listing.id && l.region === listing.region).slice(0, 3)

  const listingUrl = `https://pchahub.amakers.co.kr/listings/${listing.id}`
  const listingJsonLd = buildRealEstateListingJsonLd({
    name: listing.title,
    description: `${listing.region} ${listing.district} · ${listing.area}평 · ${listing.listingType}`,
    url: listingUrl,
    priceWon: listing.deposit,
    listingType: listing.listingType as '양도' | '신규임대' | '매각',
    region: listing.region,
    district: listing.district,
    areaPyeong: listing.area,
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '매물', url: 'https://pchahub.amakers.co.kr/listings' },
      { name: `${listing.region} ${listing.district}`, url: `https://pchahub.amakers.co.kr/listings?region=${listing.region}` },
      { name: listing.title, url: listingUrl },
    ],
  })
  const totalMonthly = listing.monthlyRent
  const totalUpfront = listing.deposit + listing.rightFee

  // 매물 면적·예산·업종에 맞는 브랜드 추천
  const recommendedBrands = BRANDS
    .filter((b) => listing.fitCategories.includes(b.category))
    .filter((b) => b.recruiting)
    // 매물 비용 대비 적정 창업비 — 권리금+보증금 합계 ~ 창업비 2배 범위
    .map((b) => {
      const totalListingCost = listing.deposit + listing.rightFee
      // 매물 부담이 창업비의 30~80% 정도면 적정 (가맹비 + 인테리어 별도)
      const ratio = totalListingCost / b.startupCost
      const fitScore = ratio >= 0.3 && ratio <= 1.5 ? 1 : 0.3
      return { brand: b, score: fitScore * (b.growthRate + b.storeCount / 10) }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => x.brand)

  return (
    <main className="bg-gray-50">
      <ListingViewTracker listingId={listing.id} listingTitle={listing.title} listingRegion={listing.region} listingType={listing.listingType} />
      <JsonLd data={listingJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/listings" className="hover:text-gray-900">
              매물
            </a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{listing.region} {listing.district}</span>
          </nav>
        </div>
      </section>

      <div className="container mx-auto py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            <PhotoGallery images={listing.images} title={listing.title} />

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={listing.listingType === '양도' ? 'warning' : 'primary'}>
                    {listing.listingType}
                  </Badge>
                  {listing.verified && (
                    <Badge variant="default" className="gap-0.5">
                      <CheckCircle2 className="h-3 w-3" />
                      amakers 실사 완료
                    </Badge>
                  )}
                </div>
                <h1 className="mt-3 text-h3 font-bold text-gray-900">{listing.title}</h1>
                <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {listing.fullAddress}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatBox label="매장 면적" value={`${listing.area}평`} />
                  <StatBox label="일 유동인구" value={`${formatNumber(listing.footTraffic)}명`} />
                  <StatBox label="입점 가능" value={listing.availableFrom} />
                  <StatBox label="등록일" value={listing.listedAt} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-h4 font-semibold text-gray-900">매물 조건</h2>
                <div className="mt-4 space-y-3">
                  <Row label="보증금" value={`${formatNumber(listing.deposit)} 만원`} />
                  <Row label="월세" value={`${formatNumber(listing.monthlyRent)} 만원`} />
                  <Row
                    label="권리금"
                    value={listing.rightFee === 0 ? '없음' : `${formatNumber(listing.rightFee)} 만원`}
                  />
                  <Row label="매장 면적" value={`${listing.area}평`} />
                  <Row label="입점 가능 시점" value={listing.availableFrom} />
                  {listing.previousBusiness && (
                    <Row label="이전 업종" value={listing.previousBusiness} />
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {listing.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                    >
                      <Tag className="h-3 w-3 text-gray-400" />
                      {t}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {listing.transferorMessage && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-6">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900">
                    <MessageSquare className="h-4 w-4" />
                    양도인의 한 마디
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-amber-900">{listing.transferorMessage}</p>
                </CardContent>
              </Card>
            )}

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-h4 font-semibold text-gray-900">추천 업종</h2>
                <p className="mt-1 text-sm text-gray-500">이 매물의 입지·면적에 잘 맞는 업종입니다.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {listing.fitCategories.map((catKey) => {
                    const cat = CATEGORIES.find((c) => c.key === catKey)
                    if (!cat) return null
                    return (
                      <a
                        key={catKey}
                        href={`/brands?category=${catKey}`}
                        className="rounded-full bg-gray-900 px-3 py-1 text-xs text-white hover:bg-gray-800"
                      >
                        {cat.label}
                      </a>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {recommendedBrands.length > 0 && (
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-h4 font-semibold text-gray-900">
                        이 매물에 어울리는 가맹 브랜드
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        매물 부담({formatNumber(totalUpfront)}만)과 업종에 맞춰 성장률·매장 수 기준으로 추천
                      </p>
                    </div>
                    <a
                      href={`/brands?category=${listing.fitCategories[0]}`}
                      className="hidden text-sm text-gray-700 hover:text-gray-900 sm:inline"
                    >
                      전체 보기 →
                    </a>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {recommendedBrands.map((b) => (
                      <BrandCard key={b.id} brand={b} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {others.length > 0 && (
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-h4 font-semibold text-gray-900">{listing.region}의 다른 매물</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {others.map((o) => (
                      <ListingCard key={o.id} listing={o} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="space-y-4 p-5">
                <div>
                  <div className="text-xs text-gray-500">초기 부담 (보증금 + 권리금)</div>
                  <div className="mt-1 text-h3 font-bold text-gray-900">
                    {formatNumber(totalUpfront)}
                    <span className="text-base font-medium text-gray-500"> 만원</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    월 고정 비용 약 {formatNumber(totalMonthly)} 만원
                  </div>
                </div>

                <div className="space-y-1.5 rounded-lg bg-gray-50 p-3 text-sm">
                  <Row label="보증금" value={`${formatNumber(listing.deposit)} 만원`} small />
                  <Row label="월세" value={`${formatNumber(listing.monthlyRent)} 만원`} small />
                  <Row
                    label="권리금"
                    value={listing.rightFee === 0 ? '없음' : `${formatNumber(listing.rightFee)} 만원`}
                    small
                  />
                </div>

                <ListingContactPanel
                  listingId={listing.id}
                  listingTitle={listing.title}
                />

                <ShareListingButton listingTitle={listing.title} />

                <div className="border-t border-gray-100 pt-3 text-center text-xs text-gray-500">
                  문의 {listing.inquiryCount}건 · {listing.listedAt} 등록
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4 border-violet-200 bg-violet-50">
              <CardContent className="p-5 text-sm text-violet-900">
                <div className="font-semibold">안전한 거래 안내</div>
                <p className="mt-1 text-xs leading-relaxed">
                  amakers는 모든 매물에 대해 실사를 진행하고, 양도 거래 시 표준 계약서와 에스크로 결제를 지원합니다.
                  거래 수수료는 양측 합의 후 별도 안내됩니다.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* amakers 생태계 크로스링크 */}
      <section className="container mx-auto py-8">
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              amakers에서 더 알아보기
            </div>
            <p className="mt-1 text-sm text-gray-600">
              이 매물과 함께 확인하면 좋은 창업 정보입니다.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="https://themyungdang.amakers.co.kr/listings"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  창업 매물 더 보기 (더명당)
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href="https://gongganhansu.amakers.co.kr/quote"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5 text-indigo-500" />
                  인테리어 견적 받기
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href="https://themanual.amakers.co.kr/courses"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                  창업 운영 강의
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href="https://jangsanote.amakers.co.kr"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                  점주 커뮤니티 (장사노트)
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 뉴스레터 CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h4 font-bold text-gray-900">신규 창업 매물 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">지역별 양도·임대 신규 매물·권리금 시세·입지 분석을 격주로 보내드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
                aria-label="이메일 주소"
                placeholder="이메일 주소"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                구독하기
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function PhotoGallery({ images, title }: { images: string[]; title: string }) {
  return (
    <Card className="overflow-hidden border-gray-200">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
        <div className="relative aspect-[16/10] overflow-hidden sm:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt={title} className="h-full w-full object-cover" />
        </div>
        <div className="grid grid-cols-1 gap-1">
          {images.slice(1, 3).map((src, i) => (
            <div key={i} className="relative aspect-[16/10] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${title} ${i + 2}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-0.5 text-sm font-bold text-gray-900">{value}</div>
    </div>
  )
}

function Row({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className={'flex items-center justify-between gap-2 ' + (small ? '' : 'border-b border-gray-100 py-1.5 last:border-0')}>
      <span className={small ? 'text-xs text-gray-500' : 'text-sm text-gray-500'}>{label}</span>
      <span className={'font-semibold text-gray-900 ' + (small ? 'text-xs' : 'text-sm')}>{value}</span>
    </div>
  )
}
