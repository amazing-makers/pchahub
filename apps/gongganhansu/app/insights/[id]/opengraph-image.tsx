import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { INSIGHTS, insightById } from '@/lib/mock-data'

export const alt = '시공 인사이트'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return INSIGHTS.map((i) => ({ id: i.id }))
}

export default function Image({ params }: { params: { id: string } }) {
  const insight = insightById(params.id)
  if (!insight) {
    return new ImageResponse(
      buildPageOgImageJsx('gongganhansu', { title: '인사이트를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  return new ImageResponse(
    buildPageOgImageJsx('gongganhansu', {
      pageType: `시공 인사이트 · ${insight.category}`,
      title: insight.title,
      subtitle: insight.subtitle,
      chips: [
        insight.authorName,
        `읽기 ${insight.readTime}분`,
        insight.publishedAt,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
