import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { AREAS } from '@/lib/mock-data'

export const alt = '더명당 상권 분석'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const uniqueRegions = Array.from(new Set(AREAS.map((a) => a.region))).length
  const avgFootTraffic = AREAS.length
    ? Math.round(AREAS.reduce((s, a) => s + a.footTraffic, 0) / AREAS.length)
    : 0

  return new ImageResponse(
    buildPageOgImageJsx('themyungdang', {
      pageType: '상권 분석',
      title: '전국 주요 상권 분석',
      subtitle: '유동인구·임대료·업종 비중을 지도에서 직접 확인하세요. 창업 입지 선정에 필수적인 상권 데이터.',
      chips: [
        `분석 상권 ${AREAS.length}개`,
        `커버 지역 ${uniqueRegions}개`,
        `평균 유동인구 ${avgFootTraffic.toLocaleString()}명`,
        '실시간 상권 지도',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
