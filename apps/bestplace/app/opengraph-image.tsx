import { ImageResponse } from 'next/og'
import { buildOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'

export const runtime = 'edge'
export const alt = '베스트플레이스 — 매장 디렉토리 + 베스트 어워드'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(buildOgImageJsx('bestplace'), { ...OG_IMAGE_SIZE })
}
