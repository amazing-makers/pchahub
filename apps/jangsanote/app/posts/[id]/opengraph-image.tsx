import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { CATEGORY_LABEL, channelLabel, POSTS } from '@/lib/mock-data'

export const alt = '점주 커뮤니티 게시글'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const post = POSTS.find((p) => p.id === params.id)
  if (!post) {
    return new ImageResponse(
      buildPageOgImageJsx('jangsanote', { title: '게시글을 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const channelName = channelLabel(post.channelType, post.channelKey)
  const chips = [
    channelName,
    CATEGORY_LABEL[post.category],
    `추천 ${post.likes}`,
    `댓글 ${post.commentCount}`,
  ]
  return new ImageResponse(
    buildPageOgImageJsx('jangsanote', {
      pageType: channelName,
      title: post.title,
      subtitle: post.excerpt,
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
