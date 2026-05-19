import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { brandById, MA_LISTINGS, maListingById } from '@/lib/mock-data'

export const alt = 'M&A 매물'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return MA_LISTINGS.map((m) => ({ id: m.id }))
}

export default function Image({ params }: { params: { id: string } }) {
  const listing = maListingById(params.id)
  if (!listing) {
    return new ImageResponse(
      buildPageOgImageJsx('pchabridge', { title: 'M&A 매물을 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const brand = brandById(listing.brandId)
  const pe = (listing.askingPrice / listing.annualProfit).toFixed(1)
  return new ImageResponse(
    buildPageOgImageJsx('pchabridge', {
      pageType: `M&A 매물 · ${brand?.categoryLabel ?? ''}`,
      title: `${brand?.name ?? '브랜드'} 매각`,
      subtitle: listing.rationale,
      chips: [
        `매장 ${listing.storeCount}개`,
        `운영 ${listing.yearsOperating}년`,
        `P/E ${pe}배`,
        listing.ndaRequired ? 'NDA 필요' : '공개 매물',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
