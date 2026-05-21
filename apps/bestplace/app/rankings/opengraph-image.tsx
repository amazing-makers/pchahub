import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { STORES } from '@/lib/mock-data'

export const alt = '베스트플레이스 실시간 랭킹'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const totalReviews = STORES.reduce((s, st) => s + st.reviewCount, 0)
  const avgRating = STORES.length
    ? (STORES.reduce((s, st) => s + st.rating, 0) / STORES.length).toFixed(1)
    : '0'

  return new ImageResponse(
    buildPageOgImageJsx('bestplace', {
      pageType: '실시간 랭킹',
      title: '프랜차이즈 매장 랭킹',
      subtitle: '방문객·평점·리뷰 수 기준 전국 프랜차이즈 매장 실시간 랭킹.',
      chips: [
        `전체 매장 ${STORES.length}곳`,
        `누적 리뷰 ${totalReviews.toLocaleString()}건`,
        `평균 평점 ${avgRating}점`,
        '실시간 업데이트',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
