import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { BrandCard } from '@/components/brand-card'
import { CATEGORIES, FEATURED_BRANDS } from '@/lib/mock-data'
import { getBrands, getDataSourceLabel } from '@/lib/kftc/source'

interface BrandsPageProps {
  searchParams: { category?: string; region?: string; q?: string; sort?: string; page?: string }
}

const PAGE_SIZE = 48

export const revalidate = 3600 // 1시간 캐시

export default async function BrandsPage({ searchParams }: BrandsPageProps) {
  const [allBrands, dataSource] = await Promise.all([getBrands(), Promise.resolve(getDataSourceLabel())])
  const { category: activeCategory, region: activeRegion, q, sort = 'recommended', page } = searchParams
  const pageNum = Math.max(1, parseInt(page ?? '1', 10) || 1)

  let results = allBrands.filter((b) => !b.featured)
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

  const totalResults = results.length
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE))
  const currentPage = Math.min(pageNum, totalPages)
  const pagedResults = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

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
                    '{q}' 검색 결과
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                공정거래위원회 가맹정보 기준 · 총 {allBrands.length.toLocaleString()}개 브랜드
                {dataSource === 'kftc' && (
                  <span className="ml-1.5 inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700">
                    실시간
                  </span>
                )}
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
                <FilterLink href={makeHref(searchParams, { category: undefined, page: undefined })} active={!activeCategory}>
                  전체 ({allBrands.length.toLocaleString()})
                </FilterLink>
                {CATEGORIES.map((c) => {
                  const count = allBrands.filter((b) => b.category === c.key).length
                  if (count === 0) return null
                  return (
                    <FilterLink
                      key={c.key}
                      href={makeHref(searchParams, { category: c.key, page: undefined })}
                      active={activeCategory === c.key}
                    >
                      {c.label} ({count.toLocaleString()})
                    </FilterLink>
                  )
                })}
              </div>
            </FilterGroup>

            <FilterGroup title="본사 지역">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { region: undefined, page: undefined })} active={!activeRegion}>
                  전국 ({allBrands.length.toLocaleString()})
                </FilterLink>
                {REGION_OPTIONS.map((r) => {
                  const count = allBrands.filter((b) => b.hqRegion === r).length
                  if (count === 0) return null
                  return (
                    <FilterLink
                      key={r}
                      href={makeHref(searchParams, { region: r, page: undefined })}
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
                    href={makeHref(searchParams, { sort: s.key, page: undefined })}
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
                  {dataSource === 'kftc'
                    ? '공정거래위원회 가맹정보 실 API 데이터 · 매일 자동 갱신.'
                    : '공정거래위원회 협회 등록 정보공개서 기준이며, 분기마다 업데이트됩니다.'}
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
                  {totalResults > 0
                    ? `${((currentPage - 1) * PAGE_SIZE + 1).toLocaleString()}–${Math.min(currentPage * PAGE_SIZE, totalResults).toLocaleString()} / 총 ${totalResults.toLocaleString()}개`
                    : '0개 브랜드'}
                </h2>
                {totalPages > 1 && (
                  <span className="text-xs text-gray-400">{currentPage} / {totalPages} 페이지</span>
                )}
              </div>
              {pagedResults.length === 0 ? (
                <Card>
                  <CardContent className="p-10 text-center text-sm text-gray-500">
                    검색 결과가 없습니다. 필터를 줄여 다시 시도해보세요.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {pagedResults.map((b) => (
                    <BrandCard key={b.id} brand={b} />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  searchParams={searchParams}
                />
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
  // page=1은 URL에서 생략 (깔끔한 URL)
  if (next.page && next.page !== '1') params.set('page', next.page)
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

function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number
  totalPages: number
  searchParams: BrandsPageProps['searchParams']
}) {
  // 현재 페이지 주변 최대 5개 페이지 번호 표시
  const delta = 2
  const range: number[] = []
  for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
    range.push(i)
  }
  const rangeFirst = range[0] ?? 1
  const rangeLast = range[range.length - 1] ?? totalPages
  const showStartEllipsis = rangeFirst > 2
  const showEndEllipsis = rangeLast < totalPages - 1

  const pageHref = (p: number) => makeHref(searchParams, { page: String(p) })

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="페이지 탐색">
      <a
        href={pageHref(currentPage - 1)}
        aria-disabled={currentPage <= 1}
        className={
          'flex h-8 w-8 items-center justify-center rounded-md border text-sm ' +
          (currentPage <= 1
            ? 'pointer-events-none border-gray-100 text-gray-300'
            : 'border-gray-200 text-gray-700 hover:bg-gray-50')
        }
      >
        &lsaquo;
      </a>

      {rangeFirst > 1 && (
        <a href={pageHref(1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
          1
        </a>
      )}
      {showStartEllipsis && <span className="px-1 text-gray-400">…</span>}

      {range.map((p) => (
        <a
          key={p}
          href={pageHref(p)}
          aria-current={p === currentPage ? 'page' : undefined}
          className={
            'flex h-8 w-8 items-center justify-center rounded-md border text-sm ' +
            (p === currentPage
              ? 'border-gray-900 bg-gray-900 font-medium text-white'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50')
          }
        >
          {p}
        </a>
      ))}

      {showEndEllipsis && <span className="px-1 text-gray-400">…</span>}
      {rangeLast < totalPages && (
        <a href={pageHref(totalPages)} className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
          {totalPages}
        </a>
      )}

      <a
        href={pageHref(currentPage + 1)}
        aria-disabled={currentPage >= totalPages}
        className={
          'flex h-8 w-8 items-center justify-center rounded-md border text-sm ' +
          (currentPage >= totalPages
            ? 'pointer-events-none border-gray-100 text-gray-300'
            : 'border-gray-200 text-gray-700 hover:bg-gray-50')
        }
      >
        &rsaquo;
      </a>
    </nav>
  )
}
