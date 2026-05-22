import type { Metadata } from 'next'
import { ArrowRight, BookOpen, Lightbulb, Lock, MapPin, Search, Star, Store } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { KnowhowCard } from '@/components/knowhow-card'
import {
  FEATURED_KNOWHOW,
  FREE_KNOWHOW,
  KNOWHOW_CATEGORY_EMOJI,
  KNOWHOW_CATEGORY_LABEL,
  KNOWHOW_ITEMS,
  type KnowhowCategory,
} from '@/lib/knowhow'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'

export const metadata: Metadata = buildPageMetadata('themanual', {
  title: '업소 운영 노하우',
  description: '업종별 매뉴얼, 마진율 계산, 서비스 극대화, 마케팅 전략 등 프랜차이즈 창업자·점주를 위한 검증된 노하우 모음.',
  path: '/knowhow',
})

interface KnowhowPageProps {
  searchParams: {
    category?: string
    filter?: string   // 'free' | 'premium'
    q?: string
    sort?: string
  }
}

const SORT_OPTIONS = [
  { key: 'popular', label: '인기순' },
  { key: 'newest',  label: '최신순' },
  { key: 'price_asc', label: '가격 낮은 순' },
]

function makeHref(
  current: KnowhowPageProps['searchParams'],
  changes: Partial<KnowhowPageProps['searchParams']>,
) {
  const next = { ...current, ...changes }
  const params = new URLSearchParams()
  if (next.category) params.set('category', next.category)
  if (next.filter) params.set('filter', next.filter)
  if (next.q) params.set('q', next.q)
  if (next.sort && next.sort !== 'popular') params.set('sort', next.sort)
  const qs = params.toString()
  return qs ? `/knowhow?${qs}` : '/knowhow'
}

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '더매뉴얼', url: 'https://themanual.amakers.co.kr' },
    { name: '운영 노하우', url: 'https://themanual.amakers.co.kr/knowhow' },
  ],
})

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
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

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

export default function KnowhowPage({ searchParams }: KnowhowPageProps) {
  const { category, filter, q, sort = 'popular' } = searchParams

  let results = KNOWHOW_ITEMS.slice()

  if (category) results = results.filter((k) => k.category === category)
  if (filter === 'free') results = results.filter((k) => !k.premium)
  if (filter === 'premium') results = results.filter((k) => k.premium)
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (k) =>
        k.title.toLowerCase().includes(needle) ||
        k.excerpt.toLowerCase().includes(needle) ||
        k.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }

  results = [...results].sort((a, b) => {
    switch (sort) {
      case 'newest':    return b.publishedAt.localeCompare(a.publishedAt)
      case 'price_asc': return a.price - b.price
      default:          return b.viewCount - a.viewCount
    }
  })

  const isFiltered = !!(category || filter || q)

  const listJsonLd = buildItemListJsonLd({
    url: 'https://themanual.amakers.co.kr/knowhow',
    items: KNOWHOW_ITEMS.slice(0, 20).map((k) => ({
      name: k.title,
      url: `https://themanual.amakers.co.kr/knowhow/${k.id}`,
    })),
  })

  // Stats
  const totalCount = KNOWHOW_ITEMS.length
  const freeCount  = FREE_KNOWHOW.length
  const paidCount  = KNOWHOW_ITEMS.filter((k) => k.premium).length
  const totalViews = KNOWHOW_ITEMS.reduce((s, k) => s + k.viewCount, 0)
  const categoryCount = Object.keys(KNOWHOW_CATEGORY_LABEL).length

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-[var(--brand-primary)]" />
            <div>
              <h1 className="text-h3 font-bold text-gray-900">
                업소 운영 노하우
                {q && <span className="ml-2 text-base font-normal text-gray-500">'{q}' 검색 결과</span>}
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {isFiltered
                  ? `${results.length}개 노하우`
                  : `창업자·점주를 위한 검증된 노하우 ${totalCount}선`}
              </p>
            </div>
          </div>

          {/* Stats chips */}
          {!isFiltered && (
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <BookOpen className="h-3.5 w-3.5" />
                무료 {freeCount}개
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/5 px-3 py-1 text-xs font-medium text-[var(--brand-primary)]">
                <Lock className="h-3.5 w-3.5" />
                프리미엄 {paidCount}개 (₩9,900~)
              </div>
            </div>
          )}

          {/* Search */}
          <form method="get" action="/knowhow" className="mt-5">
            {category && <input type="hidden" name="category" value={category} />}
            {filter && <input type="hidden" name="filter" value={filter} />}
            {sort !== 'popular' && <input type="hidden" name="sort" value={sort} />}
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                defaultValue={q ?? ''}
                placeholder="노하우 제목·키워드 검색"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--brand-primary)] focus:outline-none"
              />
            </div>
          </form>
        </div>
      </section>

      {/* 통계 스트립 */}
      {!isFiltered && (
        <section className="border-b border-gray-100 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
              {[
                { value: `${totalCount}개`, label: '전체 노하우' },
                { value: `${freeCount}개`, label: '무료 콘텐츠' },
                { value: `${paidCount}개`, label: '프리미엄' },
                { value: formatNumber(totalViews), label: '누적 조회' },
              ].map(({ value, label }) => (
                <div key={label} className="px-6 py-4">
                  <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                  <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto py-8">
        {/* Featured — only on unfiltered view */}
        {!isFiltered && (
          <section className="mb-10">
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">추천 노하우</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {FEATURED_KNOWHOW.map((k) => (
                <KnowhowCard key={k.id} item={k} featured />
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="space-y-5">
            <FilterGroup title="카테고리">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { category: undefined })} active={!category}>
                  전체
                </FilterLink>
                {(Object.keys(KNOWHOW_CATEGORY_LABEL) as KnowhowCategory[]).map((cat) => {
                  const count = KNOWHOW_ITEMS.filter((k) => k.category === cat).length
                  if (count === 0) return null
                  return (
                    <FilterLink
                      key={cat}
                      href={makeHref(searchParams, { category: cat })}
                      active={category === cat}
                    >
                      {KNOWHOW_CATEGORY_EMOJI[cat]} {KNOWHOW_CATEGORY_LABEL[cat]} ({count})
                    </FilterLink>
                  )
                })}
              </div>
            </FilterGroup>

            <FilterGroup title="가격">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { filter: undefined })} active={!filter}>
                  전체
                </FilterLink>
                <FilterLink href={makeHref(searchParams, { filter: 'free' })} active={filter === 'free'}>
                  🆓 무료만 보기
                </FilterLink>
                <FilterLink href={makeHref(searchParams, { filter: 'premium' })} active={filter === 'premium'}>
                  🔐 프리미엄만 보기
                </FilterLink>
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

          {/* Grid */}
          <div>
            <div className="mb-3 text-sm font-semibold text-gray-700">{results.length}개</div>
            {results.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-sm text-gray-500">
                  검색 결과가 없습니다. 필터를 줄여 다시 시도해보세요.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((k) => (
                  <KnowhowCard key={k.id} item={k} />
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
                <a href="https://themyungdang.amakers.co.kr/listings" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-500" />창업 매물 찾기</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://bestplace.amakers.co.kr/stores" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" />우수 매장 탐색</span>
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">가맹 운영 노하우를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 노하우 글·실전 팁·전문가 칼럼을 격주로 보내드립니다.</p>
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
