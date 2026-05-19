import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { AVAILABLE_YEARS, awardsByYear } from '@/lib/mock-data'

export const alt = '베스트플레이스 어워드'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return AVAILABLE_YEARS.map((y) => ({ year: String(y) }))
}

export default function Image({ params }: { params: { year: string } }) {
  const year = Number(params.year)
  const awards = awardsByYear(year)
  if (!year || awards.length === 0) {
    return new ImageResponse(
      buildPageOgImageJsx('bestplace', { title: '어워드 정보를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  return new ImageResponse(
    buildPageOgImageJsx('bestplace', {
      pageType: `${year}년 베스트플레이스 어워드`,
      title: `${year}년 올해의 브랜드`,
      subtitle: `${awards.length}개 브랜드 수상 · 카테고리별 최우수 선정`,
      chips: [
        `${year}년`,
        `${awards.length}개 수상`,
        'amakers 선정',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
