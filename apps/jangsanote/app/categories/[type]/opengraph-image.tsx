import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { CHANNELS } from '@/lib/mock-data'

export const alt = '장사노트 카테고리'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return CHANNELS.filter((c) => c.type === 'category').map((c) => ({ type: c.key }))
}

export default async function Image({ params }: { params: { type: string } }) {
  const channel = CHANNELS.find((c) => c.type === 'category' && c.key === params.type)
  if (!channel) {
    return new ImageResponse(
      buildPageOgImageJsx('jangsanote', { title: '카테고리를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const chips = [
    `회원 ${channel.memberCount.toLocaleString()}명`,
    `게시글 ${channel.postCount.toLocaleString()}개`,
    '장사노트',
  ]
  return new ImageResponse(
    buildPageOgImageJsx('jangsanote', {
      pageType: '카테고리',
      title: channel.label,
      subtitle: channel.description,
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
