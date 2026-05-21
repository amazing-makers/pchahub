import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { CHANNELS } from '@/lib/mock-data'

export const alt = '장사노트 카테고리'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const categories = CHANNELS.filter((c) => c.type === 'category')
  const totalMembers = categories.reduce((s, c) => s + c.memberCount, 0)
  const totalPosts = categories.reduce((s, c) => s + c.postCount, 0)

  return new ImageResponse(
    buildPageOgImageJsx('jangsanote', {
      pageType: '업종 카테고리',
      title: '업종·주제별 게시판',
      subtitle: '업종별 자영업·가맹점주 커뮤니티. 관심 분야 게시판에서 운영 노하우를 나눠보세요.',
      chips: [
        `채널 ${categories.length}개`,
        `전체 회원 ${totalMembers.toLocaleString()}명`,
        `전체 게시글 ${totalPosts.toLocaleString()}개`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
