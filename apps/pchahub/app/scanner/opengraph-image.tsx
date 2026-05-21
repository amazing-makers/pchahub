import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { BRANDS } from '@/lib/mock-data'

export const alt = '프차허브 창업 스캐너'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: '창업 스캐너',
      title: '7문항으로 나에게 맞는 브랜드 Top 3',
      subtitle: '자본·지역·업종·운영 조건을 입력하면 협회 정보공개서 데이터 기반으로 최적의 가맹 브랜드를 추천합니다.',
      chips: [
        '7개 질문',
        `${BRANDS.length}개 브랜드 중 매칭`,
        '무료 이용',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
