import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { MEETINGS, MEETING_TYPE_LABEL } from '@/lib/mock-data'

export const alt = '장사노트 모임'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return MEETINGS.map((m) => ({ id: m.id }))
}

export default function Image({ params }: { params: { id: string } }) {
  const meeting = MEETINGS.find((m) => m.id === params.id)
  if (!meeting) {
    return new ImageResponse(
      buildPageOgImageJsx('jangsanote', { title: '모임을 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const full = meeting.currentParticipants >= meeting.maxParticipants
  return new ImageResponse(
    buildPageOgImageJsx('jangsanote', {
      pageType: `모임 · ${MEETING_TYPE_LABEL[meeting.type]}`,
      title: meeting.title,
      subtitle: `${meeting.date} · ${meeting.location}`,
      chips: [
        `${meeting.currentParticipants}/${meeting.maxParticipants}명`,
        meeting.isFree ? '무료' : `${meeting.feeWon.toLocaleString()}만원`,
        full ? '마감' : '참가 가능',
        meeting.region,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
