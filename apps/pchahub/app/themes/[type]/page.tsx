import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AlertCircle, ArrowRight, BookOpen, ChevronRight, MapPin, MessageSquare, Store } from 'lucide-react'
import { Card, CardContent, NewsletterForm } from '@amakers/ui'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import { BrandCard } from '@/components/brand-card'
import { ThemeIcon } from '@/components/theme-icon'
import { THEMES, THEME_COUNTS, brandsForTheme } from '@/lib/themes'

export function generateStaticParams() {
  return THEMES.map((t) => ({ type: t.key }))
}

interface ThemePageProps {
  params: { type: string }
}

export function generateMetadata({ params }: ThemePageProps): Metadata {
  const theme = THEMES.find((t) => t.key === params.type)
  if (!theme) return {}
  const count = THEME_COUNTS[theme.key] ?? 0
  return buildPageMetadata('pchahub', {
    title: `${theme.label} 브랜드 ${count}개`,
    description: `${theme.description} 프랜차이즈 브랜드 ${count}곳을 확인하세요.`,
    path: `/themes/${theme.key}`,
  })
}

export default function ThemePage({ params }: ThemePageProps) {
  const theme = THEMES.find((t) => t.key === params.type)
  if (!theme) notFound()

  const brands = brandsForTheme(theme.key)
  const otherThemes = THEMES.filter((t) => t.key !== theme.key).slice(0, 4)
  const totalStores = brands.reduce((s, b) => s + (b.storeCount ?? 0), 0)
  const recruitingCount = brands.filter((b) => b.recruiting).length

  const themeUrl = `https://pchahub.amakers.co.kr/themes/${theme.key}`
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '테마별', url: 'https://pchahub.amakers.co.kr/themes' },
      { name: theme.label, url: themeUrl },
    ],
  })
  const listJsonLd = buildItemListJsonLd({
    url: themeUrl,
    items: brands.slice(0, 20).map((b) => ({ name: b.name, url: `https://pchahub.amakers.co.kr/brands/${b.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-10">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/themes" className="hover:text-gray-900">
              테마별
            </a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{theme.label}</span>
          </nav>

          <div className="mt-6 flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: 'var(--brand-primary)' }}
            >
              <ThemeIcon iconKey={theme.iconKey} className="h-7 w-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-h2 font-bold text-gray-900">{theme.label}</h1>
              <p className="mt-1 text-gray-600">{theme.description}</p>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-700">{theme.guide}</p>
        </div>
      </section>

      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          {[
            { value: `${brands.length}개`, label: '이 테마 브랜드' },
            { value: formatNumber(totalStores), label: '총 가맹점 수' },
            { value: `${recruitingCount}개`, label: '모집 중 브랜드' },
            { value: `${THEMES.length}개`, label: '전체 테마' },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-4">
              <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
              <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-8 space-y-8">
        {/* Considerations */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-semibold text-gray-900">
                이 테마 선택 시 고려할 점
              </h2>
            </div>
            <ul className="mt-4 space-y-2.5">
              {theme.considerations.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span
                    className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: 'var(--brand-primary)' }}
                  />
                  {c}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Matched brands */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-h4 font-semibold text-gray-900">
              이 테마에 맞는 {brands.length}개 브랜드
            </h2>
            <a
              href="/brands"
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              전체 브랜드 보기 <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          {brands.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-sm text-gray-500">
                이 테마에 해당하는 브랜드가 아직 없습니다.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {brands.map((b) => (
                <BrandCard key={b.id} brand={b} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">업종별 브랜드 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">이 테마의 신규 브랜드·시장 동향·창업 이벤트 소식을 격주로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}
