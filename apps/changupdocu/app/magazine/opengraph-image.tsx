import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { ARTICLES } from '@/lib/mock-data'

export const alt = '창업다큐 매거진'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image() {
  const avgReadTime = ARTICLES.length
    ? Math.round(ARTICLES.reduce((s, a) => s + a.readTime, 0) / ARTICLES.length)
    : 0
  const featuredCount = ARTICLES.filter((a) => a.featured).length

  return new ImageResponse(
    buildPageOgImageJsx('changupdocu', {
      pageType: '매거진',
      title: '현장에서 길어 올린 창업 인사이트',
      subtitle: '회계사·변호사·컨설턴트·현직 점주가 쓰는 깊이 있는 창업 분석과 전략.',
      chips: [
        `아티클 ${ARTICLES.length}편`,
        `평균 ${avgReadTime}분 읽기`,
        `추천 ${featuredCount}편`,
      ],
    }),
    { ...OG_IMAGE_SIZE },
  )
}
