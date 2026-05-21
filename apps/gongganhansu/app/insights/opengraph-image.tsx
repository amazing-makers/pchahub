import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { INSIGHTS } from '@/lib/mock-data'

export const alt = '공간한수 인테리어 인사이트'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const categoryCount = new Set(INSIGHTS.map((i) => i.category)).size
  const avgReadTime = INSIGHTS.length
    ? Math.round(INSIGHTS.reduce((s, i) => s + i.readTime, 0) / INSIGHTS.length)
    : 0

  return new ImageResponse(
    buildPageOgImageJsx('gongganhansu', {
      pageType: '인사이트',
      title: '인테리어·시공 인사이트',
      subtitle: '가맹점 인테리어 트렌드·원가 절감 팁·시공 주의사항을 전문가가 알려드립니다.',
      chips: [
        `아티클 ${INSIGHTS.length}개`,
        `${categoryCount}개 주제`,
        `평균 읽기 ${avgReadTime}분`,
        '전문가 칼럼',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
