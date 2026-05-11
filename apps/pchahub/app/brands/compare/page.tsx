import { ArrowLeft, ArrowRight, CheckCircle2, Crown, Plus, X } from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { CompareRestoreBanner } from '@/components/compare-redirect'
import { BRANDS, type MockBrand } from '@/lib/mock-data'
import {
  getBrandDetail,
  totalStartupCost,
  type BrandDetail,
} from '@/lib/mock-brand-detail'

interface ComparePageProps {
  searchParams: { ids?: string }
}

const MAX_COMPARE = 3

export default function ComparePage({ searchParams }: ComparePageProps) {
  const ids = parseIds(searchParams.ids).slice(0, MAX_COMPARE)
  const entries: Array<{ brand: MockBrand; detail: BrandDetail }> = ids
    .map((id) => {
      const brand = BRANDS.find((b) => b.id === id)
      if (!brand) return null
      return { brand, detail: getBrandDetail(brand) }
    })
    .filter((x): x is { brand: MockBrand; detail: BrandDetail } => x !== null)

  // Brands available to add — same category as the first selected brand if any,
  // otherwise all unselected brands.
  const seedCategory = entries[0]?.brand.category
  const candidates = BRANDS.filter((b) => !ids.includes(b.id))
  const suggestions = seedCategory
    ? candidates.filter((b) => b.category === seedCategory).slice(0, 6)
    : candidates.slice(0, 6)

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <a
            href="/brands"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> 브랜드 검색
          </a>
          <h1 className="mt-3 text-h3 font-bold text-gray-900">브랜드 비교</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            최대 {MAX_COMPARE}개 브랜드를 한 화면에 놓고 비교합니다. 각 항목에서 가장 좋은 값에는
            상단에 표시가 붙습니다.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {entries.length === 0 ? (
          <>
            <CompareRestoreBanner />
            <EmptyState />
          </>
        ) : (
          <>
            <CompareTable entries={entries} ids={ids} />

            {entries.length < MAX_COMPARE && suggestions.length > 0 && (
              <Suggestions
                suggestions={suggestions}
                ids={ids}
                seedCategory={seedCategory}
              />
            )}

            <BottomCTA entries={entries} />
          </>
        )}
      </div>
    </main>
  )
}

// ============================================================
// Empty state
// ============================================================

function EmptyState() {
  const start = BRANDS.slice(0, 6)
  return (
    <Card className="border-gray-200">
      <CardContent className="p-10">
        <div className="text-center">
          <h2 className="text-h4 font-semibold text-gray-900">비교할 브랜드를 선택하세요</h2>
          <p className="mt-2 text-sm text-gray-500">
            아래 브랜드 중 하나를 선택해 시작하거나, 브랜드 검색 페이지로 이동하세요.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {start.map((b) => (
            <a
              key={b.id}
              href={`/brands/compare?ids=${b.id}`}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-400"
            >
              <span
                className="h-10 w-10 shrink-0 rounded-lg"
                style={{ background: b.logoColor }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-gray-900">{b.name}</div>
                <div className="text-xs text-gray-500">{b.categoryLabel}</div>
              </div>
              <Plus className="h-4 w-4 text-gray-400" />
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="/brands">
            <Button variant="outline">전체 브랜드 보기</Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================
// Compare table
// ============================================================

interface CompareRow {
  label: string
  /** Compute the value to display per entry. */
  render: (e: { brand: MockBrand; detail: BrandDetail }) => string
  /** Numeric value for "best of" highlight. Optional. */
  numeric?: (e: { brand: MockBrand; detail: BrandDetail }) => number
  /** Higher value is better? (default true). Ignored if numeric is undefined. */
  higherIsBetter?: boolean
  group: string
}

const ROWS: CompareRow[] = [
  { group: '기본', label: '카테고리', render: (e) => e.brand.categoryLabel },
  {
    group: '기본',
    label: '본사 운영',
    render: (e) => `${2026 - e.detail.hq.foundedYear}년차`,
    numeric: (e) => 2026 - e.detail.hq.foundedYear,
    higherIsBetter: true,
  },
  {
    group: '기본',
    label: '가맹사업 시작',
    render: (e) => `${e.detail.hq.franchiseStartYear}년`,
    numeric: (e) => -e.detail.hq.franchiseStartYear,
  },
  {
    group: '규모',
    label: '매장 수',
    render: (e) => `${formatNumber(e.brand.storeCount)}개`,
    numeric: (e) => e.brand.storeCount,
    higherIsBetter: true,
  },
  {
    group: '규모',
    label: '전년 대비 성장률',
    render: (e) => `+${e.brand.growthRate}%`,
    numeric: (e) => e.brand.growthRate,
    higherIsBetter: true,
  },
  {
    group: '매출',
    label: '평균 월매출',
    render: (e) => `${formatNumber(e.detail.revenue.averageMonthly)}만`,
    numeric: (e) => e.detail.revenue.averageMonthly,
    higherIsBetter: true,
  },
  {
    group: '매출',
    label: '평균 영업이익 (월)',
    render: (e) => `${formatNumber(e.detail.revenue.averageOperatingProfit)}만`,
    numeric: (e) => e.detail.revenue.averageOperatingProfit,
    higherIsBetter: true,
  },
  {
    group: '비용',
    label: '총 창업비',
    render: (e) => `${formatNumber(totalStartupCost(e.detail.costs))}만`,
    numeric: (e) => totalStartupCost(e.detail.costs),
    higherIsBetter: false,
  },
  {
    group: '비용',
    label: '가맹비',
    render: (e) => `${formatNumber(e.detail.costs.franchiseFee)}만`,
    numeric: (e) => e.detail.costs.franchiseFee,
    higherIsBetter: false,
  },
  {
    group: '비용',
    label: '보증금',
    render: (e) => `${formatNumber(e.detail.costs.deposit)}만`,
    numeric: (e) => e.detail.costs.deposit,
    higherIsBetter: false,
  },
  {
    group: '비용',
    label: '인테리어비',
    render: (e) => `${formatNumber(e.detail.costs.interiorFee)}만`,
    numeric: (e) => e.detail.costs.interiorFee,
    higherIsBetter: false,
  },
  {
    group: '비용',
    label: '월 로열티',
    render: (e) =>
      e.detail.costs.royaltyType === 'none'
        ? '없음'
        : e.detail.costs.royaltyType === 'percentage'
          ? `매출 ${e.detail.costs.royaltyValue}%`
          : `${formatNumber(e.detail.costs.royaltyValue)}만`,
    numeric: (e) =>
      e.detail.costs.royaltyType === 'none' ? 0 : e.detail.costs.royaltyValue,
    higherIsBetter: false,
  },
  {
    group: '운영',
    label: '권장 면적',
    render: (e) => `${e.detail.costs.recommendedArea}평`,
  },
  {
    group: '운영',
    label: '평균 인력',
    render: (e) => `${e.detail.operations.averageStaff}명`,
    numeric: (e) => e.detail.operations.averageStaff,
    higherIsBetter: false,
  },
  {
    group: '운영',
    label: '영업 시간',
    render: (e) => e.detail.operations.operatingHours,
  },
  {
    group: '운영',
    label: '주력 채널',
    render: (e) => e.detail.operations.primaryChannel,
  },
  {
    group: '평가',
    label: '점주 평가',
    render: (e) => {
      if (e.detail.reviews.length === 0) return '-'
      const avg =
        e.detail.reviews.reduce((s, r) => s + r.rating, 0) / e.detail.reviews.length
      return `${avg.toFixed(1)} / 5 (${e.detail.reviews.length}건)`
    },
    numeric: (e) => {
      if (e.detail.reviews.length === 0) return 0
      return e.detail.reviews.reduce((s, r) => s + r.rating, 0) / e.detail.reviews.length
    },
    higherIsBetter: true,
  },
]

function CompareTable({
  entries,
  ids,
}: {
  entries: Array<{ brand: MockBrand; detail: BrandDetail }>
  ids: string[]
}) {
  // pre-compute best index per row
  const bestIndexPerRow: (number | null)[] = ROWS.map((row) => {
    if (!row.numeric || entries.length < 2) return null
    const values = entries.map(row.numeric)
    const higher = row.higherIsBetter !== false
    let best = 0
    for (let i = 1; i < values.length; i++) {
      if (higher ? values[i] > values[best] : values[i] < values[best]) best = i
    }
    // If all equal, no winner
    if (values.every((v) => v === values[0])) return null
    return best
  })

  const groups = Array.from(new Set(ROWS.map((r) => r.group)))

  return (
    <Card className="overflow-hidden border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          {/* Header row — brand cards */}
          <thead className="bg-white">
            <tr className="border-b border-gray-200">
              <th className="sticky left-0 z-10 bg-white px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                비교 항목
              </th>
              {entries.map((e) => {
                const remainingIds = ids.filter((id) => id !== e.brand.id)
                const removeUrl =
                  remainingIds.length === 0
                    ? '/brands/compare'
                    : `/brands/compare?ids=${remainingIds.join(',')}`
                return (
                  <th key={e.brand.id} className="px-4 py-4 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <a href={`/brands/${e.brand.id}`} className="flex items-center gap-2.5">
                        <span
                          className="h-10 w-10 shrink-0 rounded-lg"
                          style={{ background: e.brand.logoColor }}
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="truncate text-sm font-bold text-gray-900">
                              {e.brand.name}
                            </span>
                            {e.brand.hqVerified && (
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{e.brand.categoryLabel}</div>
                        </div>
                      </a>
                      <a
                        href={removeUrl}
                        className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        aria-label={`${e.brand.name} 비교에서 제거`}
                      >
                        <X className="h-4 w-4" />
                      </a>
                    </div>
                  </th>
                )
              })}
              {entries.length < MAX_COMPARE && (
                <th className="px-4 py-4 text-left align-middle">
                  <div className="text-xs text-gray-400">아래에서 브랜드를 추가하세요</div>
                </th>
              )}
            </tr>
          </thead>

          {groups.map((group) => (
            <tbody key={group}>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td
                  colSpan={Math.max(entries.length, 1) + 1 + (entries.length < MAX_COMPARE ? 1 : 0)}
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {group}
                </td>
              </tr>
              {ROWS.filter((r) => r.group === group).map((row) => {
                const rowIdx = ROWS.indexOf(row)
                const bestIdx = bestIndexPerRow[rowIdx]
                return (
                  <tr key={row.label} className="border-b border-gray-100 last:border-0">
                    <td className="sticky left-0 z-10 bg-white px-5 py-3 text-xs text-gray-500">
                      {row.label}
                    </td>
                    {entries.map((e, i) => (
                      <td
                        key={e.brand.id}
                        className={
                          'px-4 py-3 ' +
                          (bestIdx === i
                            ? 'bg-emerald-50 font-bold text-emerald-700'
                            : 'text-gray-900')
                        }
                      >
                        <div className="flex items-center gap-1.5">
                          {bestIdx === i && <Crown className="h-3.5 w-3.5 text-emerald-600" />}
                          {row.render(e)}
                        </div>
                      </td>
                    ))}
                    {entries.length < MAX_COMPARE && <td className="px-4 py-3" />}
                  </tr>
                )
              })}
            </tbody>
          ))}

          {/* CTA row */}
          <tfoot className="bg-white">
            <tr>
              <td className="sticky left-0 z-10 bg-white px-5 py-4" />
              {entries.map((e) => (
                <td key={e.brand.id} className="px-4 py-4">
                  <a href={`/inquiry?brand=${e.brand.id}`}>
                    <Button size="sm" className="w-full">
                      상담 신청
                    </Button>
                  </a>
                </td>
              ))}
              {entries.length < MAX_COMPARE && <td className="px-4 py-4" />}
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  )
}

// ============================================================
// Add-brand suggestions
// ============================================================

function Suggestions({
  suggestions,
  ids,
  seedCategory,
}: {
  suggestions: MockBrand[]
  ids: string[]
  seedCategory?: string
}) {
  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <Plus className="h-4 w-4 text-gray-400" />
        <h2 className="text-sm font-semibold text-gray-900">
          비교에 추가할 브랜드
          {seedCategory && (
            <span className="ml-2 text-xs font-normal text-gray-500">
              · 같은 카테고리 우선 표시
            </span>
          )}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((b) => {
          const newIds = [...ids, b.id]
          return (
            <a
              key={b.id}
              href={`/brands/compare?ids=${newIds.join(',')}`}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-colors hover:border-gray-400"
            >
              <span
                className="h-9 w-9 shrink-0 rounded-lg"
                style={{ background: b.logoColor }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-gray-900">{b.name}</div>
                <div className="text-xs text-gray-500">
                  {b.categoryLabel} · 매장 {b.storeCount}개
                </div>
              </div>
              <Plus className="h-4 w-4 text-gray-400" />
            </a>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================
// Bottom CTA
// ============================================================

function BottomCTA({ entries }: { entries: Array<{ brand: MockBrand; detail: BrandDetail }> }) {
  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center">
      <h2 className="text-h4 font-bold text-gray-900">
        결정에 도움되셨나요?
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
        선택한 브랜드에 직접 상담을 신청하거나, 창업 스캐너로 본인 조건을 입력해 추천을 받아보세요.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <a href="/scanner">
          <Button size="lg" variant="outline" className="gap-1">
            창업 스캐너로 다시 추천받기 <ArrowRight className="h-4 w-4" />
          </Button>
        </a>
        {entries[0] && (
          <a href={`/inquiry?brand=${entries[0].brand.id}`}>
            <Button size="lg">상위 브랜드 상담 신청</Button>
          </a>
        )}
      </div>
    </div>
  )
}

// ============================================================
// Helpers
// ============================================================

function parseIds(raw?: string): string[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
