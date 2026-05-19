import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { SERVICES, serviceBySlug } from '@/lib/mock-data'

export const alt = '오픈런 마케팅 서비스'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

export default function Image({ params }: { params: { slug: string } }) {
  const service = serviceBySlug(params.slug)
  if (!service) {
    return new ImageResponse(
      buildPageOgImageJsx('openrun', { title: '서비스를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  return new ImageResponse(
    buildPageOgImageJsx('openrun', {
      pageType: '마케팅 서비스',
      title: service.title,
      subtitle: service.subtitle,
      chips: [
        service.priceLabel,
        `기간 ${service.duration}`,
        service.audience,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
