import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { SERVICES, STATS } from '@/lib/mock-data'

export const alt = '오픈런 마케팅 서비스'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    buildPageOgImageJsx('openrun', {
      pageType: '통합 마케팅',
      title: '오픈런 서비스',
      subtitle: '점주·본사·브랜드 각자의 시점에 맞는 3가지 통합 마케팅 캠페인.',
      chips: [
        `서비스 ${SERVICES.length}가지`,
        `누적 캠페인 ${STATS.campaigns.toLocaleString()}건`,
        `평균 ROI +${STATS.averageROI}%`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
