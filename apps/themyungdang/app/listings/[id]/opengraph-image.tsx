import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { LISTINGS, TYPE_LABEL } from '@/lib/mock-data'

export const alt = '프랜차이즈 입점 매물'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const listing = LISTINGS.find((l) => l.id === params.id)
  if (!listing) {
    return new ImageResponse(
      buildPageOgImageJsx('themyungdang', { title: '매물을 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const chips: string[] = [
    `${listing.region} ${listing.district}`,
    `${listing.area}평 · ${listing.floor}`,
  ]
  if (listing.type === 'sale') {
    chips.push(`매각가 ${(listing.salePrice ?? 0).toLocaleString()}만원`)
  } else {
    chips.push(`보 ${listing.deposit.toLocaleString()}만 / 월 ${listing.monthlyRent.toLocaleString()}만`)
    if (listing.rightFee) chips.push(`권리금 ${listing.rightFee.toLocaleString()}만`)
  }

  return new ImageResponse(
    buildPageOgImageJsx('themyungdang', {
      pageType: `${TYPE_LABEL[listing.type]} 매물`,
      title: listing.title,
      subtitle: listing.tags.slice(0, 4).join(' · '),
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
