import { ImageResponse } from 'next/og'
import { buildOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'

export const runtime = 'edge'
export const alt = '장사노트 — 자영업·가맹점주 커뮤니티'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(buildOgImageJsx('jangsanote'), { ...OG_IMAGE_SIZE })
}
