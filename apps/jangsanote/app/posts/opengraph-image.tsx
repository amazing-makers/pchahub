import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { CHANNELS, POSTS } from '@/lib/mock-data'

export const alt = '장사노트 전체 게시글'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const totalViews = POSTS.reduce((s, p) => s + p.views, 0)
  const channelCount = CHANNELS.length

  return new ImageResponse(
    buildPageOgImageJsx('jangsanote', {
      pageType: '커뮤니티',
      title: '자영업·가맹점주 게시판',
      subtitle: '업종·지역별 채널에서 점주들의 운영 노하우와 실전 경험을 나눠보세요.',
      chips: [
        `전체 게시글 ${POSTS.length}개`,
        `채널 ${channelCount}개`,
        `누적 조회 ${totalViews.toLocaleString()}회`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
