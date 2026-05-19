import type { Metadata } from 'next'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('gongganhansu', {
  title: '시공 갤러리',
  description: 'F&B 매장 시공 포트폴리오. 업종·카테고리별로 둘러보세요.',
  path: '/gallery',
})

import { Search } from 'lucide-react'
import { PortfolioCardWithSave } from '@/components/portfolio-card-with-save'
import { CATEGORIES, PORTFOLIO } from '@/lib/mock-data'

interface GalleryPageProps {
  searchParams: { category?: string; q?: string }
}

export default function GalleryPage({ searchParams }: GalleryPageProps) {
  const { category, q } = searchParams
  const needle = q?.toLowerCase().trim() ?? ''
  let items = category ? PORTFOLIO.filter((p) => p.category === category) : PORTFOLIO
  if (needle) {
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.excerpt.toLowerCase().includes(needle) ||
        p.region.toLowerCase().includes(needle) ||
        p.district.toLowerCase().includes(needle) ||
        p.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }

  const listJsonLd = buildItemListJsonLd({
    url: 'https://gongganhansu.amakers.co.kr/gallery',
    items: items.slice(0, 20).map((p) => ({ name: p.title, url: `https://gongganhansu.amakers.co.kr/gallery/${p.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">매장 갤러리</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            F&B 매장 시공 실제 사례. 카테고리·평수·예산·시공 일수까지 모두 공개.
          </p>

          {/* Search bar */}
          <form method="GET" action="/gallery" className="mt-5 flex max-w-md gap-2">
            {category && <input type="hidden" name="category" value={category} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="매장명, 지역, 태그 검색…"
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              검색
            </button>
            {q && (
              <a
                href={category ? `/gallery?category=${category}` : '/gallery'}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={q ? `/gallery?q=${encodeURIComponent(q)}` : '/gallery'}
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
                  href={`/gallery?category=${c.key}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
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
        {q && (
          <div className="mb-4 text-sm text-gray-700">
            <span className="font-medium text-gray-900">&ldquo;{q}&rdquo;</span> 검색 결과{' '}
            {items.length}건
          </div>
        )}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-sm font-medium text-gray-500">
              {q ? `"${q}" 검색 결과가 없습니다` : '해당 카테고리의 시공 사례가 없습니다'}
            </p>
            <a
              href="/gallery"
              className="mt-4 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              전체 보기
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <PortfolioCardWithSave key={p.id} item={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
