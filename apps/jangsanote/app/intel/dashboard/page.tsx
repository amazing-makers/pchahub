import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'
import { ArrowLeft, BarChart2, FileText, Flame, MapPin, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { IntelTrendBar } from '@/components/intel-trend-bar'
import {
  INTEL_CATEGORY_LABEL,
  INTEL_REGIONS,
  INTELS,
  TREND_LABEL,
  type IntelCategory,
  type IntelTrend,
} from '@/lib/mock-intel'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '전국 상권 인텔 현황판',
  description:
    '전국 상권 인텔 리포트를 지역별·업종별로 집계한 현황 대시보드. 상승·안정·침체 상권을 한눈에 파악하세요.',
  path: '/intel/dashboard',
})

// ── Computed stats ────────────────────────────────────────────────────────────

const totalReports = INTELS.length
const upReports = INTELS.filter((i) => i.trend === 'up')
const upCount = upReports.length
const thisMonthCutoff = '2026-05' // 이달 기준
const newThisMonth = INTELS.filter((i) => i.createdAt.startsWith(thisMonthCutoff)).length

// Popular category
const catCounts = Object.fromEntries(
  (Object.keys(INTEL_CATEGORY_LABEL) as IntelCategory[]).map((k) => [
    k,
    INTELS.filter((i) => i.category === k).length,
  ]),
)
const topCategoryKey = (Object.keys(catCounts) as IntelCategory[]).sort(
  (a, b) => (catCounts[b] ?? 0) - (catCounts[a] ?? 0),
)[0] as IntelCategory | undefined
const topCategoryLabel = topCategoryKey ? INTEL_CATEGORY_LABEL[topCategoryKey] : '-'

// Region UP counts for bar chart
const regionUpCounts = INTEL_REGIONS.map((region) => ({
  region,
  upCount: INTELS.filter((i) => i.region === region && i.trend === 'up').length,
  total: INTELS.filter((i) => i.region === region).length,
})).sort((a, b) => b.upCount - a.upCount)

const maxRegionUp = Math.max(...regionUpCounts.map((r) => r.upCount), 1)

// Category × trend matrix
type TrendKey = 'up' | 'stable' | 'down'
const trendKeys: TrendKey[] = ['up', 'stable', 'down']
const categoryKeys = Object.keys(INTEL_CATEGORY_LABEL) as IntelCategory[]

const matrixData = categoryKeys
  .map((cat) => ({
    cat,
    label: INTEL_CATEGORY_LABEL[cat],
    counts: Object.fromEntries(
      trendKeys.map((tr) => [tr, INTELS.filter((i) => i.category === cat && i.trend === tr).length]),
    ) as Record<TrendKey, number>,
    total: INTELS.filter((i) => i.category === cat).length,
  }))
  .filter((row) => row.total > 0)

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IntelDashboardPage() {
  return (
    <main className="bg-gray-50 pb-24">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <a
            href="/intel"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            상권 인텔 목록
          </a>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-h3 font-bold text-gray-900">전국 상권 인텔 현황판</h1>
              <p className="mt-1 text-sm text-gray-500">
                점주들이 직접 작성한 상권 리포트를 집계한 실시간 대시보드
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-10">
        {/* Stats row */}
        <section>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              icon={<FileText className="h-5 w-5 text-blue-500" />}
              label="전체 리포트"
              value={`${totalReports}건`}
              bg="bg-blue-50"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5 text-green-500" />}
              label="상승 상권"
              value={`${upCount}곳`}
              bg="bg-green-50"
            />
            <StatCard
              icon={<BarChart2 className="h-5 w-5 text-purple-500" />}
              label="이달 신규"
              value={`${newThisMonth}건`}
              bg="bg-purple-50"
            />
            <StatCard
              icon={<Flame className="h-5 w-5 text-orange-500" />}
              label="인기 카테고리"
              value={topCategoryLabel}
              bg="bg-orange-50"
            />
          </div>
        </section>

        {/* Regional trend bars */}
        <section>
          <h2 className="mb-1 text-lg font-bold text-gray-900">지역별 상권 동향</h2>
          <p className="mb-4 text-sm text-gray-500">
            상승 리포트(trend: UP) 수 기준 — 상위 8개 지역
          </p>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-1">
                {regionUpCounts.slice(0, 8).map((r) => {
                  const trend: 'UP' | 'STABLE' | 'DOWN' =
                    r.upCount > 0
                      ? 'UP'
                      : r.total > 0
                        ? 'STABLE'
                        : 'DOWN'
                  return (
                    <IntelTrendBar
                      key={r.region}
                      label={r.region}
                      value={r.upCount}
                      trend={trend}
                      maxValue={maxRegionUp}
                    />
                  )
                })}
              </div>
              <p className="mt-4 text-xs text-gray-400">
                * 막대 길이 = 상승 리포트 수 / 가장 많은 지역 기준
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Category × Trend matrix */}
        <section>
          <h2 className="mb-1 text-lg font-bold text-gray-900">카테고리 핫스팟</h2>
          <p className="mb-4 text-sm text-gray-500">업종별 상승·안정·침체 리포트 분포</p>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full min-w-[400px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">업종</th>
                    <th className="px-4 py-3 text-center font-semibold text-green-700">
                      상승 ↑
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500">
                      안정 →
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-red-500">
                      침체 ↓
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">
                      합계
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {matrixData.map((row) => (
                    <tr key={row.cat} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{row.label}</td>
                      <td className="px-4 py-3 text-center">
                        {row.counts.up > 0 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                            {row.counts.up}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {row.counts.stable > 0 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                            {row.counts.stable}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {row.counts.down > 0 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                            {row.counts.down}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-500">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center">
          <a
            href="/intel"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            전체 리포트 보기 →
          </a>
        </div>
      </div>
    </main>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode
  label: string
  value: string
  bg: string
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className={`mb-3 inline-flex rounded-lg p-2 ${bg}`}>{icon}</div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="mt-0.5 text-xs text-gray-500">{label}</p>
      </CardContent>
    </Card>
  )
}
