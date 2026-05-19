import type { Metadata } from 'next'
import { Lightbulb, Search, BookOpen, Lock } from 'lucide-react'
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
import { buildPageMetadata } from '@amakers/design-system'

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

  // Stats
  const totalCount = KNOWHOW_ITEMS.length
  const freeCount  = FREE_KNOWHOW.length
  const paidCount  = KNOWHOW_ITEMS.filter((k) => k.premium).length

  return (
    <main className="bg-gray-50">
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
    </main>
  )
}
