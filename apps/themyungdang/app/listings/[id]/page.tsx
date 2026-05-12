import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Bookmark,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  MessageSquare,
  Phone,
  Share2,
  TrendingUp,
} from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
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

  const listingUrl = `https://themyungdang.kr/listings/${listing.id}`
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
      { name: '매물', url: 'https://themyungdang.kr/listings' },
      { name: `${listing.region} ${listing.district}`, url: `https://themyungdang.kr/listings?region=${listing.region}` },
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
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Bookmark className="h-3.5 w-3.5" /> 찜
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Share2 className="h-3.5 w-3.5" /> 공유
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6 min-w-0">
            {/* Images */}
            <Card className="overflow-hidden border-gray-200 shadow-sm">
              <div className="grid h-80 grid-cols-3 gap-1">
                <div className="col-span-3 sm:col-span-2 sm:row-span-2">
                  <div className="relative h-full w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={listing.images[0]} alt={listing.title} className="h-full w-full object-cover" />
                  </div>
                </div>
                {listing.images.slice(1, 3).map((src, i) => (
                  <div key={i} className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${listing.title} ${i + 2}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              {listing.images.length > 3 && (
                <div className="grid grid-cols-4 gap-1 border-t border-gray-100 p-1">
                  {listing.images.slice(0, 4).map((src, i) => (
                    <div key={i} className="aspect-[16/10] overflow-hidden rounded-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`thumb ${i + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
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

            {/* Specs */}
            <SectionCard title="매물 정보">
              <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                <SpecRow icon={Building2} label="용도" value={listing.buildingType} />
                <SpecRow icon={MapPin} label="층" value={listing.floor} />
                <SpecRow icon={MapPin} label="면적" value={`${listing.area}평`} />
                <SpecRow
                  icon={Clock}
                  label="입주 가능"
                  value={listing.availableFrom}
                />
                <SpecRow
                  icon={TrendingUp}
                  label="일 평균 유동인구"
                  value={`${formatNumber(listing.footTraffic)}명`}
                />
                <SpecRow
                  icon={Eye}
                  label="조회"
                  value={`${formatNumber(listing.viewCount)}회 · 문의 ${listing.inquiryCount}건`}
                />
              </div>
            </SectionCard>

            {/* Tags */}
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

            {/* Fit categories */}
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
                  href={`https://pchahub.kr/categories/${listing.fitCategories[0] ?? ''}`}
                  className="text-gray-700 hover:text-gray-900"
                >
                  적합 가맹 브랜드 보러가기 (프차허브) →
                </a>
              </div>
            </SectionCard>

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
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <CTASidebar listing={listing} />
          </aside>
        </div>
      </div>
    </main>
  )
}

function CTASidebar({ listing }: { listing: MockListing }) {
  return (
    <div className="space-y-4">
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-5">
          {/* Price */}
          {listing.type === 'sale' ? (
            <div>
              <div className="text-xs text-gray-500">매각가</div>
              <div className="mt-0.5 text-h3 font-bold text-gray-900">
                {formatNumber(listing.salePrice ?? 0)}
                <span className="text-base font-medium text-gray-600"> 만원</span>
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="text-xs text-gray-500">월세 / 보증금</div>
                <div className="mt-0.5 text-h4 font-bold text-gray-900">
                  {formatNumber(listing.monthlyRent)}만
                  <span className="text-sm font-medium text-gray-500">
                    {' '}/ 보증금 {formatNumber(listing.deposit)}만
                  </span>
                </div>
              </div>
              {listing.rightFee !== undefined && (
                <div>
                  <div className="text-xs text-gray-500">권리금</div>
                  <div className="mt-0.5 text-base font-semibold text-gray-900">
                    {listing.rightFee === 0
                      ? '없음'
                      : `${formatNumber(listing.rightFee)}만`}
                  </div>
                </div>
              )}
            </>
          )}

          <Button size="lg" className="w-full gap-1">
            <MessageSquare className="h-4 w-4" />
            매물 문의하기
          </Button>
          <Button size="lg" variant="outline" className="w-full">
            <Bookmark className="h-4 w-4" />
            찜하기
          </Button>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardContent className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            등록자
          </div>
          <div className="mt-2 space-y-1">
            <div className="text-sm font-medium text-gray-900">
              {listing.ownerType === 'agent' ? listing.agencyName : '직거래'}
            </div>
            <div className="inline-flex items-center gap-1.5 text-sm text-gray-600">
              <Phone className="h-3.5 w-3.5" /> 1544-0000
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
            <div className="flex items-center gap-1 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              안전 거래 지원 매물
            </div>
            <p className="mt-1">에스크로 결제와 표준 계약서 검토를 무료로 제공합니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
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
