import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { BrandCard } from '@/components/brand-card'
import { CATEGORIES, BRANDS, FEATURED_BRANDS, RECRUITING_BRANDS } from '@/lib/mock-data'

interface BrandsPageProps {
  searchParams: { category?: string; region?: string; q?: string; sort?: string }
}

export default function BrandsPage({ searchParams }: BrandsPageProps) {
  const { category: activeCategory, region: activeRegion, q, sort = 'recommended' } = searchParams

  let results = BRANDS.filter((b) => !b.featured)
  if (activeCategory) {
    results = results.filter((b) => b.category === activeCategory)
  }
  if (activeRegion) {
    results = results.filter((b) => b.hqRegion === activeRegion)
  }
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (b) =>
        b.name.toLowerCase().includes(needle) ||
        b.categoryLabel.toLowerCase().includes(needle) ||
        b.description.toLowerCase().includes(needle),
    )
  }

  results = [...results].sort((a, b) => {
    switch (sort) {
      case 'cost-asc':
        return a.startupCost - b.startupCost
      case 'cost-desc':
        return b.startupCost - a.startupCost
      case 'growth-desc':
        return b.growthRate - a.growthRate
      case 'stores-desc':
        return b.storeCount - a.storeCount
      default:
        return b.growthRate - a.growthRate
    }
  })

  const categoryLabel = activeCategory
    ? CATEGORIES.find((c) => c.key === activeCategory)?.label
    : null

  return (
    <main className="bg-gray-50">
      {/* Page header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-h3 font-bold text-gray-900">
                {categoryLabel ? `${categoryLabel} 브랜드` : '전체 브랜드'}
                {q && (
                  <span className="ml-2 text-base font-normal text-gray-500">
                    ‘{q}’ 검색 결과
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                협회 등록 정보공개서 기준 · 총 {BRANDS.length}개 브랜드
              </p>
            </div>
            <a
              href="/brands/compare"
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              브랜드 비교하기 →
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Filter sidebar */}
          <aside className="space-y-5">
            <FilterGroup title="업종">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { category: undefined })} active={!activeCategory}>
                  전체 ({BRANDS.length})
                </FilterLink>
                {CATEGORIES.map((c) => {
                  const count = BRANDS.filter((b) => b.category === c.key).length
                  if (count === 0) return null
                  return (
                    <FilterLink
                      key={c.key}
                      href={makeHref(searchParams, { category: c.key })}
                      active={activeCategory === c.key}
                    >
                      {c.label} ({count})
                    </FilterLink>
                  )
                })}
              </div>
            </FilterGroup>

            <FilterGroup title="본사 지역">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { region: undefined })} active={!activeRegion}>
                  전국 ({BRANDS.length})
                </FilterLink>
                {REGION_OPTIONS.map((r) => {
                  const count = BRANDS.filter((b) => b.hqRegion === r).length
                  if (count === 0) return null
                  return (
                    <FilterLink
                      key={r}
                      href={makeHref(searchParams, { region: r })}
                      active={activeRegion === r}
                    >
                      {r} ({count})
                    </FilterLink>
                  )
                })}
              </div>
            </FilterGroup>

            <FilterGroup title="정렬">
              <div className="space-y-1">
                {SORT_OPTIONS.map((s) => (
                  <FilterLink
                    key={s.key}
                    href={makeHref(searchParams, { sort: s.key })}
                    active={sort === s.key}
                  >
                    {s.label}
                  </FilterLink>
                ))}
              </div>
            </FilterGroup>

            <Card className="border-gray-200 bg-indigo-50">
              <CardContent className="p-4 text-sm">
                <div className="font-semibold text-gray-900">데이터 출처</div>
                <p className="mt-1 text-xs text-gray-600">
                  모든 브랜드 정보는 공정거래위원회 협회 등록 정보공개서 기준이며, 분기마다
                  업데이트됩니다.
                </p>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="space-y-6">
            {!activeCategory && !q && FEATURED_BRANDS.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-700">상단 노출 (광고)</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {FEATURED_BRANDS.map((b) => (
                    <BrandCard key={b.id} brand={b} featured />
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                  {results.length}개 브랜드
                </h2>
              </div>
              {results.length === 0 ? (
                <Card>
                  <CardContent className="p-10 text-center text-sm text-gray-500">
                    검색 결과가 없습니다. 필터를 줄여 다시 시도해보세요.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((b) => (
                    <BrandCard key={b.id} brand={b} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const SORT_OPTIONS = [
  { key: 'recommended', label: '추천순' },
  { key: 'growth-desc', label: '성장률 높은 순' },
  { key: 'cost-asc', label: '창업비 낮은 순' },
  { key: 'cost-desc', label: '창업비 높은 순' },
  { key: 'stores-desc', label: '매장 수 많은 순' },
]

const REGION_OPTIONS = [
  '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산',
]

function makeHref(
  current: BrandsPageProps['searchParams'],
  changes: Partial<BrandsPageProps['searchParams']>,
) {
  const next = { ...current, ...changes }
  const params = new URLSearchParams()
  if (next.category) params.set('category', next.category)
  if (next.region) params.set('region', next.region)
  if (next.q) params.set('q', next.q)
  if (next.sort && next.sort !== 'recommended') params.set('sort', next.sort)
  const qs = params.toString()
  return qs ? `/brands?${qs}` : '/brands'
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={
        'block rounded-md px-3 py-1.5 text-sm transition-colors ' +
        (active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100')
      }
    >
      {children}
    </a>
  )
}
