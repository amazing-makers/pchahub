import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'

export const alt = '프차허브 가맹 상담 신청'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: '가맹 상담 신청',
      title: '관심 브랜드에 가맹 상담 신청하기',
      subtitle: '정보를 남겨주시면 영업일 기준 24시간 이내에 담당자가 연락드립니다.',
      chips: ['무료 상담', '24시간 내 회신', '전문 상담사 연결'],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
