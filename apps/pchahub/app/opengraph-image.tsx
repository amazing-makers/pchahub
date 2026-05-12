import { ImageResponse } from 'next/og'
import { buildOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'

export const runtime = 'edge'
export const alt = '프차허브 — 한국 프랜차이즈 가맹 정보 플랫폼'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(buildOgImageJsx('pchahub'), { ...OG_IMAGE_SIZE })
}
