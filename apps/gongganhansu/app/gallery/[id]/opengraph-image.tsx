import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { CATEGORIES, contractorById, PORTFOLIO } from '@/lib/mock-data'

export const alt = '시공 사례'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const item = PORTFOLIO.find((p) => p.id === params.id)
  if (!item) {
    return new ImageResponse(
      buildPageOgImageJsx('gongganhansu', { title: '시공 사례를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const cat = CATEGORIES.find((c) => c.key === item.category)
  const contractor = contractorById(item.contractorId)
  const chips = [
    `${item.area}평`,
    `예산 ${item.budget.toLocaleString()}만`,
    `${item.durationDays}일 시공`,
    ...(contractor ? [contractor.name] : []),
  ]

  return new ImageResponse(
    buildPageOgImageJsx('gongganhansu', {
      pageType: cat ? `${cat.label} 시공 사례` : '시공 사례',
      title: item.title,
      subtitle: item.excerpt,
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
