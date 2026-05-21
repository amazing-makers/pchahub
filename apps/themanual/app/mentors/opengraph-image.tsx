import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { MENTORS } from '@/lib/mock-data'

export const alt = '더매뉴얼 전문 멘토'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const avgRating = MENTORS.length
    ? (MENTORS.reduce((s, m) => s + m.rating, 0) / MENTORS.length).toFixed(1)
    : '0'
  const specialtyCount = new Set(MENTORS.flatMap((m) => m.specialties)).size

  return new ImageResponse(
    buildPageOgImageJsx('themanual', {
      pageType: '전문 멘토',
      title: '가맹 전문 멘토',
      subtitle: '창업 계획부터 운영 개선까지. 현직 전문가와 1:1 화상 멘토링으로 맞춤 컨설팅을 받으세요.',
      chips: [
        `멘토 ${MENTORS.length}명`,
        `평균 평점 ${avgRating}점`,
        `전문 분야 ${specialtyCount}개`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
