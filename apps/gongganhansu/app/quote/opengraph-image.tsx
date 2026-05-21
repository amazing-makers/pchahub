import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { CONTRACTORS } from '@/lib/mock-data'

export const alt = '공간한수 무료 견적 신청'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    buildPageOgImageJsx('gongganhansu', {
      pageType: '무료 견적',
      title: '매장 인테리어 무료 견적 신청',
      subtitle: '매장 카테고리·면적·지역·예산을 입력하면 적합한 시공사 3~5곳의 견적을 48시간 내에 받아보실 수 있습니다.',
      chips: [
        `시공사 ${CONTRACTORS.length}곳`,
        '영업일 48시간 내 견적',
        '무료 비교',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
