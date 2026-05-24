import { Clock, Flame, Heart, Wallet } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { recipeAuthor, SOURCE_LABEL, type MockRecipe } from '@/lib/hub-data'
import { ScrapButton } from './scrap-button'

interface RecipeCardProps {
  recipe: MockRecipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const author = recipeAuthor(recipe.authorId)
  return (
    <a href={`/recipes/${recipe.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative h-36 w-full overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={recipe.coverImage}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <Badge variant="default" className="bg-white/90">{recipe.category}</Badge>
            {recipe.source && recipe.source !== 'official' && (
              <Badge variant="default" className="bg-white/90">{SOURCE_LABEL[recipe.source]}</Badge>
            )}
          </div>
          <div className="absolute right-3 top-3 z-10">
            <ScrapButton bucket="recipes" id={recipe.id} />
          </div>
        </div>
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              {recipe.difficulty}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              {recipe.cookTimeMin}분
            </span>
            <span className="inline-flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5 text-emerald-500" />
              원가 {recipe.costPerWon === 0 ? '0원' : `${formatNumber(recipe.costPerWon)}원`}
            </span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-base font-semibold text-gray-900">{recipe.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">{recipe.summary}</p>

          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={author.avatarUrl}
                alt={author.handle}
                className="h-5 w-5 shrink-0 rounded-full object-cover"
                loading="lazy"
              />
              {author.handle}
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Heart className="h-3.5 w-3.5 text-rose-400" />
              {formatNumber(recipe.likes)}
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
