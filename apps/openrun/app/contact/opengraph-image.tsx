import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { STATS } from '@/lib/mock-data'

export const alt = '오픈런 캠페인 의뢰'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    buildPageOgImageJsx('openrun', {
      pageType: '캠페인 의뢰',
      title: '그랜드 오픈·가맹 모집 캠페인 의뢰',
      subtitle: '폼을 채워주시면 영업일 기준 24시간 이내 캠페인 기획안과 예상 견적을 보내드립니다.',
      chips: [
        `누적 캠페인 ${STATS.campaigns.toLocaleString()}건`,
        `평균 ROI +${STATS.averageROI}%`,
        '24시간 내 회신',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
