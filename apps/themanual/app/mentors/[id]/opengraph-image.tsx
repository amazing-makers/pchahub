import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { MENTORS } from '@/lib/mock-data'

export const alt = '멘토 프로필'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return MENTORS.map((m) => ({ id: m.id }))
}

export default function Image({ params }: { params: { id: string } }) {
  const mentor = MENTORS.find((m) => m.id === params.id)
  if (!mentor) {
    return new ImageResponse(
      buildPageOgImageJsx('themanual', { title: '멘토를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  return new ImageResponse(
    buildPageOgImageJsx('themanual', {
      pageType: '멘토',
      title: mentor.name,
      subtitle: `${mentor.role} · ${mentor.specialties.slice(0, 2).join(' · ')} 전문`,
      chips: [
        `★ ${mentor.rating}`,
        `상담 ${mentor.totalConsultations}건`,
        `${(mentor.hourlyRate / 10000).toFixed(0)}만원/시간`,
        `경력 ${mentor.yearsOfExperience}년`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
