import { Card, CardContent } from '@amakers/ui'
import { StoreCard } from '@/components/store-card'
import { BRANDS, CATEGORIES, STORES } from '@/lib/mock-data'

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산']

interface StoresPageProps {
  searchParams: { category?: string; region?: string; sort?: string; q?: string }
}

export default function StoresPage({ searchParams }: StoresPageProps) {
  const { category, region, q, sort = 'rating' } = searchParams

  let results = STORES.slice()
  if (category) {
    results = results.filter((s) => {
      const brand = BRANDS.find((b) => b.id === s.brandId)
      return brand?.category === category
    })
  }
  if (region) results = results.filter((s) => s.region === region)
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(needle) ||
        s.address.toLowerCase().includes(needle),
    )
  }

  results = [...results].sort((a, b) => {
    switch (sort) {
      case 'newest':
        return b.openedYear - a.openedYear
      case 'visitors':
        return b.monthlyVisitors - a.monthlyVisitors
      case 'reviews':
        return b.reviewCount - a.reviewCount
      default:
        return b.rating - a.rating
    }
  })

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">매장 디렉토리</h1>
          <p className="mt-1 text-sm text-gray-500">
            전국 프랜차이즈 인증 매장 {STORES.length}곳. 평점·방문객·신규 오픈 기준 정렬.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <FilterGroup title="카테고리">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { category: undefined })} active={!category}>
                  전체
                </FilterLink>
                {CATEGORIES.map((c) => (
                  <FilterLink
                    key={c.key}
                    href={makeHref(searchParams, { category: c.key })}
                    active={category === c.key}
                  >
                    {c.label}
                  </FilterLink>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="지역">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { region: undefined })} active={!region}>
                  전국
                </FilterLink>
                {REGIONS.map((r) => {
                  const count = STORES.filter((s) => s.region === r).length
                  if (count === 0) return null
                  return (
                    <FilterLink
                      key={r}
                      href={makeHref(searchParams, { region: r })}
                      active={region === r}
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
          </aside>

          <div>
            <div className="mb-3 text-sm font-semibold text-gray-700">{results.length}곳</div>
            {results.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-sm text-gray-500">
                  검색 결과가 없습니다.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((s) => (
                  <StoreCard key={s.id} store={s} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

const SORT_OPTIONS = [
  { key: 'rating', label: '평점 높은 순' },
  { key: 'visitors', label: '방문객 많은 순' },
  { key: 'reviews', label: '리뷰 많은 순' },
  { key: 'newest', label: '최근 오픈 순' },
]

function makeHref(
  current: StoresPageProps['searchParams'],
  changes: Partial<StoresPageProps['searchParams']>,
) {
  const next = { ...current, ...changes }
  const params = new URLSearchParams()
  if (next.category) params.set('category', next.category)
  if (next.region) params.set('region', next.region)
  if (next.q) params.set('q', next.q)
  if (next.sort && next.sort !== 'rating') params.set('sort', next.sort)
  const qs = params.toString()
  return qs ? `/stores?${qs}` : '/stores'
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
