import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Flame, Heart, Users, Wallet } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { buildBreadcrumbsJsonLd, buildHowToJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { RecipeCard } from '@/components/recipe-card'
import { RECIPES, recipeAuthor, recipeById } from '@/lib/hub-data'

export function generateStaticParams() {
  return RECIPES.map((r) => ({ id: r.id }))
}

interface RecipeDetailProps {
  params: { id: string }
}

export function generateMetadata({ params }: RecipeDetailProps): Metadata {
  const recipe = recipeById(params.id)
  if (!recipe) return {}
  return buildPageMetadata('jangsanote', {
    title: `${recipe.title} — 점주 레시피`,
    description: recipe.summary,
    path: `/recipes/${recipe.id}`,
  })
}

export default function RecipeDetailPage({ params }: RecipeDetailProps) {
  const recipe = recipeById(params.id)
  if (!recipe) notFound()
  const author = recipeAuthor(recipe.authorId)
  const related = RECIPES.filter((r) => r.id !== recipe.id && r.category === recipe.category).slice(0, 3)

  const recipeUrl = `https://jangsanote.amakers.co.kr/recipes/${recipe.id}`
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '레시피', url: 'https://jangsanote.amakers.co.kr/recipes' },
      { name: recipe.title, url: recipeUrl },
    ],
  })
  const howToJsonLd = buildHowToJsonLd({
    name: recipe.title,
    description: recipe.summary,
    url: recipeUrl,
    totalTime: `PT${recipe.cookTimeMin}M`,
    price: recipe.costPerWon,
    steps: recipe.steps.map((s, i) => ({ name: `단계 ${i + 1}`, text: s })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={howToJsonLd} />

      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          <a href="/recipes" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> 레시피 목록
          </a>
          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0">
              <Badge variant="default">{recipe.category}</Badge>
              <h1 className="mt-3 text-h3 font-bold text-gray-900">{recipe.title}</h1>
              <p className="mt-2 text-gray-600">{recipe.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1.5"><Flame className="h-4 w-4 text-orange-500" />난이도 {recipe.difficulty}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-gray-400" />{recipe.cookTimeMin}분</span>
                <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-gray-400" />{recipe.servings}</span>
                <span className="inline-flex items-center gap-1.5"><Wallet className="h-4 w-4 text-emerald-500" />원가 {recipe.costPerWon === 0 ? '0원' : `${formatNumber(recipe.costPerWon)}원`}</span>
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={author.avatarUrl} alt={author.handle} className="h-9 w-9 rounded-full object-cover" loading="lazy" />
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{author.handle}</div>
                  <div className="text-xs text-gray-500">{recipe.createdAt} 공유</div>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 text-sm text-gray-500">
                  <Heart className="h-4 w-4 text-rose-400" />{formatNumber(recipe.likes)}
                </span>
              </div>
            </div>
            <div className="relative h-56 overflow-hidden rounded-2xl bg-gray-100 lg:h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={recipe.coverImage} alt={recipe.title} className="h-full w-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto grid gap-6 py-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card className="border-gray-200">
            <CardContent className="p-5">
              <h2 className="text-base font-bold text-gray-900">재료</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {recipe.ingredients.map((ing) => (
                  <li key={ing} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--brand-primary)' }} />
                    {ing}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>

        <div>
          <h2 className="text-base font-bold text-gray-900">조리 순서</h2>
          <ol className="mt-3 space-y-3">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  {i + 1}
                </span>
                <p className="pt-0.5 text-sm leading-relaxed text-gray-700">{step}</p>
              </li>
            ))}
          </ol>

          {recipe.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {recipe.tags.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="container mx-auto pb-10">
          <h2 className="mb-4 text-base font-bold text-gray-900">같은 분류 레시피</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
