import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { RECIPE_CATEGORY_LABEL, RECIPES, DIFFICULTY_LABEL } from '@/lib/recipes'

export const alt = '업소용 레시피'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return RECIPES.map((r) => ({ id: r.id }))
}

export default async function Image({ params }: { params: { id: string } }) {
  const recipe = RECIPES.find((r) => r.id === params.id)
  if (!recipe) {
    return new ImageResponse(
      buildPageOgImageJsx('themanual', { title: '레시피를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }

  const chips = [
    RECIPE_CATEGORY_LABEL[recipe.category],
    DIFFICULTY_LABEL[recipe.difficulty],
    `조리 ${recipe.cookingTime}분`,
    `${recipe.servings}인분`,
  ]

  return new ImageResponse(
    buildPageOgImageJsx('themanual', {
      pageType: '업소용 레시피',
      title: recipe.title,
      subtitle: recipe.excerpt,
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
