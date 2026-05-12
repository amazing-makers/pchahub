import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { CATEGORY_LABEL, EPISODES } from '@/lib/mock-data'

export const alt = '창업 다큐멘터리'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const ep = EPISODES.find((e) => e.id === params.id)
  if (!ep) {
    return new ImageResponse(
      buildPageOgImageJsx('changupdocu', { title: '다큐를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const chips = [
    ep.duration,
    `조회 ${ep.views.toLocaleString()}`,
    `좋아요 ${ep.likes.toLocaleString()}`,
    ...(ep.brand ? [ep.brand] : []),
  ]
  return new ImageResponse(
    buildPageOgImageJsx('changupdocu', {
      pageType: `${CATEGORY_LABEL[ep.category]} 다큐`,
      title: ep.title,
      subtitle: ep.subtitle,
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
