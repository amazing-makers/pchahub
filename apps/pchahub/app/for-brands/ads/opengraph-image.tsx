import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'

export const alt = '프차허브 본사 광고 상품'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: '광고 상품',
      title: '예비 창업자 월 18만 명에게 브랜드 노출',
      subtitle: '카테고리 상단 노출·홈 hero·우선 매칭. 월 정액제로 CPC 부담 없이 가맹 모집 효율을 높이세요.',
      chips: ['기본 등록 무료', '월 정액제 광고', '약정 없음'],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
