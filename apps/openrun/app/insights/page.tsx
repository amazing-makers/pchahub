import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { InsightCard } from '@/components/insight-card'
import { INSIGHT_CATEGORY_LABEL, INSIGHTS, type InsightCategory } from '@/lib/mock-insights'

export const metadata: Metadata = buildPageMetadata('openrun', {
  title: '마케팅 인사이트',
  description: '프랜차이즈 마케팅 전략·데이터·캠페인 노하우. 오픈런이 480개 캠페인 데이터를 바탕으로 정리한 실전 가이드.',
  path: '/insights',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '오픈런', url: 'https://openrun.amakers.co.kr' },
    { name: '인사이트', url: 'https://openrun.amakers.co.kr/insights' },
  ],
})

interface InsightsPageProps {
  searchParams: { category?: string }
}

export default function InsightsPage({ searchParams }: InsightsPageProps) {
  const { category } = searchParams
  const categoryKeys = Object.keys(INSIGHT_CATEGORY_LABEL) as InsightCategory[]

  const filtered = category
    ? INSIGHTS.filter((i) => i.category === category)
    : INSIGHTS

  const listJsonLd = buildItemListJsonLd({
    url: 'https://openrun.amakers.co.kr/insights',
    items: filtered.slice(0, 20).map((i) => ({
      name: i.title,
      url: `https://openrun.amakers.co.kr/insights/${i.id}`,
    })),
  })

  return (
    <main>
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />

      {/* Header */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto py-section">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            Marketing Insights
          </p>
          <h1 className="mt-3 text-h2 font-bold">
            프랜차이즈 마케팅 인사이트
          </h1>
          <p className="mt-3 max-w-xl text-sm text-gray-300">
            오픈런이 480개 캠페인 데이터를 분석해 정리한 실전 마케팅 노하우.
            그랜드오픈·채용·브랜드마케팅 전 분야를 다룹니다.
          </p>

          {/* Category filter */}
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="/insights"
              className={
                'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ' +
                (!category
                  ? 'border-white bg-white text-gray-900'
                  : 'border-white/30 text-white hover:border-white/60')
              }
            >
              전체
            </a>
            {categoryKeys.map((k) => (
              <a
                key={k}
                href={`/insights?category=${k}`}
                className={
                  'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ' +
                  (category === k
                    ? 'border-white bg-white text-gray-900'
                    : 'border-white/30 text-white hover:border-white/60')
                }
              >
                {INSIGHT_CATEGORY_LABEL[k]}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto py-section">
        <div className="mb-4 text-sm font-semibold text-gray-700">{filtered.length}건</div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((i) => (
            <InsightCard key={i.id} insight={i} />
          ))}
        </div>
      </section>
    </main>
  )
}
