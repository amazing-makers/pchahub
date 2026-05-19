import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { listingById, LISTINGS } from '@/lib/mock-listings'

export const alt = '가맹 입점 매물'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }))
}

export default function Image({ params }: { params: { id: string } }) {
  const listing = listingById(params.id)
  if (!listing) {
    return new ImageResponse(
      buildPageOgImageJsx('pchahub', { title: '매물을 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: listing.listingType,
      title: listing.title,
      subtitle: `${listing.region} ${listing.district} · ${listing.area}평`,
      chips: [
        `보증금 ${listing.deposit.toLocaleString()}만`,
        `월세 ${listing.monthlyRent.toLocaleString()}만`,
        listing.rightFee > 0 ? `권리금 ${listing.rightFee.toLocaleString()}만` : '권리금 없음',
        listing.verified ? '실사 완료' : '',
      ].filter(Boolean),
    }),
    { ...OG_IMAGE_SIZE },
  )
}
