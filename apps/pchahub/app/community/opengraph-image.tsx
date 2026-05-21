import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { DISCUSSIONS, QUESTIONS } from '@/lib/mock-community'

export const alt = '프차허브 커뮤니티'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const totalPosts = DISCUSSIONS.length + QUESTIONS.length
  const totalViews = DISCUSSIONS.reduce((s, d) => s + d.views, 0)

  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: '커뮤니티',
      title: '예비 점주·가맹점주 커뮤니티',
      subtitle: '창업 고민·브랜드 후기·운영 Q&A를 나눠보세요. 실제 점주들의 경험을 만나세요.',
      chips: [
        `게시글 ${totalPosts}개`,
        `토론 ${DISCUSSIONS.length}개`,
        `Q&A ${QUESTIONS.length}개`,
        `조회 ${totalViews.toLocaleString()}회`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
