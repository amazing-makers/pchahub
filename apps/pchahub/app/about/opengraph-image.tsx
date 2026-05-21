import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'

export const alt = '프차허브 소개'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: '플랫폼 소개',
      title: '한국 프랜차이즈의 모든 것을 OPEN한다',
      subtitle: '공정거래위원회 가맹정보 기반 브랜드 비교·창업 수익 계산·가맹 매물·커뮤니티. 9개 전문 플랫폼의 통합 허브.',
      chips: ['9개 전문 플랫폼', '협회 공시 1차 데이터', '정보 비대칭 해소'],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
