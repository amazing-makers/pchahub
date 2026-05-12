import { ImageResponse } from 'next/og'
import { buildOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'

export const runtime = 'edge'
export const alt = '오픈런 — 프랜차이즈 본사·매장 마케팅 에이전시'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(buildOgImageJsx('openrun'), { ...OG_IMAGE_SIZE })
}
