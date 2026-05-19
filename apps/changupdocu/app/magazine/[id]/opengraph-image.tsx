import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { ARTICLES, articleById } from '@/lib/mock-data'

export const alt = '창업다큐 매거진'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ id: a.id }))
}

export default function Image({ params }: { params: { id: string } }) {
  const article = articleById(params.id)
  if (!article) {
    return new ImageResponse(
      buildPageOgImageJsx('changupdocu', { title: '아티클을 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  return new ImageResponse(
    buildPageOgImageJsx('changupdocu', {
      pageType: `매거진 · ${article.category}`,
      title: article.title,
      subtitle: article.subtitle,
      chips: [
        article.authorName,
        `읽기 ${article.readTime}분`,
        article.publishedAt,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
