import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = {
  ...buildPageMetadata('pchahub', {
    title: '브랜드 검색',
    description: '브랜드명·업종·카테고리로 프차허브의 전체 프랜차이즈 브랜드를 검색하세요.',
    path: '/search',
  }),
  robots: { index: false, follow: false },
}

import { Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { getBrands } from '@/lib/kftc/source'
import { DISCUSSIONS } from '@/lib/mock-community'
import { BrandCard } from '@/components/brand-card'

interface SearchPageProps {
  searchParams: { q?: string }
}

export const revalidate = 3600

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams.q ?? '').trim()
  const needle = q.toLowerCase()

  const allBrands = await getBrands()

  const brands = q
    ? allBrands.filter(
        (b) =>
          b.name.toLowerCase().includes(needle) ||
          b.categoryLabel.toLowerCase().includes(needle) ||
          b.description.toLowerCase().includes(needle) ||
          b.category.toLowerCase().includes(needle),
      )
    : []

  const discussions = q
    ? DISCUSSIONS.filter(
        (d) =>
          d.title.toLowerCase().includes(needle) ||
          d.excerpt.toLowerCase().includes(needle) ||
          d.categoryLabel.toLowerCase().includes(needle),
      )
    : []

  const total = brands.length + discussions.length

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">브랜드 검색</h1>
          <form method="get" action="/search" className="mt-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="브랜드명, 업종 검색..."
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
                <p className="mt-3 text-sm text-gray-500">
                  브랜드명이나 업종을 검색하세요.{' '}
                  <span className="text-gray-400">총 {allBrands.length.toLocaleString()}개 브랜드</span>
                </p>
              </CardContent>
            </Card>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">인기 검색어</p>
              <div className="flex flex-wrap gap-2">
                {['카페', '치킨', '한식', '디저트', '저자본', '강남'].map((keyword) => (
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
              <a
                href="/brands"
                className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                전체 브랜드 보기
              </a>
            </CardContent>
          </Card>
        )}

        {brands.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-h4 font-semibold text-gray-900">
                브랜드 <span className="text-sm font-normal text-gray-400">({brands.length})</span>
              </h2>
              {brands.length > 9 && (
                <a
                  href={`/brands?q=${encodeURIComponent(q)}`}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  전체보기 →
                </a>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {brands.slice(0, 9).map((b) => (
                <BrandCard key={b.id} brand={b} />
              ))}
            </div>
            {brands.length > 9 && (
              <a
                href={`/brands?q=${encodeURIComponent(q)}`}
                className="mt-3 inline-flex text-sm text-[var(--brand-primary)] hover:underline"
              >
                브랜드 {brands.length}개 전체보기 →
              </a>
            )}
          </section>
        )}

        {discussions.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              커뮤니티 <span className="text-sm font-normal text-gray-400">({discussions.length})</span>
            </h2>
            <div className="space-y-3">
              {discussions.map((d) => (
                <a
                  key={d.id}
                  href="/community"
                  className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-900 line-clamp-1">{d.title}</div>
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{d.excerpt}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                      {d.categoryLabel}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">{d.author}</div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
