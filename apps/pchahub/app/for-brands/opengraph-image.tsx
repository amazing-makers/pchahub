import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { BRANDS } from '@/lib/mock-data'

export const alt = '프차허브 본사 파트너십'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: '본사 파트너십',
      title: '검증된 예비 점주와 연결되세요',
      subtitle: '창업 스캐너로 필터링된 예비 점주에게 브랜드를 노출하고 가맹 성사율을 높이세요. 기본 등록 무료.',
      chips: [
        `등록 브랜드 ${BRANDS.length}개`,
        '월 방문자 18만 명',
        '기본 등록 무료',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
