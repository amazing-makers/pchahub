import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { brandById, STORES } from '@/lib/mock-data'

export const alt = '매장 정보'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const store = STORES.find((s) => s.id === params.id)
  if (!store) {
    return new ImageResponse(
      buildPageOgImageJsx('bestplace', { title: '매장을 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const brand = brandById(store.brandId)
  const chips = [
    `★ ${store.rating} (${store.reviewCount.toLocaleString()})`,
    `월 방문 ${store.monthlyVisitors.toLocaleString()}명`,
    `${store.region} ${store.district}`,
    ...(store.awards.length > 0 ? [store.awards[0]] : []),
  ]

  return new ImageResponse(
    buildPageOgImageJsx('bestplace', {
      pageType: brand ? `${brand.categoryLabel} 매장` : '매장',
      title: store.name,
      subtitle: store.highlights.slice(0, 3).join(' · '),
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
