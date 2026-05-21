import { ImageResponse } from 'next/og'
import { buildPageOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
import { THEMES, THEME_COUNTS, brandsForTheme } from '@/lib/themes'

export const alt = '프랜차이즈 테마'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return THEMES.map((t) => ({ type: t.key }))
}

export default async function Image({ params }: { params: { type: string } }) {
  const theme = THEMES.find((t) => t.key === params.type)
  if (!theme) {
    return new ImageResponse(
      buildPageOgImageJsx('pchahub', { title: '테마를 찾을 수 없습니다' }),
      { ...OG_IMAGE_SIZE },
    )
  }
  const count = THEME_COUNTS[theme.key] ?? brandsForTheme(theme.key).length
  const chips = [`브랜드 ${count}개`, '가맹 창업', '테마별 탐색']
  return new ImageResponse(
    buildPageOgImageJsx('pchahub', {
      pageType: '테마',
      title: theme.label,
      subtitle: theme.description,
      chips,
    }),
    { ...OG_IMAGE_SIZE },
  )
}
