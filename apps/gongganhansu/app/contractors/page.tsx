import type { Metadata } from 'next'
import { ArrowRight, BookOpen, Building2, MapPin, Plus, Search, Star, Store } from 'lucide-react'
import { Card, CardContent, MobileFilterDrawer } from '@amakers/ui'
import { ContractorCard } from '@/components/contractor-card'
import { MobileFilterToggle } from '@/components/mobile-filter-toggle'
import { CATEGORIES, CONTRACTORS } from '@/lib/mock-data'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'

export const metadata: Metadata = buildPageMetadata('gongganhansu', {
  title: '시공사 디렉토리',
  description: 'F&B 매장 시공 전문 시공사 목록. 평당 단가·예산 범위·시공 카테고리로 비교하세요.',
  path: '/contractors',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '공간한수', url: 'https://gongganhansu.amakers.co.kr' },
    { name: '시공사 디렉토리', url: 'https://gongganhansu.amakers.co.kr/contractors' },
  ],
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

  const totalProjects = CONTRACTORS.reduce((s, c) => s + c.projectCount, 0)
  const avgRating = CONTRACTORS.length
    ? (CONTRACTORS.reduce((s, c) => s + c.rating, 0) / CONTRACTORS.length).toFixed(1)
    : '-'
  const regionCount = new Set(CONTRACTORS.map((c) => c.region)).size

  const listJsonLd = buildItemListJsonLd({
    url: 'https://gongganhansu.amakers.co.kr/contractors',
    items: results.slice(0, 20).map((c) => ({ name: c.name, url: `https://gongganhansu.amakers.co.kr/contractors/${c.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
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

      {/* 통계 스트립 */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-4">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{CONTRACTORS.length}곳</span>
              <span className="text-[11px] font-semibold text-gray-700">등록 시공사</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{formatNumber(totalProjects)}</span>
              <span className="text-[11px] font-semibold text-gray-700">누적 시공</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">★ {avgRating}</span>
              <span className="text-[11px] font-semibold text-gray-700">평균 평점</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{regionCount}개</span>
              <span className="text-[11px] font-semibold text-gray-700">지역 커버</span>
            </div>
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
          <MobileFilterDrawer asideClassName="space-y-5 lg:sticky lg:top-20 lg:self-start">
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
          </MobileFilterDrawer>

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
                  aria-label="시공사명, 전문분야, 특징 검색…"
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

      {/* amakers 생태계 크로스링크 */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-6">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">amakers에서 더 알아보기</div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <a href="https://pchahub.amakers.co.kr/brands" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-indigo-500" />가맹 브랜드 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://bestplace.amakers.co.kr/stores" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" />우수 매장 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themyungdang.amakers.co.kr/listings" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-500" />창업 매물 찾기</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://jangsanote.amakers.co.kr" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-rose-500" />점주 커뮤니티</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">시공사 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 시공사·평당 단가 동향·인테리어 트렌드를 격주로 보내드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
                aria-label="이메일 주소"
                placeholder="이메일 주소"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                구독하기
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
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
