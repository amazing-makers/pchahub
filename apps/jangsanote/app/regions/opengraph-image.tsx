import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { CHANNELS } from '@/lib/mock-data'

export const alt = '장사노트 지역 채널'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const regions = CHANNELS.filter((c) => c.type === 'region')
  const totalMembers = regions.reduce((s, c) => s + c.memberCount, 0)
  const totalPosts = regions.reduce((s, c) => s + c.postCount, 0)

  return new ImageResponse(
    buildPageOgImageJsx('jangsanote', {
      pageType: '지역 채널',
      title: '지역별 점주 커뮤니티',
      subtitle: '시·도별 자영업·가맹점주 게시판. 우리 지역 소식과 운영 정보를 모아보세요.',
      chips: [
        `지역 채널 ${regions.length}개`,
        `전체 회원 ${totalMembers.toLocaleString()}명`,
        `전체 게시글 ${totalPosts.toLocaleString()}개`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
