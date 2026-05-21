import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { RECIPES } from '@/lib/recipes'

export const alt = '더매뉴얼 메뉴 레시피'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const categoryCount = new Set(RECIPES.map((r) => r.category)).size
  const totalViews = RECIPES.reduce((s, r) => s + r.viewCount, 0)

  return new ImageResponse(
    buildPageOgImageJsx('themanual', {
      pageType: '메뉴 레시피',
      title: '업소용 레시피',
      subtitle: '한식·육류·김치·양식 등 업소 운영에 바로 쓸 수 있는 실전 메뉴 레시피.',
      chips: [
        `레시피 ${RECIPES.length}개`,
        `${categoryCount}개 카테고리`,
        `누적 조회 ${totalViews.toLocaleString()}회`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
