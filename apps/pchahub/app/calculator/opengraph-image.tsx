import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { BRANDS } from '@/lib/mock-data'

export const alt = '프차허브 창업 수익 계산기'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: '수익 계산기',
      title: '예상 월매출·순이익·회수 기간 시뮬레이션',
      subtitle: '브랜드·지역·면적·운영 조건을 입력하면 실시간으로 예상 수익과 투자 회수 기간을 계산해 드립니다.',
      chips: [
        `${BRANDS.length}개 브랜드 선택 가능`,
        '협회 정보공개서 기반',
        '무료 이용',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
