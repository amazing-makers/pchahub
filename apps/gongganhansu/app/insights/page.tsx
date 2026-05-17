import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('gongganhansu', {
  title: '인사이트',
  description: 'F&B 매장 인테리어·시공 관련 인사이트와 트렌드.',
  path: '/insights',
})

import { InsightCard } from '@/components/insight-card'
import { INSIGHTS } from '@/lib/mock-data'

interface InsightsPageProps {
  searchParams: { tag?: string }
}

export default function InsightsPage({ searchParams }: InsightsPageProps) {
  const tag = searchParams.tag
  const sorted = [...INSIGHTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  const filtered = tag ? sorted.filter((i) => i.category === tag || i.tags?.includes(tag)) : sorted

  // Derive unique categories from INSIGHTS (preserving order of first appearance)
  const tags = Array.from(new Set(INSIGHTS.map((i) => i.category)))

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">한 수 인사이트</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            시공 단가·디자인·시공 관리·본사 vs 직접 발주·트렌드. 매장 시공의 핵심 인사이트.
          </p>

          {/* 태그 필터 */}
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="/insights"
              className={
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                (!tag ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
              }
            >
              전체 ({INSIGHTS.length})
            </a>
            {tags.map((t) => {
              const count = INSIGHTS.filter((i) => i.category === t || i.tags?.includes(t)).length
              return (
                <a
                  key={t}
                  href={`/insights?tag=${encodeURIComponent(t)}`}
                  className={
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                    (tag === t ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }
                >
                  {t} ({count})
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((i) => (
            <InsightCard key={i.id} insight={i} />
          ))}
        </div>
      </div>
    </main>
  )
}
