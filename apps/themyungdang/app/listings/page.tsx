import { LayoutGrid, Map } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { ListingCard } from '@/components/listing-card'
import { ListingsMap } from '@/components/listings-map'
import {
  LISTINGS,
  TYPE_LABEL,
  type ListingType,
} from '@/lib/mock-data'

const REGIONS = [
  '서울',
  '경기',
  '인천',
  '부산',
  '대구',
  '대전',
  '광주',
  '울산',
  '강원',
  '충청',
  '전라',
  '경상',
  '제주',
]

interface ListingsPageProps {
  searchParams: { type?: string; region?: string; q?: string; sort?: string; view?: string }
}

export default function ListingsPage({ searchParams }: ListingsPageProps) {
  const { type, region, q, sort = 'recommended', view } = searchParams
  const isMapView = view === 'map'

  let results = LISTINGS.slice()
  if (type) results = results.filter((l) => l.type === type)
  if (region) results = results.filter((l) => l.region === region)
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(needle) ||
        l.fullAddress.toLowerCase().includes(needle) ||
        l.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }

  results = [...results].sort((a, b) => {
    switch (sort) {
      case 'rent-asc':
        return a.monthlyRent - b.monthlyRent
      case 'rent-desc':
        return b.monthlyRent - a.monthlyRent
      case 'area-desc':
        return b.area - a.area
      case 'area-asc':
        return a.area - b.area
      case 'newest':
        return b.createdAt.localeCompare(a.createdAt)
      default:
        return b.viewCount - a.viewCount
    }
  })

  const typeLabel = type ? TYPE_LABEL[type as ListingType] : null

  return (
    <main className="bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">
            {typeLabel ? `${typeLabel} 매물` : '전체 매물'}
            {region && (
              <span className="ml-2 text-base font-normal text-gray-500">· {region}</span>
            )}
            {q && (
              <span className="ml-2 text-base font-normal text-gray-500">‘{q}’ 검색 결과</span>
            )}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            본인 확인 매물 위주 · 총 {LISTINGS.length}건 등록
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="space-y-5">
            <FilterGroup title="거래 유형">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { type: undefined })} active={!type}>
                  전체 ({LISTINGS.length})
                </FilterLink>
                {(['transfer', 'new', 'sale'] as ListingType[]).map((t) => {
                  const count = LISTINGS.filter((l) => l.type === t).length
                  return (
                    <FilterLink
                      key={t}
                      href={makeHref(searchParams, { type: t })}
                      active={type === t}
                    >
                      {TYPE_LABEL[t]} ({count})
                    </FilterLink>
                  )
                })}
              </div>
            </FilterGroup>

            <FilterGroup title="지역">
              <div className="space-y-1">
                <FilterLink
                  href={makeHref(searchParams, { region: undefined })}
                  active={!region}
                >
                  전국
                </FilterLink>
                {REGIONS.map((r) => {
                  const count = LISTINGS.filter((l) => l.region === r).length
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

          {/* Results */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-gray-700">{results.length}건</h2>
              {/* List / Map toggle */}
              <div className="flex overflow-hidden rounded-lg border border-gray-200 text-sm">
                <a
                  href={makeHref(searchParams, { view: undefined })}
                  className={
                    'flex items-center gap-1.5 px-3 py-2 transition-colors ' +
                    (!isMapView
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50')
                  }
                  aria-label="목록 보기"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  목록
                </a>
                <a
                  href={makeHref(searchParams, { view: 'map' })}
                  className={
                    'flex items-center gap-1.5 border-l border-gray-200 px-3 py-2 transition-colors ' +
                    (isMapView
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50')
                  }
                  aria-label="지도 보기"
                >
                  <Map className="h-3.5 w-3.5" />
                  지도
                </a>
              </div>
            </div>

            {isMapView ? (
              <ListingsMap listings={results} />
            ) : results.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-sm text-gray-500">
                  검색 결과가 없습니다. 필터를 줄여 다시 시도해보세요.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((l) => (
                  <ListingCard key={l.id} listing={l} />
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
  { key: 'recommended', label: '인기순' },
  { key: 'newest', label: '최신 등록순' },
  { key: 'rent-asc', label: '월세 낮은 순' },
  { key: 'rent-desc', label: '월세 높은 순' },
  { key: 'area-desc', label: '평수 큰 순' },
  { key: 'area-asc', label: '평수 작은 순' },
]

function makeHref(
  current: ListingsPageProps['searchParams'],
  changes: Partial<ListingsPageProps['searchParams']>,
) {
  const next = { ...current, ...changes }
  const params = new URLSearchParams()
  if (next.type) params.set('type', next.type)
  if (next.region) params.set('region', next.region)
  if (next.q) params.set('q', next.q)
  if (next.sort && next.sort !== 'recommended') params.set('sort', next.sort)
  if (next.view) params.set('view', next.view)
  const qs = params.toString()
  return qs ? `/listings?${qs}` : '/listings'
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
