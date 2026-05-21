import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { STORES } from '@/lib/mock-data'

export const alt = '베스트플레이스 우수 매장'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const avgRating = STORES.length
    ? (STORES.reduce((s, st) => s + st.rating, 0) / STORES.length).toFixed(1)
    : '0'
  const regionCount = new Set(STORES.map((s) => s.region)).size

  return new ImageResponse(
    buildPageOgImageJsx('bestplace', {
      pageType: '우수 매장',
      title: '전국 인증 프랜차이즈 매장',
      subtitle: '방문객·평점·리뷰 수 기준으로 선별한 전국 프랜차이즈 인증 매장을 만나보세요.',
      chips: [
        `인증 매장 ${STORES.length}곳`,
        `평균 평점 ${avgRating}점`,
        `전국 ${regionCount}개 지역`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
