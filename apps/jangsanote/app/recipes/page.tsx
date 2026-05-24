import type { Metadata } from 'next'
import { ChefHat, Plus } from 'lucide-react'
import { Card, CardContent, NewsletterForm } from '@amakers/ui'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { RecipeCard } from '@/components/recipe-card'
import { CommunityRecipeFeed } from '@/components/community-recipe-feed'
import { RECIPE_CATEGORIES, RECIPES } from '@/lib/hub-data'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '점주 레시피 공유',
  description: '실제 점주들이 공유하는 매장 메뉴 레시피. 원가·난이도·조리법까지, 바로 매장에 적용할 수 있는 레시피를 모았습니다.',
  path: '/recipes',
})

interface RecipesPageProps {
  searchParams: { category?: string }
}

export default function RecipesPage({ searchParams }: RecipesPageProps) {
  const active = searchParams.category && RECIPE_CATEGORIES.includes(searchParams.category)
    ? searchParams.category
    : '전체'
  const recipes = active === '전체' ? RECIPES : RECIPES.filter((r) => r.category === active)
  const sorted = [...recipes].sort((a, b) => b.likes - a.likes)

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '장사노트', url: 'https://jangsanote.amakers.co.kr' },
      { name: '레시피', url: 'https://jangsanote.amakers.co.kr/recipes' },
    ],
  })
  const listJsonLd = buildItemListJsonLd({
    url: 'https://jangsanote.amakers.co.kr/recipes',
    items: sorted.slice(0, 20).map((r) => ({ name: r.title, url: `https://jangsanote.amakers.co.kr/recipes/${r.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={listJsonLd} />

      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="inline-flex items-center gap-2 text-h3 font-bold text-gray-900">
                <ChefHat className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
                점주 레시피 공유
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                실제 점주들이 검증한 매장 메뉴 레시피. 원가·난이도·조리법을 보고 바로 적용해보세요.
              </p>
            </div>
            <a
              href="/recipes/new"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              <Plus className="h-4 w-4" />
              레시피 작성
            </a>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {RECIPE_CATEGORIES.map((c) => {
              const isActive = c === active
              return (
                <a
                  key={c}
                  href={c === '전체' ? '/recipes' : `/recipes?category=${encodeURIComponent(c)}`}
                  className={
                    'rounded-full px-3 py-1 text-xs font-medium transition-colors ' +
                    (isActive
                      ? 'text-white'
                      : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300')
                  }
                  style={isActive ? { background: 'var(--brand-primary)' } : undefined}
                >
                  {c}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CommunityRecipeFeed categoryFilter={active} />
          {sorted.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
        {sorted.length === 0 && (
          <Card className="mt-4">
            <CardContent className="p-10 text-center text-sm text-gray-500">
              이 분류에 등록된 레시피가 없습니다. 매장 레시피를 직접 공유해보세요.
            </CardContent>
          </Card>
        )}
      </div>

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">새 레시피·장사 정보를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">점주 레시피·모임·지원사업 소식을 격주로 모아 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}
