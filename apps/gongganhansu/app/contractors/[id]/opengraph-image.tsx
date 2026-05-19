import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { CONTRACTORS, contractorById } from '@/lib/mock-data'

export const alt = 'F&B 매장 시공사'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return CONTRACTORS.map((c) => ({ id: c.id }))
}

export default function Image({ params }: { params: { id: string } }) {
  const c = contractorById(params.id)
  if (!c) {
    return new ImageResponse(
      buildPageOgImageJsx('gongganhansu', { title: '시공사를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  return new ImageResponse(
    buildPageOgImageJsx('gongganhansu', {
      pageType: `시공사 · ${c.region}`,
      title: c.name,
      subtitle: c.tagline,
      chips: [
        `★ ${c.rating}`,
        `시공 ${c.projectCount}건`,
        `${c.foundedYear}년 설립`,
        c.verified ? '인증 시공사' : '',
      ].filter(Boolean),
    }),
    { ...OG_IMAGE_SIZE },
  )
}
