import type { Metadata } from 'next'
import { Building2, Plus, Search } from 'lucide-react'
import { ContractorCard } from '@/components/contractor-card'
import { MobileFilterToggle } from '@/components/mobile-filter-toggle'
import { CATEGORIES, CONTRACTORS } from '@/lib/mock-data'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('gongganhansu', {
  title: '시공사 디렉토리',
  description: 'F&B 매장 시공 전문 시공사 목록. 평당 단가·예산 범위·시공 카테고리로 비교하세요.',
  path: '/contractors',
})

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주']

const SORT_OPTIONS = [
  { value: 'rating', label: '평점 높은 순' },
  { value: 'price-asc', label: '단가 낮은 순' },
  { value: 'price-desc', label: '단가 높은 순' },
  { value: 'projects', label: '시공 건수 순' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

interface ContractorsPageProps {
  searchParams: { region?: string; specialty?: string; q?: string; sort?: string }
}

export default function ContractorsPage({ searchParams }: ContractorsPageProps) {
  const { region, specialty, q, sort } = searchParams
  const activeSort: SortValue =
    (SORT_OPTIONS.find((o) => o.value === sort)?.value ?? 'rating') as SortValue
  const needle = q?.toLowerCase().trim() ?? ''
  let results = CONTRACTORS.slice()
  if (region) results = results.filter((c) => c.region === region)
  if (specialty) results = results.filter((c) => c.specialties.includes(specialty))
  if (needle) {
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.specialties.some((s) => s.toLowerCase().includes(needle)) ||
        c.region.toLowerCase().includes(needle) ||
        c.tagline.toLowerCase().includes(needle) ||
        c.highlights.some((h) => h.toLowerCase().includes(needle)),
    )
  }

  // Sort results
  if (activeSort === 'rating') {
    results = results.sort((a, b) => b.rating - a.rating)
  } else if (activeSort === 'price-asc') {
    results = results.sort((a, b) => a.avgPricePerPyeong - b.avgPricePerPyeong)
  } else if (activeSort === 'price-desc') {
    results = results.sort((a, b) => b.avgPricePerPyeong - a.avgPricePerPyeong)
  } else if (activeSort === 'projects') {
    results = results.sort((a, b) => b.projectCount - a.projectCount)
  }

  const listJsonLd = buildItemListJsonLd({
    url: 'https://gongganhansu.amakers.co.kr/contractors',
    items: results.slice(0, 20).map((c) => ({ name: c.name, url: `https://gongganhansu.amakers.co.kr/contractors/${c.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-h3 font-bold text-gray-900">시공사 디렉토리</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                F&B 매장 시공 전문 시공사 {CONTRACTORS.length}곳. 평당 단가·예산 범위·시공 카테고리로 비교.
              </p>
            </div>
            <a
              href="/contractors/new"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              시공사 등록
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {/* Mobile filter toggle — shown below header on small screens */}
        <div className="mb-4">
          <MobileFilterToggle>
            <div className="space-y-5">
              <FilterGroup title="정렬">
                <div className="space-y-1">
                  {SORT_OPTIONS.map((o) => (
                    <FilterLink
                      key={o.value}
                      href={makeHref(searchParams, { sort: o.value })}
                      active={activeSort === o.value}
                    >
                      {o.label}
                    </FilterLink>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="지역">
                <div className="space-y-1">
                  <FilterLink href={makeHref(searchParams, { region: undefined })} active={!region}>
                    전체
                  </FilterLink>
                  {REGIONS.map((r) => {
                    const count = CONTRACTORS.filter((c) => c.region === r).length
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

              <FilterGroup title="전문 카테고리">
                <div className="space-y-1">
                  <FilterLink
                    href={makeHref(searchParams, { specialty: undefined })}
                    active={!specialty}
                  >
                    전체
                  </FilterLink>
                  {CATEGORIES.map((c) => (
                    <FilterLink
                      key={c.key}
                      href={makeHref(searchParams, { specialty: c.key })}
                      active={specialty === c.key}
                    >
                      {c.label}
                    </FilterLink>
                  ))}
                </div>
              </FilterGroup>
            </div>
          </MobileFilterToggle>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Desktop sidebar */}
          <aside className="hidden space-y-5 lg:block lg:sticky lg:top-20 lg:self-start">
            <FilterGroup title="정렬">
              <div className="space-y-1">
                {SORT_OPTIONS.map((o) => (
                  <FilterLink
                    key={o.value}
                    href={makeHref(searchParams, { sort: o.value })}
                    active={activeSort === o.value}
                  >
                    {o.label}
                  </FilterLink>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="지역">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { region: undefined })} active={!region}>
                  전체
                </FilterLink>
                {REGIONS.map((r) => {
                  const count = CONTRACTORS.filter((c) => c.region === r).length
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

            <FilterGroup title="전문 카테고리">
              <div className="space-y-1">
                <FilterLink
                  href={makeHref(searchParams, { specialty: undefined })}
                  active={!specialty}
                >
                  전체
                </FilterLink>
                {CATEGORIES.map((c) => (
                  <FilterLink
                    key={c.key}
                    href={makeHref(searchParams, { specialty: c.key })}
                    active={specialty === c.key}
                  >
                    {c.label}
                  </FilterLink>
                ))}
              </div>
            </FilterGroup>
          </aside>

          <div>
            {/* Search bar */}
            <form method="GET" action="/contractors" className="mb-4 flex gap-2">
              {region && <input type="hidden" name="region" value={region} />}
              {specialty && <input type="hidden" name="specialty" value={specialty} />}
              {activeSort !== 'rating' && <input type="hidden" name="sort" value={activeSort} />}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  name="q"
                  type="search"
                  defaultValue={q ?? ''}
                  placeholder="시공사명, 전문분야, 특징 검색…"
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                style={{ background: 'var(--brand-primary)' }}
              >
                검색
              </button>
              {q && (
                <a
                  href={makeHref({ region, specialty }, {})}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  초기화
                </a>
              )}
            </form>
            <div className="mb-3 text-sm font-semibold text-gray-700">
              {q ? (
                <>
                  <span className="font-normal text-gray-500">&ldquo;{q}&rdquo;</span> 검색 결과{' '}
                  {results.length}곳
                </>
              ) : (
                <>{results.length}곳</>
              )}
            </div>
            {results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                <Building2 className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm font-medium text-gray-500">조건에 맞는 시공사가 없습니다</p>
                <a
                  href="/contractors"
                  className="mt-4 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  전체 보기
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((c) => (
                  <ContractorCard key={c.id} contractor={c} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function makeHref(
  current: Omit<ContractorsPageProps['searchParams'], 'q'>,
  changes: Partial<Omit<ContractorsPageProps['searchParams'], 'q'>>,
) {
  const next = { ...current, ...changes }
  const params = new URLSearchParams()
  if (next.region) params.set('region', next.region)
  if (next.specialty) params.set('specialty', next.specialty)
  if (next.sort && next.sort !== 'rating') params.set('sort', next.sort)
  const qs = params.toString()
  return qs ? `/contractors?${qs}` : '/contractors'
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
