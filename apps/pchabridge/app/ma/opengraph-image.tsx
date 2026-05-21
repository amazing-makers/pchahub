import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { MA_LISTINGS } from '@/lib/mock-data'

export const alt = '프차브릿지 M&A 매물'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const avgPrice = MA_LISTINGS.length
    ? Math.round(MA_LISTINGS.reduce((s, m) => s + m.askingPrice, 0) / MA_LISTINGS.length)
    : 0

  return new ImageResponse(
    buildPageOgImageJsx('pchabridge', {
      pageType: 'M&A 매물',
      title: '프랜차이즈 인수·합병 매물',
      subtitle: '브랜드·지역별 가맹 사업 양도·지분 매각 매물. 검증된 M&A 기회를 찾아보세요.',
      chips: [
        `매물 ${MA_LISTINGS.length}건`,
        `평균 매각가 ${(avgPrice / 10000).toFixed(0)}억원`,
        '기업 실사 지원',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
