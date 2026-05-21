import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { CATEGORY_LABEL, episodesByCategory, type EpisodeCategory } from '@/lib/mock-data'

export const alt = '창업다큐 카테고리'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

const VALID_CATEGORIES: EpisodeCategory[] = ['success', 'failure', 'brand', 'trend', 'interview']

export function generateStaticParams() {
  return VALID_CATEGORIES.map((type) => ({ type }))
}

export default async function Image({ params }: { params: { type: string } }) {
  const cat = params.type as EpisodeCategory
  if (!VALID_CATEGORIES.includes(cat)) {
    return new ImageResponse(
      buildPageOgImageJsx('changupdocu', { title: '카테고리를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const count = episodesByCategory(cat).length
  const chips = [`총 ${count}편`, '창업다큐']
  return new ImageResponse(
    buildPageOgImageJsx('changupdocu', {
      pageType: '카테고리',
      title: `${CATEGORY_LABEL[cat]} 다큐`,
      subtitle: `창업다큐 ${CATEGORY_LABEL[cat]} 카테고리 에피소드 ${count}편을 확인하세요.`,
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
