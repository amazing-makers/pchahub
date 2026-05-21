import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { COURSES } from '@/lib/mock-data'

export const alt = '더매뉴얼 가맹 운영 강의'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const avgRating = COURSES.length
    ? (COURSES.reduce((s, c) => s + c.rating, 0) / COURSES.length).toFixed(1)
    : '0'
  const totalReviews = COURSES.reduce((s, c) => s + c.reviewCount, 0)

  return new ImageResponse(
    buildPageOgImageJsx('themanual', {
      pageType: '가맹 강의',
      title: '가맹점 운영 강의',
      subtitle: '개점 준비·원가 관리·마케팅·직원 교육까지. 실전 전문가의 가맹 운영 강의를 만나보세요.',
      chips: [
        `강의 ${COURSES.length}개`,
        `평균 평점 ${avgRating}점`,
        `수강 후기 ${totalReviews.toLocaleString()}개`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
