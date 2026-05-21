import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { KNOWHOW_CATEGORY_LABEL, knowhowById, KNOWHOW_ITEMS } from '@/lib/knowhow'

export const alt = '노하우 아티클'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export async function generateStaticParams() {
  return KNOWHOW_ITEMS.map((k) => ({ id: k.id }))
}

export default async function Image({ params }: { params: { id: string } }) {
  const item = knowhowById(params.id)
  if (!item) {
    return new ImageResponse(
      buildPageOgImageJsx('themanual', { title: '아티클을 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }

  const chips = [
    KNOWHOW_CATEGORY_LABEL[item.category],
    `${item.readTime}분 읽기`,
    item.price > 0 ? `${item.price.toLocaleString()}원` : '무료',
    item.premium ? '프리미엄' : '무료 공개',
  ]

  return new ImageResponse(
    buildPageOgImageJsx('themanual', {
      pageType: '노하우',
      title: item.title,
      subtitle: item.excerpt,
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
