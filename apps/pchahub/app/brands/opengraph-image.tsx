import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { BRANDS, CATEGORIES } from '@/lib/mock-data'

export const alt = '프차허브 가맹 브랜드'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const totalStores = BRANDS.reduce((s, b) => s + b.storeCount, 0)
  const avgCost = BRANDS.length
    ? Math.round(BRANDS.reduce((s, b) => s + b.startupCost, 0) / BRANDS.length)
    : 0

  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: '가맹 브랜드',
      title: '전국 프랜차이즈 브랜드',
      subtitle: '창업비·매장 수·성장률을 기준으로 나에게 맞는 가맹 브랜드를 찾아보세요.',
      chips: [
        `브랜드 ${BRANDS.length}개`,
        `전국 매장 ${totalStores.toLocaleString()}개`,
        `업종 ${CATEGORIES.length}개`,
        `평균 창업비 ${avgCost.toLocaleString()}만원`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
