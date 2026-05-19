import type { Metadata } from 'next'
import { Card, CardContent } from '@amakers/ui'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import { CATEGORY_COLOR, CATEGORY_LABEL, EPISODES, type EpisodeCategory } from '@/lib/mock-data'

const VALID_CATEGORIES: EpisodeCategory[] = ['success', 'failure', 'brand', 'trend', 'interview']

export const metadata: Metadata = buildPageMetadata('changupdocu', {
  title: '카테고리',
  description: '창업다큐 카테고리 — 성공·실패·브랜드·트렌드·인터뷰별 에피소드.',
  path: '/categories',
})

export default function CategoriesPage() {
  const summaries = VALID_CATEGORIES.map((cat) => ({
    key: cat,
    label: CATEGORY_LABEL[cat],
    color: CATEGORY_COLOR[cat],
    count: EPISODES.filter((e) => e.category === cat).length,
  }))

  const listJsonLd = buildItemListJsonLd({
    url: 'https://changupdocu.amakers.co.kr/categories',
    items: summaries.map((s) => ({ name: s.label, url: `https://changupdocu.amakers.co.kr/categories/${s.key}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">카테고리</h1>
          <p className="mt-1 text-sm text-gray-500">
            창업다큐 에피소드를 주제별로 모아보세요. 총 {formatNumber(EPISODES.length)}편.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((s) => (
            <a key={s.key} href={`/categories/${s.key}`} className="group block">
              <Card className="h-full overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
                <div
                  className="h-2"
                  style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}AA)` }}
                />
                <CardContent className="p-5">
                  <h2 className="text-h4 font-bold text-gray-900 group-hover:text-gray-700">
                    {s.label}
                  </h2>
                  <p className="mt-3 text-xs text-gray-500">
                    에피소드 {formatNumber(s.count)}편
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
