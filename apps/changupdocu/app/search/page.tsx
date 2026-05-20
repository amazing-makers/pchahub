import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = {
  ...buildPageMetadata('changupdocu', {
    title: '검색',
    description: '에피소드·매거진 키워드로 창업다큐 콘텐츠를 검색하세요.',
    path: '/search',
  }),
  robots: { index: false, follow: false },
}

import { Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { EPISODES, ARTICLES, CATEGORY_LABEL } from '@/lib/mock-data'
import { EpisodeCard } from '@/components/episode-card'
import { ArticleCard } from '@/components/article-card'

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams.q ?? '').trim()
  const needle = q.toLowerCase()

  const episodes = q
    ? EPISODES.filter(
        (e) =>
          e.title.toLowerCase().includes(needle) ||
          e.hook.toLowerCase().includes(needle) ||
          e.tags.some((t) => t.toLowerCase().includes(needle)) ||
          (e.brand ?? '').toLowerCase().includes(needle),
      )
    : []

  const articles = q
    ? ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(needle) ||
          a.excerpt.toLowerCase().includes(needle) ||
          a.authorName.toLowerCase().includes(needle) ||
          a.tags.some((t) => t.toLowerCase().includes(needle)) ||
          a.category.toLowerCase().includes(needle),
      )
    : []

  const total = episodes.length + articles.length

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
                placeholder="에피소드, 매거진 검색..."
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
              <CardContent className="py-12 text-center">
                <Search className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">에피소드나 매거진 키워드를 검색하세요.</p>
              </CardContent>
            </Card>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">인기 검색어</p>
              <div className="flex flex-wrap gap-2">
                {['치킨', '카페', '분식', '실패 사례', '성공 비결', '가맹비', '브랜드 스토리'].map((keyword) => (
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

        {episodes.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              에피소드 <span className="text-sm font-normal text-gray-400">({episodes.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {episodes.slice(0, 9).map((e) => (
                <EpisodeCard key={e.id} episode={e} />
              ))}
            </div>
            {episodes.length > 9 && (
              <a
                href={`/episodes?q=${encodeURIComponent(q)}`}
                className="mt-3 inline-flex text-sm text-[var(--brand-primary)] hover:underline"
              >
                에피소드 {episodes.length}개 전체보기 →
              </a>
            )}
          </section>
        )}

        {articles.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              매거진 <span className="text-sm font-normal text-gray-400">({articles.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {articles.slice(0, 6).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
            {articles.length > 6 && (
              <a
                href={`/magazine?q=${encodeURIComponent(q)}`}
                className="mt-3 inline-flex text-sm text-[var(--brand-primary)] hover:underline"
              >
                매거진 {articles.length}개 전체보기 →
              </a>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
