import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { caseById } from '@/lib/mock-data'

export const alt = '캠페인 사례'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const c = caseById(params.id)
  if (!c) {
    return new ImageResponse(
      buildPageOgImageJsx('openrun', { title: '캠페인 사례를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const chips = [c.client, c.industry, c.region, c.duration]
  return new ImageResponse(
    buildPageOgImageJsx('openrun', {
      pageType: c.serviceLabel,
      title: c.title,
      subtitle: c.hook,
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
