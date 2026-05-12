import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { BRANDS } from '@/lib/mock-data'

export const alt = '가맹 브랜드 정보'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const brand = BRANDS.find((b) => b.id === params.id)
  if (!brand) {
    return new ImageResponse(
      buildPageOgImageJsx('pchahub', { title: '브랜드를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: `${brand.categoryLabel} 가맹 브랜드`,
      title: brand.name,
      subtitle: brand.description,
      chips: [
        `매장 ${brand.storeCount}개`,
        `창업비 ${brand.startupCost}만원`,
        `+${brand.growthRate}% 성장`,
        `본사 ${brand.hqRegion}`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
