import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { PORTFOLIO, STATS } from '@/lib/mock-data'

export const alt = '오픈런 캠페인 사례'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    buildPageOgImageJsx('openrun', {
      pageType: '캠페인 사례',
      title: '실제 캠페인 결과 공개',
      subtitle: '실제 진행한 캠페인과 측정된 결과를 모두 공개합니다.',
      chips: [
        `공개 사례 ${PORTFOLIO.length}건`,
        `누적 캠페인 ${STATS.campaigns.toLocaleString()}건`,
        `평균 ROI +${STATS.averageROI}%`,
        '집계 기준 실측 데이터',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
