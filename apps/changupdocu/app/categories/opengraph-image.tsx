import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { EPISODES } from '@/lib/mock-data'

export const alt = '창업다큐 카테고리'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const totalViews = EPISODES.reduce((s, e) => s + e.views, 0)

  return new ImageResponse(
    buildPageOgImageJsx('changupdocu', {
      pageType: '카테고리',
      title: '주제별 창업 다큐',
      subtitle: '성공·실패·브랜드·트렌드·인터뷰 5가지 카테고리로 창업다큐 에피소드를 만나보세요.',
      chips: [
        '카테고리 5가지',
        `전체 에피소드 ${EPISODES.length}편`,
        `누적 조회 ${totalViews.toLocaleString()}회`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
