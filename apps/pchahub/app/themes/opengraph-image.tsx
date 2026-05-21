import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { THEME_COUNTS, THEMES } from '@/lib/themes'

export const alt = '프차허브 테마별 브랜드'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const totalBrands = Object.values(THEME_COUNTS).reduce((s, c) => s + c, 0)

  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: '테마별 보기',
      title: '테마별 프랜차이즈 브랜드',
      subtitle: '저자본·소자본·프리미엄·공동창업 등 운영 조건별로 나에게 맞는 브랜드를 찾아보세요.',
      chips: [
        `테마 ${THEMES.length}가지`,
        `전체 브랜드 ${totalBrands.toLocaleString()}개`,
        '가맹정보공개서 기준',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
