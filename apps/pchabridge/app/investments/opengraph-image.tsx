import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { ROUNDS } from '@/lib/mock-data'

export const alt = '프차브릿지 투자 라운드'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const openRounds = ROUNDS.filter((r) => r.status === 'open' || r.status === 'closing-soon')
  const totalTarget = ROUNDS.reduce((s, r) => s + r.targetAmount, 0)

  return new ImageResponse(
    buildPageOgImageJsx('pchabridge', {
      pageType: '투자 라운드',
      title: '프랜차이즈 투자 기회',
      subtitle: '검증된 가맹 브랜드에 투자하세요. 목표 수익률·투자 조건·브랜드 실적을 투명하게 공개합니다.',
      chips: [
        `전체 라운드 ${ROUNDS.length}개`,
        `진행 중 ${openRounds.length}개`,
        `총 모집 ${(totalTarget / 10000).toFixed(0)}억원`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
