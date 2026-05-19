import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { DISCUSSIONS } from '@/lib/mock-community'

export const alt = '프차허브 커뮤니티'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return DISCUSSIONS.map((d) => ({ id: d.id }))
}

export default function Image({ params }: { params: { id: string } }) {
  const d = DISCUSSIONS.find((d) => d.id === params.id)
  if (!d) {
    return new ImageResponse(
      buildPageOgImageJsx('pchahub', { title: '게시글을 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: `커뮤니티 · ${d.categoryLabel}`,
      title: d.title,
      subtitle: d.excerpt.slice(0, 80),
      chips: [
        d.author,
        `조회 ${d.views.toLocaleString()}`,
        `댓글 ${d.comments}`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
