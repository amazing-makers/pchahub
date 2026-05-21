import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { ROUNDS } from '@/lib/mock-data'

export const alt = '프차브릿지 크라우드펀딩'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const fundingRounds = ROUNDS.filter((r) => r.type === 'crowd' || r.type === 'store-fund')
  const openFunding = fundingRounds.filter((r) => r.status === 'open' || r.status === 'closing-soon')

  return new ImageResponse(
    buildPageOgImageJsx('pchabridge', {
      pageType: '크라우드펀딩',
      title: '가맹 브랜드 크라우드펀딩',
      subtitle: '소액으로 가맹 브랜드에 투자하고 수익을 공유하세요. 마감 임박 프로젝트를 확인하세요.',
      chips: [
        `펀딩 프로젝트 ${fundingRounds.length}개`,
        `진행 중 ${openFunding.length}개`,
        '소액 투자 가능',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
