import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { LISTINGS } from '@/lib/mock-listings'

export const alt = '프차허브 창업 매물'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const regionCount = new Set(LISTINGS.map((l) => l.region)).size

  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: '창업 매물',
      title: '프랜차이즈 창업 매물',
      subtitle: '창업에 적합한 전국 상가 매물. 면적·지역·업종별로 필터해 최적 입지를 찾으세요.',
      chips: [
        `매물 ${LISTINGS.length}건`,
        `${regionCount}개 지역`,
        '업종 적합성 분석',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
