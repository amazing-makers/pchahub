import { ImageResponse } from 'next/og'
import { buildOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'

export const runtime = 'edge'
export const alt = '공간의한수 — 가맹점 인테리어 시공 매칭'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(buildOgImageJsx('gongganhansu'), { ...OG_IMAGE_SIZE })
}
