import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  MessageSquare,
  Store,
  TrendingUp,
} from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import {
  buildBreadcrumbsJsonLd,
  buildPageMetadata,
  buildRealEstateListingJsonLd,
  JsonLd,
} from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import {
  AREAS,
  LISTING_CATEGORIES,
  LISTINGS,
  TYPE_LABEL,
  type MockListing,
} from '@/lib/mock-data'
import { ListingCard } from '@/components/listing-card'
import { TrackView, RecentlyViewedSection } from '@/components/recently-viewed'
import { ListingImageGallery } from '@/components/listing-image-gallery'
import { InquiryButton } from './inquiry-button'

import { ListingDetailSidebarSkeleton, MiniMapSkeleton } from '@/components/skeletons'

const ListingDetailSidebar = dynamic(() => import('@/components/listing-detail-sidebar'), {
  ssr: false,
  loading: () => <ListingDetailSidebarSkeleton />,
})
const ListingMiniMap = dynamic(() => import('@/components/listing-mini-map'), {
  ssr: false,
  loading: () => <MiniMapSkeleton />,
})

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }))
}

interface ListingDetailProps {
  params: { id: string }
}

export function generateMetadata({ params }: ListingDetailProps): Metadata {
  const listing = LISTINGS.find((l) => l.id === params.id)
  if (!listing) return {}
  const typeLabel = TYPE_LABEL[listing.type]
  const priceDesc =
    listing.type === 'sale'
      ? `매각가 ${formatNumber(listing.salePrice ?? 0)}만`
      : `보증금 ${formatNumber(listing.deposit)}만 / 월세 ${formatNumber(listing.monthlyRent)}만`
  return buildPageMetadata('themyungdang', {
    title: `${listing.title} — ${typeLabel}`,
    description: `${listing.region} ${listing.district} · ${listing.area}평 · ${listing.floor} · ${priceDesc}. 일 유동 ${formatNumber(listing.footTraffic)}명.`,
    path: `/listings/${listing.id}`,
  })
}

export default function ListingDetailPage({ params }: ListingDetailProps) {
  const listing = LISTINGS.find((l) => l.id === params.id)
  if (!listing) notFound()
  const area = listing.areaKey ? AREAS.find((a) => a.key === listing.areaKey) : null
  const similar = LISTINGS.filter(
    (l) => l.id !== listing.id && l.region === listing.region,
  ).slice(0, 3)

  const fitCategoryLabels = listing.fitCategories
    .map((k) => LISTING_CATEGORIES.find((c) => c.key === k)?.label)
    .filter(Boolean)

  const listingUrl = `https://themyungdang.amakers.co.kr/listings/${listing.id}`
  const listingTypeKo =
    listing.type === 'transfer' ? '양도' : listing.type === 'new' ? '신규임대' : '매각'
  const priceWon = listing.type === 'sale' ? listing.salePrice : listing.deposit
  const jsonLd = buildRealEstateListingJsonLd({
    name: listing.title,
    description: `${listing.region} ${listing.district} · ${listing.area}평 · ${listing.floor}`,
    url: listingUrl,
    image: listing.images?.[0],
    priceWon,
    listingType: listingTypeKo,
    region: listing.region,
    district: listing.district,
    fullAddress: listing.fullAddress,
    areaPyeong: listing.area,
    availableFrom: listing.availableFrom,
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '매물', url: 'https://themyungdang.amakers.co.kr/listings' },
      { name: `${listing.region} ${listing.district}`, url: `https://themyungdang.amakers.co.kr/listings?region=${listing.region}` },
      { name: listing.title, url: listingUrl },
    ],
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <a href="/listings" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-3.5 w-3.5" /> 매물 검색
          </a>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={listing.type === 'transfer' ? 'primary' : 'default'}>
                  {TYPE_LABEL[listing.type]}
                </Badge>
                {listing.verified && (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" /> 본인 확인 매물
                  </Badge>
                )}
                {listing.featured && <Badge variant="warning">광고</Badge>}
              </div>
              <h1 className="mt-3 text-h2 font-bold text-gray-900">{listing.title}</h1>
              <div className="mt-2 inline-flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {listing.fullAddress}
              </div>
            </div>
            {/* Actions moved to sticky sidebar */}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6 min-w-0">
            {/* Images */}
            <Card className="overflow-hidden border-gray-200 shadow-sm">
              <ListingImageGallery images={listing.images} title={listing.title} />
            </Card>

            {/* Transferor message */}
            {listing.transferorMessage && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-6">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900">
                    <MessageSquare className="h-4 w-4" />
                    {listing.ownerType === 'agent' ? '중개사 메시지' : '양도인의 한 마디'}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-amber-900">{listing.transferorMessage}</p>
                </CardContent>
              </Card>
            )}

            {/* Specs — 데이터 없는 필드는 자동 숨김 (외부 출처 매물 대응) */}
            <SectionCard title="매물 정보">
              <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {listing.buildingType && (
                  <SpecRow icon={Building2} label="용도" value={listing.buildingType} />
                )}
                {listing.floor && (
                  <SpecRow icon={MapPin} label="층" value={listing.floor} />
                )}
                {listing.area > 0 && (
                  <SpecRow icon={MapPin} label="면적" value={`${listing.area}평`} />
                )}
                {listing.availableFrom && (
                  <SpecRow icon={Clock} label="입주 가능" value={listing.availableFrom} />
                )}
                {listing.footTraffic > 0 && (
                  <SpecRow
                    icon={TrendingUp}
                    label="일 평균 유동인구"
                    value={`${formatNumber(listing.footTraffic)}명`}
                  />
                )}
                {listing.viewCount > 0 && (
                  <SpecRow
                    icon={Eye}
                    label="조회"
                    value={`${formatNumber(listing.viewCount)}회 · 문의 ${listing.inquiryCount}건`}
                  />
                )}
                {listing.externalSource && (
                  <SpecRow
                    icon={Building2}
                    label="출처"
                    value={`${listing.externalSource.label} (수집 ${listing.externalSource.fetchedAt.slice(0, 10)})`}
                  />
                )}
              </div>
            </SectionCard>

            {/* Mini map — only when coordinates are available */}
            {listing.lat && (
              <SectionCard title="위치">
                <ListingMiniMap listing={listing} />
              </SectionCard>
            )}

            {/* Tags — 비어있으면 섹션 자체 숨김 */}
            {listing.tags.length > 0 && (
              <SectionCard title="입지 특성">
                <div className="flex flex-wrap gap-2">
                  {listing.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Fit categories — 카테고리가 매칭된 경우만 노출 */}
            {fitCategoryLabels.length > 0 && (
              <SectionCard
                title="적합 업종"
                subtitle="이 매물에 어울리는 가맹 브랜드 카테고리"
              >
                <div className="flex flex-wrap gap-2">
                  {fitCategoryLabels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-xs text-gray-500">
                  <a
                    href={`https://pchahub.amakers.co.kr/categories/${listing.fitCategories[0] ?? ''}`}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    적합 가맹 브랜드 보러가기 (프차허브) →
                  </a>
                </div>
              </SectionCard>
            )}

            {/* Current business (transfer only) */}
            {listing.type === 'transfer' && listing.currentBusiness && (
              <SectionCard title="현재 운영중인 업종">
                <div className="grid gap-3 sm:grid-cols-2">
                  <RowKV label="업종" value={listing.currentBusiness} />
                  {listing.monthlyRevenue && (
                    <RowKV
                      label={`월 매출 (${listing.revenueVerified ? '검증' : '점주 자진 공개'})`}
                      value={`${formatNumber(listing.monthlyRevenue)}만`}
                    />
                  )}
                </div>
              </SectionCard>
            )}

            {/* Area analysis preview */}
            {area && (
              <SectionCard
                title={`${area.name} 상권 요약`}
                subtitle={`${area.region} ${area.district}`}
                action={
                  <a
                    href={`/areas/${area.key}`}
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    상권 자세히 →
                  </a>
                }
              >
                <p className="text-sm text-gray-700">{area.description}</p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                  <StatBlock
                    label="일 유동인구"
                    value={`${formatNumber(area.footTraffic)}명`}
                  />
                  <StatBlock
                    label="평당 월세"
                    value={`${area.avgMonthlyRentPerPyeong}만`}
                  />
                  <StatBlock
                    label="평균 권리금"
                    value={`${formatNumber(area.avgRightFee)}만`}
                  />
                </div>
              </SectionCard>
            )}

            {/* Similar listings */}
            {similar.length > 0 && (
              <SectionCard title={`${listing.region} 비슷한 매물`}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {similar.map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Inquiry button — mobile only (sidebar handles desktop) */}
            <div className="lg:hidden">
              <InquiryButton listingId={listing.id} listingTitle={listing.title} />
            </div>
          </div>

          {/* Sidebar — client component (favorites, inquiry modal, share) */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <ListingDetailSidebar listing={listing} />
          </aside>
        </div>
      </div>

      {/* Track this view + show recently-viewed grid */}
      <TrackView listingId={listing.id} />
      <RecentlyViewedSection currentId={listing.id} />

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
                href="https://pchahub.amakers.co.kr/brands"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5 text-indigo-500" />
                  가맹 브랜드 탐색
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href="https://gongganhansu.amakers.co.kr/quote"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-violet-500" />
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
            <h2 className="mt-3 text-h4 font-bold text-gray-900">창업 매물 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">지역별 신규 매물·권리금 시세·상권 분석을 격주로 보내드립니다.</p>
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


function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-h4 font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {action}
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

function SpecRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-gray-50 py-2 last:border-0">
      <Icon className="h-4 w-4 shrink-0 text-gray-400" />
      <div className="flex-1 text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="ml-3 font-medium text-gray-900">{value}</span>
      </div>
    </div>
  )
}

function RowKV({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-4 py-3 text-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-0.5 font-semibold text-gray-900">{value}</div>
    </div>
  )
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <div className="text-gray-500">{label}</div>
      <div className="mt-0.5 font-semibold text-gray-900">{value}</div>
    </div>
  )
}
