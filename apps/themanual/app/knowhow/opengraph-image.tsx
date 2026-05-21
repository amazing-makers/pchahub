import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { KNOWHOW_ITEMS } from '@/lib/knowhow'

export const alt = '더매뉴얼 운영 노하우'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const freeCount = KNOWHOW_ITEMS.filter((k) => !k.premium).length
  const totalViews = KNOWHOW_ITEMS.reduce((s, k) => s + k.viewCount, 0)

  return new ImageResponse(
    buildPageOgImageJsx('themanual', {
      pageType: '운영 노하우',
      title: '가맹점 운영 노하우',
      subtitle: '매출 관리·원가 절감·직원 운영·마케팅까지. 실전 점주들의 검증된 노하우를 만나보세요.',
      chips: [
        `노하우 ${KNOWHOW_ITEMS.length}개`,
        `무료 ${freeCount}개`,
        `누적 조회 ${totalViews.toLocaleString()}회`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
