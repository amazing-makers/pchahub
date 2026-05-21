import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { CONTRACTORS } from '@/lib/mock-data'

export const alt = '공간한수 시공 업체'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const avgRating = CONTRACTORS.length
    ? (CONTRACTORS.reduce((s, c) => s + c.rating, 0) / CONTRACTORS.length).toFixed(1)
    : '0'
  const regionCount = new Set(CONTRACTORS.map((c) => c.region)).size

  return new ImageResponse(
    buildPageOgImageJsx('gongganhansu', {
      pageType: '시공 업체',
      title: '프랜차이즈 전문 시공 업체',
      subtitle: '가맹점 인테리어·리모델링 전문 업체. 평점·포트폴리오·지역별로 비교하세요.',
      chips: [
        `등록 업체 ${CONTRACTORS.length}곳`,
        `평균 평점 ${avgRating}점`,
        `${regionCount}개 지역`,
        '가맹 전문 시공',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
