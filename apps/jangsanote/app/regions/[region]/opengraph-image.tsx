import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { CHANNELS } from '@/lib/mock-data'

export const alt = '장사노트 지역 게시판'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return CHANNELS.filter((c) => c.type === 'region').map((c) => ({ region: c.key }))
}

export default async function Image({ params }: { params: { region: string } }) {
  const channel = CHANNELS.find((c) => c.type === 'region' && c.key === params.region)
  if (!channel) {
    return new ImageResponse(
      buildPageOgImageJsx('jangsanote', { title: '지역을 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const chips = [
    `회원 ${channel.memberCount.toLocaleString()}명`,
    `게시글 ${channel.postCount.toLocaleString()}개`,
    '지역 게시판',
  ]
  return new ImageResponse(
    buildPageOgImageJsx('jangsanote', {
      pageType: '지역',
      title: `${channel.label} 장사노트`,
      subtitle: channel.description,
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
