import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = {
  ...buildPageMetadata('themyungdang', {
    title: '매물 검색',
    description: '지역·업종·상권 키워드로 더명당 프랜차이즈 가맹 입점 매물을 검색하세요.',
    path: '/search',
  }),
  robots: { index: false, follow: false },
}

import { Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { LISTINGS, TYPE_LABEL, AREAS } from '@/lib/mock-data'
import { ListingCard } from '@/components/listing-card'

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams.q ?? '').trim()
  const needle = q.toLowerCase()

  const listings = q
    ? LISTINGS.filter(
        (l) =>
          l.title.toLowerCase().includes(needle) ||
          l.region.toLowerCase().includes(needle) ||
          l.district.toLowerCase().includes(needle) ||
          l.fullAddress.toLowerCase().includes(needle) ||
          (l.currentBusiness ?? '').toLowerCase().includes(needle) ||
          l.tags.some((t) => t.toLowerCase().includes(needle)) ||
          l.fitCategories.some((c) => c.toLowerCase().includes(needle)) ||
          AREAS.find((a) => a.key === l.areaKey)?.name.toLowerCase().includes(needle),
      )
    : []

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">매물 검색</h1>
          <form method="get" action="/search" className="mt-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="지역, 업종, 상권 검색..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-gray-400 focus:outline-none"
                autoFocus={!q}
              />
            </div>
          </form>
          {q && (
            <p className="mt-3 text-sm text-gray-500">
              <span className="font-medium text-gray-900">'{q}'</span> 검색 결과 · {listings.length}건
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-6">
        {!q && (
          <>
            <Card>
              <CardContent className="py-16 text-center">
                <Search className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">지역·업종·상권 키워드로 매물을 검색하세요.</p>
              </CardContent>
            </Card>

            {/* Quick links */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">인기 검색어</p>
              <div className="flex flex-wrap gap-2">
                {['강남', '홍대', '이태원', '카페', '치킨', '양도', '신규개업'].map((keyword) => (
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

        {q && listings.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                '<span className="font-medium">{q}</span>'에 대한 매물이 없습니다.
              </p>
              <p className="mt-1 text-xs text-gray-400">지역명·업종명으로 다시 검색해보세요.</p>
              <a
                href="/listings"
                className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                전체 매물 보기
              </a>
            </CardContent>
          </Card>
        )}

        {listings.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-h4 font-semibold text-gray-900">
                검색 결과 <span className="text-sm font-normal text-gray-400">({listings.length}건)</span>
              </h2>
              <a href="/listings" className="text-sm text-gray-500 hover:text-gray-700">
                전체 매물 →
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.slice(0, 12).map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
            {listings.length > 12 && (
              <p className="mt-4 text-center text-sm text-gray-500">
                {listings.length - 12}개 더 있습니다.{' '}
                <a href="/listings" className="font-medium text-gray-900 hover:underline">전체 보기 →</a>
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
