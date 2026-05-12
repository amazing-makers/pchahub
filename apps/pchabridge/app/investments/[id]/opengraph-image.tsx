import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import {
  brandById,
  progressPercent,
  ROUND_STATUS_LABEL,
  ROUND_TYPE_LABEL,
  roundById,
} from '@/lib/mock-data'

export const alt = '프랜차이즈 투자 라운드'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const round = roundById(params.id)
  if (!round) {
    return new ImageResponse(
      buildPageOgImageJsx('pchabridge', { title: '투자 라운드를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const brand = brandById(round.brandId)
  const progress = progressPercent(round)
  const chips = [
    `목표 ${round.targetAmount.toLocaleString()}만`,
    `${progress}% 달성`,
    `예상 ROI +${round.expectedAnnualROI}%/년`,
    `마감 ${round.closeDate}`,
  ]
  return new ImageResponse(
    buildPageOgImageJsx('pchabridge', {
      pageType: `${ROUND_TYPE_LABEL[round.type]} · ${ROUND_STATUS_LABEL[round.status]}`,
      title: `${brand?.name ?? '브랜드'} ${ROUND_TYPE_LABEL[round.type]}`,
      subtitle: round.hook,
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
