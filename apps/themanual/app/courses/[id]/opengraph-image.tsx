import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { COURSE_CATEGORIES, COURSES, LEVEL_LABEL } from '@/lib/mock-data'

export const alt = '가맹 운영 강의'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const course = COURSES.find((c) => c.id === params.id)
  if (!course) {
    return new ImageResponse(
      buildPageOgImageJsx('themanual', { title: '강의를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const cat = COURSE_CATEGORIES.find((c) => c.key === course.category)
  const isFree = course.price === 0
  const chips = [
    LEVEL_LABEL[course.level],
    `${course.lessonCount}강 · ${Math.floor(course.durationMin / 60)}시간`,
    `★ ${course.rating} (${course.reviewCount.toLocaleString()})`,
    isFree ? '무료' : `${course.price.toLocaleString()}원`,
  ]

  return new ImageResponse(
    buildPageOgImageJsx('themanual', {
      pageType: cat?.label ?? '강의',
      title: course.title,
      subtitle: course.subtitle,
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
