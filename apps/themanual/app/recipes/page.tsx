import type { Metadata } from 'next'
import { ArrowRight, BookOpen, ChefHat, MapPin, Search, Star, Store } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { RecipeCard } from '@/components/recipe-card'
import {
  FEATURED_RECIPES,
  RECIPE_CATEGORY_LABEL,
  DIFFICULTY_LABEL,
  RECIPES,
  type RecipeCategory,
  type RecipeDifficulty,
} from '@/lib/recipes'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'

export const metadata: Metadata = buildPageMetadata('themanual', {
  title: '업소용 레시피',
  description: '프랜차이즈 창업자·점주를 위한 실전 업소용 레시피. 한식·밑반찬·고기 요리·국찌개 등 검증된 레시피를 확인하세요.',
  path: '/recipes',
})

interface RecipesPageProps {
  searchParams: {
    category?: string
    difficulty?: string
    q?: string
    sort?: string
  }
}

const SORT_OPTIONS = [
  { key: 'popular',  label: '조회 많은 순' },
  { key: 'newest',   label: '최신 등록순' },
  { key: 'fastest',  label: '조리 시간 짧은 순' },
]

function makeHref(
  current: RecipesPageProps['searchParams'],
  changes: Partial<RecipesPageProps['searchParams']>,
) {
  const next = { ...current, ...changes }
  const params = new URLSearchParams()
  if (next.category) params.set('category', next.category)
  if (next.difficulty) params.set('difficulty', next.difficulty)
  if (next.q) params.set('q', next.q)
  if (next.sort && next.sort !== 'popular') params.set('sort', next.sort)
  const qs = params.toString()
  return qs ? `/recipes?${qs}` : '/recipes'
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  )
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

export default function RecipesPage({ searchParams }: RecipesPageProps) {
  const { category, difficulty, q, sort = 'popular' } = searchParams

  let results = RECIPES.slice()

  if (category) results = results.filter((r) => r.category === category)
  if (difficulty) results = results.filter((r) => r.difficulty === difficulty)
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(needle) ||
        r.excerpt.toLowerCase().includes(needle) ||
        r.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }

  results = [...results].sort((a, b) => {
    switch (sort) {
      case 'newest':  return b.publishedAt.localeCompare(a.publishedAt)
      case 'fastest': return a.cookingTime - b.cookingTime
      default:        return b.viewCount - a.viewCount
    }
  })

  const isFiltered = !!(category || difficulty || q)
  const categoryLabel = category
    ? RECIPE_CATEGORY_LABEL[category as RecipeCategory]
    : null

  const listJsonLd = buildItemListJsonLd({
    url: 'https://themanual.amakers.co.kr/recipes',
    items: RECIPES.slice(0, 20).map((r) => ({
      name: r.title,
      url: `https://themanual.amakers.co.kr/recipes/${r.id}`,
    })),
  })

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '더매뉴얼', url: 'https://themanual.amakers.co.kr' },
      { name: '업소용 레시피', url: 'https://themanual.amakers.co.kr/recipes' },
    ],
  })

  const totalViews = RECIPES.reduce((s, r) => s + r.viewCount, 0)
  const easyCount = RECIPES.filter((r) => r.difficulty === 'easy').length
  const avgCookTime = Math.round(RECIPES.reduce((s, r) => s + r.cookingTime, 0) / RECIPES.length)
  const recipeCategoryCount = Object.keys(RECIPE_CATEGORY_LABEL).length

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-[var(--brand-primary)]" />
            <div>
              <h1 className="text-h3 font-bold text-gray-900">
                {categoryLabel ? `${categoryLabel} 레시피` : '업소용 레시피'}
                {q && <span className="ml-2 text-base font-normal text-gray-500">'{q}' 검색 결과</span>}
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {isFiltered
                  ? `${results.length}개 레시피`
                  : `프랜차이즈 창업자·점주를 위한 검증된 업소용 레시피 ${RECIPES.length}선`}
              </p>
            </div>
          </div>

          {/* Search */}
          <form method="get" action="/recipes" className="mt-5">
            {category && <input type="hidden" name="category" value={category} />}
            {difficulty && <input type="hidden" name="difficulty" value={difficulty} />}
            {sort !== 'popular' && <input type="hidden" name="sort" value={sort} />}
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                defaultValue={q ?? ''}
                placeholder="레시피명·재료·태그 검색"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--brand-primary)] focus:outline-none"
              />
            </div>
          </form>
        </div>
      </section>

      {/* 통계 스트립 */}
      {!isFiltered && (
        <section className="border-b border-gray-100 bg-white">
          <div className="container mx-auto py-4">
            <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{RECIPES.length}개</span>
                <span className="text-[11px] font-semibold text-gray-700">업소용 레시피</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{formatNumber(totalViews)}</span>
                <span className="text-[11px] font-semibold text-gray-700">누적 조회</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{easyCount}개</span>
                <span className="text-[11px] font-semibold text-gray-700">초보도 가능</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{avgCookTime}분</span>
                <span className="text-[11px] font-semibold text-gray-700">평균 조리 시간</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto py-8">
        {/* Featured section (only on unfiltered first page) */}
        {!isFiltered && (
          <section className="mb-10">
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">추천 레시피</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {FEATURED_RECIPES.map((r) => (
                <RecipeCard key={r.id} recipe={r} featured />
              ))}
            </div>
          </section>
        )}

        {/* Main content with sidebar */}
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="space-y-5">
            <FilterGroup title="카테고리">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { category: undefined })} active={!category}>
                  전체
                </FilterLink>
                {(Object.keys(RECIPE_CATEGORY_LABEL) as RecipeCategory[]).map((cat) => {
                  const count = RECIPES.filter((r) => r.category === cat).length
                  if (count === 0) return null
                  return (
                    <FilterLink
                      key={cat}
                      href={makeHref(searchParams, { category: cat })}
                      active={category === cat}
                    >
                      {RECIPE_CATEGORY_LABEL[cat]} ({count})
                    </FilterLink>
                  )
                })}
              </div>
            </FilterGroup>

            <FilterGroup title="난이도">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { difficulty: undefined })} active={!difficulty}>
                  전체
                </FilterLink>
                {(Object.keys(DIFFICULTY_LABEL) as RecipeDifficulty[]).map((d) => (
                  <FilterLink
                    key={d}
                    href={makeHref(searchParams, { difficulty: d })}
                    active={difficulty === d}
                  >
                    {DIFFICULTY_LABEL[d]}
                  </FilterLink>
                ))}
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
                {results.map((r) => (
                  <RecipeCard key={r.id} recipe={r} />
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">새 레시피 알림을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 레시피·계절 메뉴·업소 운영 팁을 메일로 알려드립니다.</p>
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
