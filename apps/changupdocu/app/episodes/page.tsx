import type { Metadata } from 'next'
import { PlayCircle, Search } from 'lucide-react'
import { EpisodeCardWithSave } from '@/components/episode-card-with-save'
import { CATEGORY_LABEL, EPISODES, type EpisodeCategory } from '@/lib/mock-data'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('changupdocu', {
  title: '에피소드',
  description: '성공·실패·브랜드·트렌드·인터뷰. 자영업·가맹의 실제 데이터와 이야기를 영상으로 만나보세요.',
  path: '/episodes',
})

interface EpisodesPageProps {
  searchParams: { category?: string; sort?: string; q?: string }
}

export default function EpisodesPage({ searchParams }: EpisodesPageProps) {
  const { category, sort = 'recent', q } = searchParams
  const needle = q?.toLowerCase().trim() ?? ''

  let results = EPISODES.slice()
  if (category) results = results.filter((e) => e.category === category)
  if (needle) {
    results = results.filter(
      (e) =>
        e.title.toLowerCase().includes(needle) ||
        e.hook.toLowerCase().includes(needle) ||
        (e.brand ?? '').toLowerCase().includes(needle) ||
        e.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }
  results = [...results].sort((a, b) => {
    switch (sort) {
      case 'views':
        return b.views - a.views
      case 'likes':
        return b.likes - a.likes
      default:
        return b.publishedAt.localeCompare(a.publishedAt)
    }
  })

  const categories: Array<EpisodeCategory | ''> = ['', 'success', 'failure', 'brand', 'trend', 'interview']

  const listJsonLd = buildItemListJsonLd({
    url: 'https://changupdocu.kr/episodes',
    items: results.slice(0, 20).map((e) => ({ name: e.title, url: `https://changupdocu.kr/episodes/${e.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">
            {category ? `${CATEGORY_LABEL[category as EpisodeCategory]} 에피소드` : '전체 에피소드'}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            성공·실패·브랜드·트렌드·인터뷰. 자영업·가맹의 실제 데이터와 이야기.
          </p>

          {/* Search bar */}
          <form method="GET" action="/episodes" className="mt-5 flex max-w-md gap-2">
            {category && <input type="hidden" name="category" value={category} />}
            {sort !== 'recent' && <input type="hidden" name="sort" value={sort} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="제목, 브랜드, 태그 검색…"
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
                href={category ? `/episodes?category=${category}` : '/episodes'}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>

          {/* Category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <a
                key={c || 'all'}
                href={c ? `/episodes?category=${c}${q ? `&q=${encodeURIComponent(q)}` : ''}` : `/episodes${q ? `?q=${encodeURIComponent(q)}` : ''}`}
                className={
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                  ((c === '' && !category) || category === c
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                }
              >
                {c === '' ? '전체' : CATEGORY_LABEL[c]}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            {q ? (
              <>
                <span className="font-medium text-gray-900">&ldquo;{q}&rdquo;</span> 검색 결과{' '}
                {results.length}편
              </>
            ) : (
              <>{results.length}편</>
            )}
          </div>
          <div className="flex gap-2 text-sm">
            {SORT_OPTIONS.map((s) => (
              <a
                key={s.key}
                href={makeHref(searchParams, s.key)}
                className={
                  'rounded-md px-2 py-1 transition-colors ' +
                  (sort === s.key
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100')
                }
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <PlayCircle className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-500">검색 결과가 없습니다</p>
            <a
              href="/episodes"
              className="mt-4 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              전체 보기
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((e) => (
              <EpisodeCardWithSave key={e.id} episode={e} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

const SORT_OPTIONS = [
  { key: 'recent', label: '최신순' },
  { key: 'views', label: '조회 많은 순' },
  { key: 'likes', label: '좋아요 많은 순' },
]

function makeHref(current: EpisodesPageProps['searchParams'], sort: string) {
  const params = new URLSearchParams()
  if (current.category) params.set('category', current.category)
  if (sort !== 'recent') params.set('sort', sort)
  if (current.q) params.set('q', current.q)
  const qs = params.toString()
  return qs ? `/episodes?${qs}` : '/episodes'
}
