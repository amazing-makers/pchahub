import type { Metadata } from 'next'
import { MapPin, Plus, Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { StoreCard } from '@/components/store-card'
import { BRANDS, CATEGORIES, STORES } from '@/lib/mock-data'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { MobileFilterToggle } from '@/components/mobile-filter-toggle'
import { formatNumber } from '@amakers/utils'

export const metadata: Metadata = buildPageMetadata('bestplace', {
  title: '매장 디렉토리',
  description: '전국 프랜차이즈 인증 매장. 평점·방문객·신규 오픈 기준으로 비교하세요.',
  path: '/stores',
})

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

  const listJsonLd = buildItemListJsonLd({
    url: 'https://bestplace.amakers.co.kr/stores',
    items: results.slice(0, 20).map((s) => ({ name: s.name, url: `https://bestplace.amakers.co.kr/stores/${s.id}` })),
  })

  const avgRating = STORES.length
    ? (STORES.reduce((s, st) => s + st.rating, 0) / STORES.length).toFixed(1)
    : '-'
  const totalReviews = STORES.reduce((s, st) => s + st.reviewCount, 0)
  const regionCount = new Set(STORES.map((s) => s.region)).size

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-h3 font-bold text-gray-900">매장 디렉토리</h1>
              <p className="mt-1 text-sm text-gray-500">
                전국 프랜차이즈 인증 매장 {STORES.length}곳. 평점·방문객·신규 오픈 기준 정렬.
              </p>
            </div>
            <a
              href="/stores/new"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              매장 등록
            </a>
          </div>
          {/* 통계 요약 */}
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1 sm:flex sm:gap-8 text-sm">
            <div>
              <span className="text-xs text-gray-500">인증 매장</span>
              <div className="font-bold text-gray-900">{STORES.length}곳</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">평균 평점</span>
              <div className="font-bold text-gray-900">★ {avgRating}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">누적 리뷰</span>
              <div className="font-bold text-gray-900">{formatNumber(totalReviews)}건</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">지역 커버</span>
              <div className="font-bold text-gray-900">{regionCount}개 지역</div>
            </div>
          </div>

          {/* 검색 폼 */}
          <form method="get" action="/stores" className="mt-5">
            {category && <input type="hidden" name="category" value={category} />}
            {region && <input type="hidden" name="region" value={region} />}
            {sort !== 'rating' && <input type="hidden" name="sort" value={sort} />}
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                defaultValue={q ?? ''}
                placeholder="매장명·주소 검색"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--brand-primary)] focus:outline-none"
              />
            </div>
          </form>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="mb-4">
          <MobileFilterToggle>
            <div className="space-y-5">
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
            </div>
          </MobileFilterToggle>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden space-y-5 lg:block lg:sticky lg:top-20 lg:self-start">
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

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">우수 매장 리포트를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 인증 매장·수상 매장·지역별 매장 트렌드를 격주로 보내드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
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
