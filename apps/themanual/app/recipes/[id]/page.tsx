import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, BookOpen, ChefHat, Clock, Eye, Flame, MapPin, Store, UtensilsCrossed } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import {
  DIFFICULTY_LABEL,
  RECIPE_CATEGORY_LABEL,
  RECIPES,
  recipeById,
  type RecipeDifficulty,
} from '@/lib/recipes'
import { buildBreadcrumbsJsonLd, buildCreativeWorkJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ShareRecipeButton } from './share-recipe-button'
import { SaveRecipeButton } from './save-recipe-button'
import { RecipeViewTracker } from './recipe-view-tracker'

interface RecipePageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  return RECIPES.map((r) => ({ id: r.id }))
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipe = recipeById(params.id)
  if (!recipe) return {}
  return buildPageMetadata('themanual', {
    title: recipe.title,
    description: recipe.excerpt,
    path: `/recipes/${recipe.id}`,
  })
}

const DIFFICULTY_BADGE: Record<RecipeDifficulty, { label: string; variant: 'default' | 'success' | 'warning' | 'error' }> = {
  easy:   { label: '쉬움',   variant: 'success' },
  medium: { label: '보통',   variant: 'warning' },
  hard:   { label: '어려움', variant: 'error'   },
}

export default function RecipePage({ params }: RecipePageProps) {
  const recipe = recipeById(params.id)
  if (!recipe) notFound()

  const difficultyBadge = DIFFICULTY_BADGE[recipe.difficulty]
  const mainIngredients = recipe.ingredients.filter((i) => !i.note)
  const sauceIngredients = recipe.ingredients.filter((i) => !!i.note)

  const creativeWorkJsonLd = buildCreativeWorkJsonLd({
    name: recipe.title,
    description: recipe.excerpt,
    url: `https://themanual.amakers.co.kr/recipes/${recipe.id}`,
    image: recipe.heroImage,
    authorName: recipe.chef,
    publishedAt: recipe.publishedAt,
    publisher: { name: '더매뉴얼', url: 'https://themanual.amakers.co.kr' },
  })

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '레시피', url: 'https://themanual.amakers.co.kr/recipes' },
      { name: recipe.title, url: `https://themanual.amakers.co.kr/recipes/${recipe.id}` },
    ],
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={creativeWorkJsonLd} />
      <JsonLd data={breadcrumbs} />
      <RecipeViewTracker
        recipeId={recipe.id}
        recipeTitle={recipe.title}
        recipeCategory={recipe.category}
      />
      {/* Hero */}
      <div className="relative h-72 w-full overflow-hidden bg-gray-200 sm:h-96">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipe.heroImage}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="container mx-auto">
            <a
              href="/recipes"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> 레시피 목록
            </a>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                {RECIPE_CATEGORY_LABEL[recipe.category]}
              </span>
              <Badge variant={difficultyBadge.variant}>{difficultyBadge.label}</Badge>
              {recipe.featured && <Badge variant="warning">추천</Badge>}
            </div>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{recipe.title}</h1>
            <p className="mt-1 text-base text-white/80">{recipe.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main */}
          <div className="space-y-8">
            {/* Summary chips */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
              <InfoChip icon={<Clock className="h-4 w-4 text-[var(--brand-primary)]" />} label="조리 시간" value={`${recipe.cookingTime}분`} />
              <InfoChip icon={<UtensilsCrossed className="h-4 w-4 text-[var(--brand-primary)]" />} label="인분" value={`${recipe.servings}인분`} />
              <InfoChip icon={<Flame className="h-4 w-4 text-[var(--brand-primary)]" />} label="단계" value={`${recipe.steps.length}단계`} />
              <InfoChip icon={<Eye className="h-4 w-4 text-[var(--brand-primary)]" />} label="조회수" value={recipe.viewCount.toLocaleString()} />
              <ShareRecipeButton recipeTitle={recipe.title} />
            </div>

            {/* Excerpt */}
            <Card className="border-gray-200">
              <CardContent className="p-5">
                <p className="leading-relaxed text-gray-700">{recipe.excerpt}</p>
              </CardContent>
            </Card>

            {/* Steps */}
            <section>
              <h2 className="mb-4 text-h4 font-semibold text-gray-900">조리 순서</h2>
              <div className="space-y-4">
                {recipe.steps.map((step) => (
                  <div key={step.order} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] text-sm font-bold text-white">
                      {step.order}
                    </div>
                    <div className="flex-1">
                      <p className="pt-1 leading-relaxed text-gray-700">{step.text}</p>
                      {step.image && (
                        <div className="mt-3 overflow-hidden rounded-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={step.image}
                            alt={`단계 ${step.order}`}
                            className="w-full max-w-sm object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tips */}
            {recipe.tips.length > 0 && (
              <section>
                <h2 className="mb-3 text-h4 font-semibold text-gray-900">업소 운영 팁</h2>
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-5">
                    <ul className="space-y-2">
                      {recipe.tips.map((tip, i) => (
                        <li key={i} className="flex gap-2 text-sm text-amber-900">
                          <span className="mt-0.5 shrink-0 text-amber-500">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/recipes?q=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 hover:border-[var(--brand-primary)]/50 hover:text-[var(--brand-primary)]"
                >
                  #{tag}
                </a>
              ))}
            </div>

            {/* Related recipes */}
            {(() => {
              const related = RECIPES.filter(
                (r) => r.id !== recipe.id && r.category === recipe.category,
              ).slice(0, 3)
              if (related.length === 0) return null
              return (
                <section>
                  <h2 className="mb-3 text-h4 font-semibold text-gray-900">
                    같은 카테고리 레시피
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {related.map((r) => (
                      <a
                        key={r.id}
                        href={`/recipes/${r.id}`}
                        className="flex flex-col gap-2 overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors hover:border-gray-300"
                      >
                        <div className="relative h-28 w-full overflow-hidden bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={r.heroImage}
                            alt={r.title}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="px-3 pb-3">
                          <div className="line-clamp-2 text-sm font-semibold text-gray-900">{r.title}</div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <span>{r.cookingTime}분</span>
                            <span>·</span>
                            <span>{r.servings}인분</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )
            })()}

            {/* amakers 생태계 크로스링크 */}
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  amakers에서 더 알아보기
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  이 레시피와 관련된 브랜드·강의·커뮤니티를 확인하세요.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <a
                    href={`https://pchahub.amakers.co.kr/brands?category=${recipe.category}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Store className="h-3.5 w-3.5 text-indigo-500" />
                      관련 가맹 브랜드
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href={`/courses?category=${recipe.category}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                      운영·메뉴 강의
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href="https://jangsanote.amakers.co.kr"
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Store className="h-3.5 w-3.5 text-emerald-500" />
                      점주 커뮤니티
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href="https://themyungdang.amakers.co.kr/listings"
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      입점 매물 찾기
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Source */}
            <div className="text-xs text-gray-400">
              출처: <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">{recipe.source}</a>
              {' · '}등록일 {recipe.publishedAt}
            </div>
          </div>

          {/* Sidebar — Ingredients */}
          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-[var(--brand-primary)]" />
                  <h2 className="text-base font-semibold text-gray-900">재료 ({recipe.servings}인분)</h2>
                </div>

                {mainIngredients.length > 0 && (
                  <>
                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">주재료</div>
                    <ul className="space-y-2">
                      {mainIngredients.map((ing, i) => (
                        <li key={i} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{ing.name}</span>
                          <span className="font-medium text-gray-900">{ing.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {sauceIngredients.length > 0 && (
                  <>
                    <div className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wider text-gray-400">소스·양념</div>
                    <ul className="space-y-2">
                      {sauceIngredients.map((ing, i) => (
                        <li key={i} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{ing.name}</span>
                          <span className="font-medium text-gray-900">{ing.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Chef info */}
            <Card className="border-gray-200">
              <CardContent className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">셰프</div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-sm font-bold text-[var(--brand-primary)]">
                    {recipe.chef.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{recipe.chef}</span>
                </div>
              </CardContent>
            </Card>

            {/* Save button */}
            <SaveRecipeButton recipeId={recipe.id} />

            {/* Back CTA */}
            <a
              href="/recipes"
              className="block w-full rounded-xl border-2 border-dashed border-gray-200 py-3 text-center text-sm text-gray-500 hover:border-[var(--brand-primary)]/40 hover:text-[var(--brand-primary)]"
            >
              ← 레시피 전체 보기
            </a>
          </aside>
        </div>
      </div>

      {/* 뉴스레터 CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h4 font-bold text-gray-900">레시피 & 메뉴 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 레시피·원가 계산 팁·메뉴 트렌드를 격주로 보내드립니다.</p>
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

function InfoChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <div className="text-[10px] text-gray-400">{label}</div>
        <div className="text-sm font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  )
}
