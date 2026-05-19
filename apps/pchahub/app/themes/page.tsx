import type { Metadata } from 'next'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '테마별 브랜드',
  description: '저자본 창업·프리미엄·소자본·공동창업 등 테마별로 나에게 맞는 프랜차이즈 브랜드를 찾아보세요.',
  path: '/themes',
})

import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { ThemeIcon } from '@/components/theme-icon'
import { THEMES, THEME_COUNTS } from '@/lib/themes'

const listJsonLd = buildItemListJsonLd({
  url: 'https://pchahub.kr/themes',
  items: THEMES.map((t) => ({ name: t.label, url: `https://pchahub.kr/themes/${t.key}` })),
})

export default function ThemesPage() {
  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">테마별 보기</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            업종이 아닌 운영 조건·라이프스타일·자본 규모로 가맹 브랜드를 묶었습니다. 본인의 상황에
            맞는 테마부터 시작해보세요.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((t) => (
            <a key={t.key} href={`/themes/${t.key}`} className="group">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: 'var(--brand-primary)' }}
                    >
                      <ThemeIcon iconKey={t.iconKey} className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-gray-900">{t.label}</h2>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {THEME_COUNTS[t.key] ?? 0}개
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-gray-600">{t.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs text-gray-500 group-hover:text-gray-900">
                    이 테마 브랜드 보기 <ArrowRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
