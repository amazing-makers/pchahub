import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { BRANDS, CATEGORIES } from '@/lib/mock-data'

export const alt = '프차허브 업종 카테고리'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ key: c.key }))
}

export default async function Image({ params }: { params: { key: string } }) {
  const category = CATEGORIES.find((c) => c.key === params.key)
  if (!category) {
    return new ImageResponse(
      buildPageOgImageJsx('pchahub', { title: '카테고리를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }

  const brands = BRANDS.filter((b) => b.category === category.key)
  const avgCost = brands.length
    ? Math.round(brands.reduce((s, b) => s + b.startupCost, 0) / brands.length)
    : 0
  const totalStores = brands.reduce((s, b) => s + b.storeCount, 0)

  const chips = [
    `브랜드 ${brands.length}개`,
    `전국 매장 ${totalStores.toLocaleString()}개`,
    `평균 창업비 ${avgCost.toLocaleString()}만원`,
    '가맹정보공개서 기준',
  ]

  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: '업종 카테고리',
      title: `${category.label} 가맹 브랜드`,
      subtitle: `${category.label} 업종 가맹 브랜드 ${brands.length}개의 창업비·매장 수·성장률을 한눈에 비교하세요.`,
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
