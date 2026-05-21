import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { LISTINGS } from '@/lib/mock-data'

export const alt = '더명당 창업 매물'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const regionCount = new Set(LISTINGS.map((l) => l.region)).size
  const transferCount = LISTINGS.filter((l) => l.type === 'transfer').length

  return new ImageResponse(
    buildPageOgImageJsx('themyungdang', {
      pageType: '창업 매물',
      title: '전국 창업 매물',
      subtitle: '신규·권리금·매매 창업 매물을 지역·면적·예산에 맞게 필터하고 비교하세요.',
      chips: [
        `매물 ${LISTINGS.length}건`,
        `${regionCount}개 지역`,
        `권리금 매물 ${transferCount}건`,
        '가맹점 적합성 분석',
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
