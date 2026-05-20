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
  url: 'https://pchahub.amakers.co.kr/themes',
  items: THEMES.map((t) => ({ name: t.label, url: `https://pchahub.amakers.co.kr/themes/${t.key}` })),
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

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">업종별 테마 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">카페·치킨·분식 등 업종별 신규 브랜드·시장 동향을 격주로 보내드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
                placeholder="이메일 주소"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                구독하기
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}
