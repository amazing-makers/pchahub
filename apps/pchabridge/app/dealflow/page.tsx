import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ArrowRight, BarChart3, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import {
  BRANDS,
  MA_LISTINGS,
  ROUND_TYPE_LABEL,
  ROUNDS,
  brandById,
  progressPercent,
} from '@/lib/mock-data'

export const metadata: Metadata = buildPageMetadata('pchabridge', {
  title: '딜플로우 리포트',
  description: '프차브릿지 딜플로우 리포트. 프랜차이즈 투자 시장 현황 — 라운드 유형별 통계, 업종별 분포, ROI 현황을 한눈에 확인하세요.',
  path: '/dealflow',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차브릿지', url: 'https://pchabridge.amakers.co.kr' },
    { name: '딜플로우 리포트', url: 'https://pchabridge.amakers.co.kr/dealflow' },
  ],
})

export default function DealflowPage() {
  const openRounds = ROUNDS.filter((r) => r.status === 'open' || r.status === 'closing-soon')
  const totalRaised = ROUNDS.reduce((s, r) => s + r.currentAmount, 0)
  const totalTarget = ROUNDS.reduce((s, r) => s + r.targetAmount, 0)
  const roiRounds = ROUNDS.filter((r) => r.expectedAnnualROI > 0)
  const avgROI = Math.round(roiRounds.reduce((s, r) => s + r.expectedAnnualROI, 0) / roiRounds.length)

  const byType = (Object.entries(ROUND_TYPE_LABEL) as [string, string][])
    .map(([type, label]) => {
      const typeRounds = ROUNDS.filter((r) => r.type === type)
      const open = typeRounds.filter((r) => r.status === 'open' || r.status === 'closing-soon').length
      const validRoi = typeRounds.filter((r) => r.expectedAnnualROI > 0)
      const avgRoi =
        validRoi.length > 0
          ? Math.round(validRoi.reduce((s, r) => s + r.expectedAnnualROI, 0) / validRoi.length)
          : 0
      return { type, label, total: typeRounds.length, open, avgRoi }
    })
    .filter((t) => t.total > 0)

  const categoryMap: Record<string, { label: string; count: number; raised: number }> = {}
  for (const brand of BRANDS) {
    const brandRounds = ROUNDS.filter((r) => r.brandId === brand.id)
    if (brandRounds.length === 0) continue
    if (!categoryMap[brand.category]) {
      categoryMap[brand.category] = { label: brand.categoryLabel, count: 0, raised: 0 }
    }
    categoryMap[brand.category]!.count += brandRounds.length
    categoryMap[brand.category]!.raised += brandRounds.reduce((s, r) => s + r.currentAmount, 0)
  }
  const categoryList = Object.entries(categoryMap)
    .map(([cat, v]) => ({ cat, ...v }))
    .sort((a, b) => b.raised - a.raised)
  const maxRaised = categoryList[0]?.raised ?? 1

  const topROI = [...openRounds].sort((a, b) => b.expectedAnnualROI - a.expectedAnnualROI).slice(0, 4)
  const openMA = MA_LISTINGS.filter((m) => m.status === 'open')

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* Header */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto py-section">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            Deal Flow Report
          </p>
          <h1 className="mt-3 text-h2 font-bold text-gray-900">딜플로우 리포트</h1>
          <p className="mt-2 text-sm text-gray-500">
            프차브릿지 투자 시장 전체 현황 — 라운드 유형·업종·ROI를 한눈에
          </p>
          <p className="mt-1 text-xs text-gray-400">기준일: 2026-05-25</p>
        </div>
      </section>

      {/* Summary bar */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {[
              { value: `${openRounds.length}건`, label: '현재 모집 중' },
              { value: `${Math.round(totalRaised / 100000000)}억`, label: '누적 모집 자금' },
              { value: `${Math.round((totalRaised / totalTarget) * 100)}%`, label: '전체 달성률' },
              { value: `${avgROI}%`, label: '평균 예상 ROI' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-5">
                <div className="text-2xl font-black tracking-tight text-gray-900">{value}</div>
                <p className="mt-0.5 text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-section">
        <div className="grid gap-8 lg:grid-cols-2">

          {/* By type */}
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              <h2 className="text-h4 font-bold text-gray-900">라운드 유형별 현황</h2>
            </div>
            <div className="mt-4 space-y-3">
              {byType.map((t) => (
                <div key={t.type} className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{t.label}</span>
                      {t.open > 0 && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                          {t.open}건 모집중
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">총 {t.total}건</span>
                  </div>
                  {t.avgRoi > 0 && (
                    <p className="mt-1 text-xs text-gray-400">평균 예상 ROI {t.avgRoi}%</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* By category */}
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <h2 className="text-h4 font-bold text-gray-900">업종별 모집 현황</h2>
            </div>
            <div className="mt-4 space-y-3">
              {categoryList.map((c) => {
                const pct = Math.round((c.raised / maxRaised) * 100)
                return (
                  <div key={c.cat} className="rounded-xl border border-gray-100 bg-white p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-900">{c.label}</span>
                      <span className="text-gray-400">{c.count}건</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: 'var(--brand-primary)' }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      모집 {Math.round(c.raised / 100000000)}억원
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Top ROI rounds */}
        <div className="mt-10">
          <h2 className="text-h4 font-bold text-gray-900">예상 ROI 상위 — 모집 중인 라운드</h2>
          <p className="mt-1 text-sm text-gray-500">현재 모집 중인 라운드 중 예상 수익률 기준 상위 4건</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topROI.map((r) => {
              const brand = brandById(r.brandId)
              const pct = progressPercent(r)
              return (
                <a key={r.id} href={`/investments/${r.id}`} className="block">
                  <Card className="h-full border-gray-200 transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-7 w-7 shrink-0 rounded-lg"
                          style={{ background: brand?.logoColor ?? '#888' }}
                        />
                        <span className="truncate text-sm font-semibold text-gray-900">
                          {brand?.name}
                        </span>
                      </div>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-gray-900">{r.expectedAnnualROI}%</span>
                        <span className="text-xs text-gray-400">예상 ROI/연</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: 'var(--brand-primary)' }}
                        />
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-xs text-gray-500">{pct}% 달성</p>
                        <ArrowRight className="h-3 w-3 text-gray-300" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              )
            })}
          </div>
        </div>

        {/* M&A pipeline */}
        {openMA.length > 0 && (
          <div className="mt-10">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-h4 font-bold text-gray-900">M&A 파이프라인</h2>
                <p className="mt-1 text-sm text-gray-500">현재 검토 가능한 M&A 매물</p>
              </div>
              <a href="/ma" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                전체 M&A <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">본사</th>
                    <th className="px-4 py-3 text-right font-semibold">매각 희망가</th>
                    <th className="px-4 py-3 text-right font-semibold">연 매출</th>
                    <th className="hidden px-4 py-3 text-right font-semibold sm:table-cell">매장 수</th>
                    <th className="hidden px-4 py-3 text-right font-semibold md:table-cell">문의</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {openMA.map((m) => {
                    const brand = brandById(m.brandId)
                    return (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-6 w-6 shrink-0 rounded"
                              style={{ background: brand?.logoColor ?? '#888' }}
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{brand?.name}</div>
                              <div className="text-xs text-gray-400">{brand?.categoryLabel}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          {Math.round(m.askingPrice / 100000000)}억
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {Math.round(m.annualRevenue / 100000000)}억
                        </td>
                        <td className="hidden px-4 py-3 text-right text-gray-600 sm:table-cell">
                          {m.storeCount}개
                        </td>
                        <td className="hidden px-4 py-3 text-right text-gray-400 md:table-cell">
                          {m.inquiryCount}건
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="rounded-2xl bg-gray-900 px-8 py-10 text-white">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-h3 font-bold">투자를 처음 시작하신다면</h2>
                <p className="mt-2 text-sm text-gray-300">
                  투자자 가이드에서 절차·방식·위험 요소를 먼저 확인하세요.
                </p>
              </div>
              <a
                href="/guide"
                className="inline-flex items-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                투자자 가이드 보기 <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
