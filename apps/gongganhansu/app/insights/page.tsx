import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('gongganhansu', {
  title: '인사이트',
  description: 'F&B 매장 인테리어·시공 관련 인사이트와 트렌드.',
  path: '/insights',
})

import { InsightCard } from '@/components/insight-card'
import { INSIGHTS } from '@/lib/mock-data'

export default function InsightsPage() {
  const sorted = [...INSIGHTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">한 수 인사이트</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            시공 단가·디자인·시공 관리·본사 vs 직접 발주·트렌드. 매장 시공의 핵심 인사이트.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((i) => (
            <InsightCard key={i.id} insight={i} />
          ))}
        </div>
      </div>
    </main>
  )
}
