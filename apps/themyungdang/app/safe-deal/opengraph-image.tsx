import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'

export const alt = '더명당 안전 거래'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    buildPageOgImageJsx('themyungdang', {
      pageType: '안전 거래',
      title: '권리금 거래의 위험을 절반으로 줄입니다',
      subtitle: '매물 실사·표준 계약서·에스크로 결제·30일 분쟁 보호까지. amakers 안전 거래로 권리금 분쟁과 허위 매물 위험을 줄이세요.',
      chips: ['누적 안전 거래 4,820건', '평균 분쟁 처리 5일', '고객 만족도 94%'],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
