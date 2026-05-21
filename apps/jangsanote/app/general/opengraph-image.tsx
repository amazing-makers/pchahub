import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { POSTS } from '@/lib/mock-data'

export const alt = '장사노트 자유게시판'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const generalPosts = POSTS.filter((p) => p.channelType === 'general')
  const totalViews = generalPosts.reduce((s, p) => s + p.views, 0)

  return new ImageResponse(
    buildPageOgImageJsx('jangsanote', {
      pageType: '자유게시판',
      title: '점주 자유게시판',
      subtitle: '업종·지역 구분 없이 자유롭게 이야기하는 자영업·가맹점주 자유게시판.',
      chips: [
        `게시글 ${generalPosts.length}개`,
        `누적 조회 ${totalViews.toLocaleString()}회`,
        '자유 주제',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
