import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ArrowRight, ChevronRight, MapPin, Store, TrendingUp } from 'lucide-react'
import { Card, CardContent, NewsletterForm } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { KOREAN_REGIONS, computeRegionStats } from '@/lib/regions-data'
import { getBrands } from '@/lib/kftc/source'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '지역별 브랜드 탐색 — 내 지역 프랜차이즈 창업 현황',
  description: '서울·경기·부산 등 전국 17개 시도별 프랜차이즈 브랜드 수, 평균 창업비, 인기 업종을 한눈에 확인하세요.',
  path: '/regions',
})

export const revalidate = 3600

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차허브', url: 'https://pchahub.amakers.co.kr' },
    { name: '지역별 탐색', url: 'https://pchahub.amakers.co.kr/regions' },
  ],
})

const listJsonLd = buildItemListJsonLd({
  url: 'https://pchahub.amakers.co.kr/regions',
  items: KOREAN_REGIONS.map((r) => ({
    name: r.label,
    url: `https://pchahub.amakers.co.kr/regions/${encodeURIComponent(r.key)}`,
  })),
})

export default async function RegionsPage() {
  const allBrands = await getBrands()
  const stats = computeRegionStats(allBrands)
  const statsMap = Object.fromEntries(stats.map((s) => [s.region, s]))

  const totalBrands = allBrands.length
  const coveredRegions = stats.filter((s) => s.brandCount > 0).length
  const avgCostAll = Math.round(allBrands.reduce((s, b) => s + (b.startupCost ?? 0), 0) / Math.max(allBrands.length, 1))

  // 브랜드 수 TOP 3
  const topRegions = [...stats].sort((a, b) => b.brandCount - a.brandCount).slice(0, 3)

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={listJsonLd} />

      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-10">
          <nav className="mb-4 flex items-center gap-1 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-900">홈</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">지역별 탐색</span>
          </nav>
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
            <h1 className="text-h2 font-bold text-gray-900">지역별 브랜드 탐색</h1>
          </div>
          <p className="mt-2 max-w-2xl text-gray-600">
            내가 창업하고 싶은 지역에 어떤 브랜드가 본사를 두고 있는지,
            평균 창업비는 얼마인지 지역별로 비교해보세요.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          {[
            { value: formatNumber(totalBrands), label: '전국 총 브랜드' },
            { value: `${coveredRegions}개`, label: '브랜드 보유 지역' },
            { value: `${formatNumber(avgCostAll)}만`, label: '전국 평균 창업비' },
            { value: `${topRegions[0]?.region ?? '-'}`, label: '브랜드 최다 지역' },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-4">
              <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
              <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-10 space-y-10">

        {/* 주목 지역 TOP 3 */}
        <section>
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <h2 className="text-h4 font-semibold text-gray-900">브랜드 밀집 지역 TOP 3</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {topRegions.map((s, idx) => {
              const region = KOREAN_REGIONS.find((r) => r.key === s.region)
              return (
                <a key={s.region} href={`/regions/${encodeURIComponent(s.region)}`} className="group">
                  <Card className="h-full border-gray-200 transition-shadow hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
                            style={{ background: idx === 0 ? '#EAB308' : idx === 1 ? '#9CA3AF' : '#D97706' }}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-base font-bold text-gray-900">{s.region}</div>
                            <div className="text-xs text-gray-500">{region?.label}</div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-600" />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-gray-50 p-3">
                          <div className="text-xs text-gray-500">등록 브랜드</div>
                          <div className="mt-0.5 text-base font-bold text-gray-900">{s.brandCount}개</div>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-3">
                          <div className="text-xs text-gray-500">평균 창업비</div>
                          <div className="mt-0.5 text-base font-bold text-gray-900">
                            {s.avgStartupCost > 0 ? `${formatNumber(s.avgStartupCost)}만` : '-'}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2">
                        <Store className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="text-xs font-medium text-indigo-700">
                          인기 업종 · {s.topCategoryLabel || '-'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              )
            })}
          </div>
        </section>

        {/* 전체 지역 그리드 */}
        <section>
          <h2 className="mb-5 text-h4 font-semibold text-gray-900">전국 시도별 현황</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {KOREAN_REGIONS.map((region) => {
              const s = statsMap[region.key]
              return (
                <a
                  key={region.key}
                  href={`/regions/${encodeURIComponent(region.key)}`}
                  className="group"
                >
                  <Card className="h-full border-gray-200 transition-all hover:border-gray-400 hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            <span className="truncate text-sm font-bold text-gray-900">{region.shortLabel}</span>
                          </div>
                          {s && s.brandCount > 0 ? (
                            <>
                              <div className="mt-1.5 text-xs text-gray-500">
                                {s.brandCount}개 브랜드
                              </div>
                              <div className="mt-0.5 text-xs font-medium" style={{ color: 'var(--brand-primary)' }}>
                                {s.topCategoryLabel} 강세
                              </div>
                            </>
                          ) : (
                            <div className="mt-1.5 text-xs text-gray-400">정보 준비 중</div>
                          )}
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gray-300 group-hover:text-gray-600" />
                      </div>
                      {s && s.avgStartupCost > 0 && (
                        <div className="mt-3 rounded-md bg-gray-50 px-2.5 py-1.5 text-xs text-gray-600">
                          평균 창업비 {formatNumber(s.avgStartupCost)}만
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </a>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl border border-gray-200 bg-white px-8 py-10">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
                입지와 브랜드를 함께
              </p>
              <h2 className="mt-2 text-h3 font-bold text-gray-900">창업 매물도 확인해보세요</h2>
              <p className="mt-2 text-gray-600">
                지역별 브랜드 현황을 파악했다면, 더명당에서 해당 지역 창업 매물(양도·신규임대)을
                확인해보세요.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a href="/listings" className="flex-1">
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gray-200 px-5 py-4 text-center transition-colors hover:border-gray-400 hover:bg-gray-50">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <div className="mt-1.5 text-sm font-semibold text-gray-900">창업 매물 ({`pchahub`})</div>
                  <div className="mt-0.5 text-xs text-gray-500">양도·신규임대 매물 탐색</div>
                </div>
              </a>
              <a href="https://themyungdang.amakers.co.kr/listings" className="flex-1">
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center transition-colors hover:bg-emerald-100">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <div className="mt-1.5 text-sm font-semibold text-emerald-900">더명당 매물</div>
                  <div className="mt-0.5 text-xs text-emerald-700">상권 분석 + 지도 기반 탐색</div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* 뉴스레터 */}
        <section className="rounded-3xl border border-gray-100 bg-gray-50 px-8 py-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            Newsletter
          </p>
          <h2 className="mt-2 text-h4 font-bold text-gray-900">지역별 창업 동향을 받아보세요</h2>
          <p className="mt-1 text-sm text-gray-500">신규 오픈 브랜드, 지역별 임대료 변동, 인기 업종 분석을 격주로 발송합니다.</p>
          <NewsletterForm />
          <p className="mt-2 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
        </section>
      </div>
    </main>
  )
}
