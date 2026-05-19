import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { AREAS } from '@/lib/mock-data'

export const alt = '상권 분석'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return AREAS.map((a) => ({ name: a.key }))
}

export default function Image({ params }: { params: { name: string } }) {
  const area = AREAS.find((a) => a.key === params.name)
  if (!area) {
    return new ImageResponse(
      buildPageOgImageJsx('themyungdang', { title: '상권 정보를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  return new ImageResponse(
    buildPageOgImageJsx('themyungdang', {
      pageType: `상권 분석 · ${area.region} ${area.district}`,
      title: area.name,
      subtitle: area.description,
      chips: [
        `유동인구 ${(area.footTraffic / 10000).toFixed(1)}만명/일`,
        `평당 월세 ${area.avgMonthlyRentPerPyeong}만원`,
        `평균 권리금 ${(area.avgRightFee / 10000).toFixed(1)}억원`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
