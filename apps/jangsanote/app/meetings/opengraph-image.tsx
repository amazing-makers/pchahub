import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { MEETINGS } from '@/lib/mock-data'

export const alt = '장사노트 점주 모임'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const regionCount = new Set(MEETINGS.map((m) => m.region)).size
  const upcomingCount = MEETINGS.filter((m) => m.status === 'upcoming').length

  return new ImageResponse(
    buildPageOgImageJsx('jangsanote', {
      pageType: '점주 모임',
      title: '자영업·가맹점주 오프라인 모임',
      subtitle: '지역별 점주 네트워킹·스터디·정보 교류 모임. 근처 점주와 직접 만나보세요.',
      chips: [
        `전체 모임 ${MEETINGS.length}개`,
        `예정 모임 ${upcomingCount}개`,
        `${regionCount}개 지역`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
