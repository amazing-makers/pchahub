import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = {
  ...buildPageMetadata('bestplace', {
    title: '검색',
    description: '매장명·브랜드·지역으로 베스트플레이스 수상 매장과 브랜드를 검색하세요.',
    path: '/search',
  }),
  robots: { index: false, follow: false },
}

import { Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { STORES, BRANDS } from '@/lib/mock-data'
import { StoreCard } from '@/components/store-card'

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams.q ?? '').trim()
  const needle = q.toLowerCase()

  const brandName = (brandId: string) => BRANDS.find((b) => b.id === brandId)?.name ?? ''
  const brandCategory = (brandId: string) => BRANDS.find((b) => b.id === brandId)?.categoryLabel ?? ''

  const stores = q
    ? STORES.filter(
        (s) =>
          s.name.toLowerCase().includes(needle) ||
          s.region.toLowerCase().includes(needle) ||
          s.district.toLowerCase().includes(needle) ||
          brandName(s.brandId).toLowerCase().includes(needle) ||
          brandCategory(s.brandId).toLowerCase().includes(needle) ||
          s.highlights.some((h) => h.toLowerCase().includes(needle)) ||
          s.awards.some((a) => a.toLowerCase().includes(needle)),
      )
    : []

  const brands = q
    ? BRANDS.filter(
        (b) =>
          b.name.toLowerCase().includes(needle) ||
          b.category.toLowerCase().includes(needle) ||
          b.categoryLabel.toLowerCase().includes(needle),
      )
    : []

  const total = stores.length + brands.length

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
                placeholder="매장명, 브랜드, 지역 검색..."
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
                <p className="mt-3 text-sm text-gray-500">매장명·브랜드·지역으로 우수 매장을 검색하세요.</p>
              </CardContent>
            </Card>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">인기 검색어</p>
              <div className="flex flex-wrap gap-2">
                {['강남', '홍대', '카페', '치킨', '한식', '어워드'].map((keyword) => (
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

        {stores.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              매장 <span className="text-sm font-normal text-gray-400">({stores.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stores.slice(0, 9).map((s) => (
                <StoreCard key={s.id} store={s} />
              ))}
            </div>
            {stores.length > 9 && (
              <a href="/stores" className="mt-3 inline-flex text-sm text-[var(--brand-primary)] hover:underline">
                매장 {stores.length}개 전체보기 →
              </a>
            )}
          </section>
        )}

        {brands.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              브랜드 <span className="text-sm font-normal text-gray-400">({brands.length})</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {brands.map((b) => (
                <a
                  key={b.id}
                  href={`/stores?brand=${b.id}`}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 hover:border-gray-300 hover:shadow-sm transition-shadow"
                >
                  <div
                    className="h-5 w-5 rounded-full"
                    style={{ backgroundColor: b.logoColor }}
                  />
                  <span className="text-sm font-medium text-gray-900">{b.name}</span>
                  <span className="text-xs text-gray-400">{b.categoryLabel}</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
