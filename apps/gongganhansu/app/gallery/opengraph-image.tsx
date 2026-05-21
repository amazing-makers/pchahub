import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { PORTFOLIO } from '@/lib/mock-data'

export const alt = '공간한수 시공 갤러리'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const categoryCount = new Set(PORTFOLIO.map((p) => p.category)).size

  return new ImageResponse(
    buildPageOgImageJsx('gongganhansu', {
      pageType: '시공 갤러리',
      title: '프랜차이즈 시공 포트폴리오',
      subtitle: '실제 가맹점 인테리어·리모델링 시공 사례를 업종·스타일별로 둘러보세요.',
      chips: [
        `시공 사례 ${PORTFOLIO.length}건`,
        `${categoryCount}개 업종`,
        '실제 시공 사진',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
