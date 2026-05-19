import { Clock, Eye, UtensilsCrossed } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import {
  DIFFICULTY_LABEL,
  RECIPE_CATEGORY_LABEL,
  type MockRecipe,
} from '@/lib/recipes'

interface RecipeCardProps {
  recipe: MockRecipe
  featured?: boolean
}

const DIFFICULTY_COLOR = {
  easy:   'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amberald-700',
  hard:   'bg-red-50 text-red-700',
} as const

export function RecipeCard({ recipe, featured = false }: RecipeCardProps) {
  return (
    <a href={`/recipes/${recipe.id}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          {/* Hero image */}
          <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={recipe.heroImage}
              alt={recipe.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/50" />

            {/* Category badge */}
            <div className="absolute left-3 top-3 flex gap-1.5">
              <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-gray-900">
                {RECIPE_CATEGORY_LABEL[recipe.category]}
              </span>
            </div>

            {featured && (
              <div className="absolute right-3 top-3">
                <Badge variant="warning">추천</Badge>
              </div>
            )}

            {/* Cooking time pill */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
              <Clock className="h-3 w-3" />
              {recipe.cookingTime}분
            </div>
          </div>

          <div className="p-4">
            <h3 className="line-clamp-1 text-base font-semibold text-gray-900">{recipe.title}</h3>
            <p className="mt-0.5 text-xs text-gray-500">{recipe.subtitle}</p>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">{recipe.excerpt}</p>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <span className={`rounded-full px-2 py-0.5 font-medium ${DIFFICULTY_COLOR[recipe.difficulty]}`}>
                {DIFFICULTY_LABEL[recipe.difficulty]}
              </span>
              <span className="inline-flex items-center gap-1">
                <UtensilsCrossed className="h-3 w-3" />
                {recipe.servings}인분
              </span>
              <span className="ml-auto inline-flex items-center gap-1 text-gray-400">
                <Eye className="h-3 w-3" />
                {recipe.viewCount.toLocaleString()}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
              <span>by {recipe.chef}</span>
              <span>{recipe.steps.length}단계</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
