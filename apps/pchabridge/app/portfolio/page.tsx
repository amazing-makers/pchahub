import type { Metadata } from 'next'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { Badge, BrandLogo, Card, CardContent } from '@amakers/ui'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import {
  BRANDS,
  ROUNDS,
  MA_LISTINGS,
  ROUND_TYPE_LABEL,
  ROUND_STATUS_LABEL,
  ROUND_STATUS_COLOR,
  brandById,
  progressPercent,
  daysUntil,
  type RoundType,
} from '@/lib/mock-data'
import { RoundCard } from '@/components/round-card'

export const metadata: Metadata = buildPageMetadata('pchabridge', {
  title: '투자 포트폴리오 현황',
  description: '프차브릿지 전체 투자 라운드 현황. 라운드 유형별·업종별 포트폴리오 구성, 모집 진행 상황, 완료된 딜을 한눈에.',
  path: '/portfolio',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차브릿지', url: 'https://pchabridge.amakers.co.kr' },
    { name: '포트폴리오 현황', url: 'https://pchabridge.amakers.co.kr/portfolio' },
  ],
})

const ROUND_TYPE_ORDER: RoundType[] = ['seed', 'series-a', 'series-b', 'crowd', 'store-fund', 'ma']

const CATEGORY_LABEL: Record<string, string> = {
  chicken: '치킨', cafe: '카페', korean: '한식', japanese: '일식',
  snack: '분식', dessert: '디저트', beverage: '음료', bar: '주점',
}

export default function PortfolioPage() {
  const activeRounds = ROUNDS.filter((r) => r.status === 'open' || r.status === 'closing-soon')
  const completedRounds = ROUNDS.filter((r) => r.status === 'completed')
  const allFundedBrands = new Set(ROUNDS.map((r) => r.brandId))

  const totalRaised = ROUNDS.reduce((s, r) => s + r.currentAmount, 0)
  const totalTarget = ROUNDS.reduce((s, r) => s + r.targetAmount, 0)
  const avgROI = ROUNDS.length
    ? (ROUNDS.reduce((s, r) => s + r.expectedAnnualROI, 0) / ROUNDS.length).toFixed(1)
    : '0'
  const overallProgress = totalTarget > 0 ? Math.round((totalRaised / totalTarget) * 100) : 0

  // Portfolio by type
  const byType = ROUND_TYPE_ORDER.map((type) => {
    const rounds = ROUNDS.filter((r) => r.type === type)
    const targetSum = rounds.reduce((s, r) => s + r.targetAmount, 0)
    const raisedSum = rounds.reduce((s, r) => s + r.currentAmount, 0)
    return { type, count: rounds.length, targetSum, raisedSum }
  }).filter((g) => g.count > 0)

  // Portfolio by sector (brand category)
  const sectorMap = new Map<string, { count: number; totalTarget: number }>()
  for (const round of ROUNDS) {
    const brand = brandById(round.brandId)
    if (!brand) continue
    const existing = sectorMap.get(brand.category) ?? { count: 0, totalTarget: 0 }
    sectorMap.set(brand.category, {
      count: existing.count + 1,
      totalTarget: existing.totalTarget + round.targetAmount,
    })
  }
  const bySector = Array.from(sectorMap.entries())
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.totalTarget - a.totalTarget)

  const maxTarget = Math.max(...byType.map((g) => g.targetSum), 1)

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />

      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            Portfolio Overview
          </p>
          <h1 className="mt-2 text-h3 font-bold text-gray-900">투자 포트폴리오 현황</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            전체 {ROUNDS.length}개 라운드 · {allFundedBrands.size}개 브랜드 · 모집 진행 + 완료 통합 뷰
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-4">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {[
              { value: `${formatNumber(totalRaised)}만`, label: '누적 모집액' },
              { value: `${allFundedBrands.size}개`, label: '투자 브랜드' },
              { value: `${activeRounds.length}건`, label: '진행 중 라운드' },
              { value: `${avgROI}%`, label: '평균 기대 ROI' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-0.5 px-4 py-3 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                <span className="text-[11px] font-semibold text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto space-y-10 py-10">
        {/* Overall progress */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-700">전체 모집 달성률</div>
                <div className="mt-0.5 text-xs text-gray-400">
                  {formatNumber(totalRaised)}만 / {formatNumber(totalTarget)}만
                </div>
              </div>
              <span className="text-3xl font-black" style={{ color: 'var(--brand-primary)' }}>
                {overallProgress}%
              </span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${overallProgress}%`, background: 'var(--brand-primary)' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Portfolio by type */}
        <section>
          <h2 className="mb-4 text-h4 font-bold text-gray-900">라운드 유형별 구성</h2>
          <Card className="border-gray-200">
            <CardContent className="divide-y divide-gray-50 p-0">
              {byType.map((g) => {
                const barWidth = Math.round((g.targetSum / maxTarget) * 100)
                return (
                  <div key={g.type} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-24 shrink-0">
                      <Badge variant="primary">{ROUND_TYPE_LABEL[g.type]}</Badge>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 overflow-hidden rounded-full bg-gray-100 h-2">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${barWidth}%`, background: 'var(--brand-primary)' }}
                          />
                        </div>
                        <span className="shrink-0 text-xs text-gray-500 tabular-nums w-12 text-right">
                          {g.count}건
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {g.targetSum >= 10000
                          ? `${(g.targetSum / 10000).toFixed(1)}억`
                          : `${formatNumber(g.targetSum)}만`}
                      </div>
                      <div className="text-xs text-gray-400">목표액</div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </section>

        {/* Sector allocation */}
        <section>
          <h2 className="mb-4 text-h4 font-bold text-gray-900">업종별 포트폴리오</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {bySector.map((s) => (
              <Card key={s.category} className="border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-black text-gray-900">
                    {CATEGORY_LABEL[s.category] ?? s.category}
                  </div>
                  <div className="mt-1 text-2xl font-black" style={{ color: 'var(--brand-primary)' }}>
                    {s.count}건
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    {s.totalTarget >= 10000
                      ? `${(s.totalTarget / 10000).toFixed(1)}억`
                      : `${formatNumber(s.totalTarget)}만`} 목표
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Active pipeline */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-h4 font-bold text-gray-900">진행 중 라운드</h2>
            <a href="/investments" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
              전체 보기 <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          {activeRounds.length === 0 ? (
            <Card className="border-dashed border-gray-200">
              <CardContent className="py-10 text-center text-sm text-gray-500">현재 모집 중인 라운드가 없습니다.</CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeRounds.map((r) => (
                <RoundCard key={r.id} round={r} />
              ))}
            </div>
          )}
        </section>

        {/* Completed deals */}
        {completedRounds.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-bold text-gray-900">완료된 딜</h2>
            <div className="space-y-3">
              {completedRounds.map((r) => {
                const brand = brandById(r.brandId)
                return (
                  <a
                    key={r.id}
                    href={`/investments/${r.id}`}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 transition-colors hover:border-gray-300"
                  >
                    {brand && (
                      <BrandLogo
                        brand={{ name: brand.name, logoColor: brand.logoColor, category: brand.category }}
                        size="sm"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">{brand?.name}</div>
                      <div className="text-xs text-gray-500">{ROUND_TYPE_LABEL[r.type]} · {brand?.categoryLabel}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-bold text-emerald-600 inline-flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5" />
                        +{r.expectedAnnualROI}% ROI
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {formatNumber(r.targetAmount)}만 달성
                      </div>
                    </div>
                    <Badge variant="default">{ROUND_STATUS_LABEL[r.status]}</Badge>
                  </a>
                )
              })}
            </div>
          </section>
        )}

        {/* M&A pipeline preview */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-h4 font-bold text-gray-900">M&A 파이프라인</h2>
            <a href="/ma" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
              전체 보기 <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {MA_LISTINGS.map((m) => {
              const brand = brandById(m.brandId)
              return (
                <a
                  key={m.id}
                  href={`/ma/${m.id}`}
                  className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300"
                >
                  <div className="flex items-center gap-3">
                    {brand && (
                      <BrandLogo
                        brand={{ name: brand.name, logoColor: brand.logoColor, category: brand.category }}
                        size="sm"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{brand?.name}</div>
                      <div className="text-xs text-gray-500">{brand?.categoryLabel} · {brand?.storeCount}개 매장</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                    <span className="text-xs text-gray-500">희망 매각가</span>
                    <span className="text-sm font-bold text-gray-900">
                      {m.askingPrice >= 10000
                        ? `${(m.askingPrice / 10000).toFixed(1)}억`
                        : `${formatNumber(m.askingPrice)}만`}
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
