import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Card, CardContent, NewsletterForm } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { AREAS, listingsByArea } from '@/lib/mock-data'
import { ListingCard } from '@/components/listing-card'
import { AreaChip } from '@/components/area-chip'
import { MiniMapSkeleton } from '@/components/skeletons'

const AreaCharts  = dynamic(() => import('@/components/area-charts'),   {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-xl bg-gray-200" />,
})
const AreaMiniMap = dynamic(() => import('@/components/area-mini-map'), {
  ssr: false,
  loading: () => <MiniMapSkeleton />,
})

export function generateStaticParams() {
  return AREAS.map((a) => ({ name: a.key }))
}

interface AreaDetailPageProps {
  params: { name: string }
}

export function generateMetadata({ params }: AreaDetailPageProps): Metadata {
  const area = AREAS.find((a) => a.key === params.name)
  if (!area) return {}
  return buildPageMetadata('themyungdang', {
    title: `${area.name} 상권 분석`,
    description: `${area.region} ${area.name} 상권. 월 유동인구 ${formatNumber(area.footTraffic)}명 · 평균 보증금 ${formatNumber(area.avgDeposit)}만 · 평당 임대료 ${formatNumber(area.avgMonthlyRentPerPyeong)}만원.`,
    path: `/areas/${area.key}`,
  })
}

export default function AreaDetailPage({ params }: AreaDetailPageProps) {
  const area = AREAS.find((a) => a.key === params.name)
  if (!area) notFound()

  const listings = listingsByArea(area.key)
  const sameRegion = AREAS.filter(
    (a) => a.key !== area.key && a.region === area.region,
  ).slice(0, 3)
  const otherAreas = AREAS.filter((a) => a.key !== area.key && a.region !== area.region).slice(0, 4)

  const areaUrl = `https://themyungdang.amakers.co.kr/areas/${area.key}`
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '상권 분석', url: 'https://themyungdang.amakers.co.kr/areas' },
      { name: area.region, url: `https://themyungdang.amakers.co.kr/areas?region=${encodeURIComponent(area.region)}` },
      { name: area.name, url: areaUrl },
    ],
  })
  const listJsonLd = buildItemListJsonLd({
    url: areaUrl,
    items: listings.slice(0, 20).map((l) => ({ name: l.title, url: `https://themyungdang.amakers.co.kr/listings/${l.id}` })),
  })

  const maxShare = Math.max(...area.topCategories.map((c) => c.share))

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={listJsonLd} />
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-10">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/areas" className="hover:text-gray-900">
              상권 분석
            </a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{area.name}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-h2 font-bold text-gray-900">{area.name}</h1>
              <div className="mt-1 inline-flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {area.region} {area.district}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {area.lat && area.lng && (
                <a
                  href={`/listings/map?lat=${area.lat}&lng=${area.lng}&zoom=15`}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  지도에서 보기
                </a>
              )}
              <a
                href={`/listings?region=${encodeURIComponent(area.region)}`}
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                이 지역 매물 보기 <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="/areas"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                상권 비교하기 <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-700">
            {area.description}
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={Users}
              label="일 평균 유동인구"
              value={`${formatNumber(area.footTraffic)}명`}
            />
            <StatCard
              icon={Building2}
              label="평당 월세 평균"
              value={`${area.avgMonthlyRentPerPyeong}만원`}
            />
            <StatCard
              icon={TrendingUp}
              label="평균 권리금"
              value={`${formatNumber(area.avgRightFee)}만`}
            />
            <StatCard
              icon={Sparkles}
              label="평균 보증금"
              value={`${formatNumber(area.avgDeposit)}만`}
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto py-10 space-y-8">
        {/* ── 상권 위치 지도 ─────────────────────────────────────── */}
        {area.lat && (
          <SectionCard
            title="상권 위치 및 매물"
            subtitle={`${area.name} 반경 내 현재 등록된 매물을 지도에서 확인하세요`}
          >
            <AreaMiniMap area={area} listings={listings} />
            <div className="mt-3 flex items-center justify-end">
              <a
                href={area.lat && area.lng ? `/listings/map?lat=${area.lat}&lng=${area.lng}&zoom=15` : '/listings/map'}
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                전체 매물 지도로 보기 →
              </a>
            </div>
          </SectionCard>
        )}

        {/* Charts — monthly trend + category donut */}
        <AreaCharts area={area} />

        {/* Category share */}
        <SectionCard
          title="주요 업종 비중"
          subtitle={`${area.name}에 자리 잡은 업종들의 상대 비중`}
        >
          <div className="space-y-3">
            {area.topCategories.map((c) => (
              <div key={c.key} className="flex items-center gap-3">
                <div className="w-20 shrink-0 text-sm font-medium text-gray-700">{c.label}</div>
                <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-gray-100">
                  <div
                    className="h-full rounded-md transition-all"
                    style={{
                      width: `${(c.share / maxShare) * 100}%`,
                      background: 'var(--brand-primary)',
                    }}
                  />
                </div>
                <div className="w-12 shrink-0 text-right text-sm font-semibold text-gray-900">
                  {c.share}%
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500">
            정보공개서 + 자영업 실태조사 데이터 기준 추정치. 시점·표본에 따라 차이가 있을 수 있습니다.
          </p>
        </SectionCard>

        {/* Highlights + Cautions */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-6">
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-900">
                <CheckCircle2 className="h-4 w-4" />
                강점
              </div>
              <ul className="mt-3 space-y-2 text-sm text-emerald-800">
                {area.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    {h}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-900">
                <AlertCircle className="h-4 w-4" />
                주의할 점
              </div>
              <ul className="mt-3 space-y-2 text-sm text-amber-800">
                {area.cautions.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                    {c}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Listings in this area */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-h4 font-semibold text-gray-900">{area.name} 매물</h2>
              <p className="mt-0.5 text-sm text-gray-500">현재 등록된 {listings.length}건</p>
            </div>
            <a
              href={`/listings?region=${encodeURIComponent(area.region)}`}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {area.region} 전체 매물 보기 →
            </a>
          </div>
          {listings.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-sm text-gray-500">
                이 상권의 매물이 아직 없습니다.{' '}
                <a
                  href={`/listings?region=${encodeURIComponent(area.region)}`}
                  className="font-medium text-gray-900 hover:underline"
                >
                  같은 지역 다른 매물 보기
                </a>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </section>

        {/* Other areas */}
        {sameRegion.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              {area.region} 다른 상권
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sameRegion.map((a) => (
                <AreaChip key={a.key} area={a} listingCount={listingsByArea(a.key).length} />
              ))}
            </div>
          </section>
        )}

        {otherAreas.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">다른 광역시·도 인기 상권</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {otherAreas.map((a) => (
                <AreaChip key={a.key} area={a} listingCount={listingsByArea(a.key).length} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">상권 분석 리포트를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">이 상권의 신규 매물·권리금 시세·유동인구 동향을 격주로 보내드립니다.</p>
            <NewsletterForm />
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
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="mb-5">
          <h2 className="text-h4 font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <Icon className="h-4 w-4 text-gray-400" />
      <div className="mt-2 text-xs text-gray-500">{label}</div>
      <div className="mt-0.5 text-h4 font-bold text-gray-900">{value}</div>
    </div>
  )
}
