import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = {
  ...buildPageMetadata('gongganhansu', {
    title: '검색',
    description: '업종·지역·시공사 이름으로 F&B 매장 인테리어 시공 사례와 시공사를 검색하세요.',
    path: '/search',
  }),
  robots: { index: false, follow: false },
}

import { Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { CONTRACTORS, PORTFOLIO } from '@/lib/mock-data'
import { ContractorCard } from '@/components/contractor-card'
import { PortfolioCard } from '@/components/portfolio-card'

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams.q ?? '').trim()
  const needle = q.toLowerCase()

  const contractors = q
    ? CONTRACTORS.filter(
        (c) =>
          c.name.toLowerCase().includes(needle) ||
          c.specialties.some((s) => s.toLowerCase().includes(needle)) ||
          c.region.toLowerCase().includes(needle) ||
          c.tagline.toLowerCase().includes(needle) ||
          c.highlights.some((h) => h.toLowerCase().includes(needle)),
      )
    : []

  const portfolios = q
    ? PORTFOLIO.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.category.toLowerCase().includes(needle) ||
          p.excerpt.toLowerCase().includes(needle) ||
          p.tags.some((t) => t.toLowerCase().includes(needle)) ||
          p.region.toLowerCase().includes(needle) ||
          p.district.toLowerCase().includes(needle),
      )
    : []

  const total = contractors.length + portfolios.length

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">검색</h1>
          <form method="get" action="/search" className="mt-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="인테리어 업종, 시공사, 지역 검색..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-gray-400 focus:outline-none"
                autoFocus={!q}
              />
            </div>
          </form>
          {q && (
            <p className="mt-3 text-sm text-gray-500">
              <span className="font-medium text-gray-900">'{q}'</span> 검색 결과 · 총 {total}건
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-8">
        {!q && (
          <>
            <Card>
              <CardContent className="py-16 text-center">
                <Search className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">업종·지역·시공사 이름으로 사례를 검색하세요.</p>
              </CardContent>
            </Card>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">인기 검색어</p>
              <div className="flex flex-wrap gap-2">
                {['카페', '치킨', '강남', '홍대', '성수', '한식'].map((keyword) => (
                  <a
                    key={keyword}
                    href={`/search?q=${encodeURIComponent(keyword)}`}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {keyword}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {q && total === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                '<span className="font-medium">{q}</span>'에 대한 결과가 없습니다.
              </p>
              <p className="mt-1 text-xs text-gray-400">다른 키워드로 검색해보세요.</p>
            </CardContent>
          </Card>
        )}

        {portfolios.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              시공 사례 <span className="text-sm font-normal text-gray-400">({portfolios.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {portfolios.slice(0, 9).map((p) => (
                <PortfolioCard key={p.id} item={p} />
              ))}
            </div>
            {portfolios.length > 9 && (
              <a href="/gallery" className="mt-3 inline-flex text-sm text-[var(--brand-primary)] hover:underline">
                사례 {portfolios.length}개 전체보기 →
              </a>
            )}
          </section>
        )}

        {contractors.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              시공사 <span className="text-sm font-normal text-gray-400">({contractors.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contractors.slice(0, 6).map((c) => (
                <ContractorCard key={c.id} contractor={c} />
              ))}
            </div>
            {contractors.length > 6 && (
              <a href="/contractors" className="mt-3 inline-flex text-sm text-[var(--brand-primary)] hover:underline">
                시공사 {contractors.length}개 전체보기 →
              </a>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
