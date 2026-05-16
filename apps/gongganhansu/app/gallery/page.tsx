import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('gongganhansu', {
  title: '시공 갤러리',
  description: 'F&B 매장 시공 포트폴리오. 업종·카테고리별로 둘러보세요.',
  path: '/gallery',
})

import { PortfolioCard } from '@/components/portfolio-card'
import { CATEGORIES, PORTFOLIO } from '@/lib/mock-data'

interface GalleryPageProps {
  searchParams: { category?: string }
}

export default function GalleryPage({ searchParams }: GalleryPageProps) {
  const { category } = searchParams
  const items = category ? PORTFOLIO.filter((p) => p.category === category) : PORTFOLIO

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">매장 갤러리</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            F&B 매장 시공 실제 사례. 카테고리·평수·예산·시공 일수까지 모두 공개.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="/gallery"
              className={
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                (!category
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
              }
            >
              전체 ({PORTFOLIO.length})
            </a>
            {CATEGORIES.map((c) => {
              const count = PORTFOLIO.filter((p) => p.category === c.key).length
              if (count === 0) return null
              return (
                <a
                  key={c.key}
                  href={`/gallery?category=${c.key}`}
                  className={
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                    (category === c.key
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }
                >
                  {c.label} ({count})
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <PortfolioCard key={p.id} item={p} />
          ))}
        </div>
      </div>
    </main>
  )
}
