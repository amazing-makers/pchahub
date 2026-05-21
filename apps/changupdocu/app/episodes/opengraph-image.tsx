import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { EPISODES } from '@/lib/mock-data'

export const alt = '창업다큐 에피소드'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const totalViews = EPISODES.reduce((s, e) => s + e.views, 0)
  const featuredCount = EPISODES.filter((e) => e.featured).length

  return new ImageResponse(
    buildPageOgImageJsx('changupdocu', {
      pageType: '에피소드',
      title: '자영업·가맹의 진짜 이야기',
      subtitle: '성공 다큐·실패 분석·브랜드 인사이드·점주 인터뷰. 실제 데이터와 현장 인터뷰로 풀어내는 창업 이야기.',
      chips: [
        `에피소드 ${EPISODES.length}편`,
        `누적 조회 ${totalViews.toLocaleString()}회`,
        `추천 ${featuredCount}편`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
