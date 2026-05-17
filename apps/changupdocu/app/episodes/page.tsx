import type { Metadata } from 'next'
import { PlayCircle } from 'lucide-react'
import { EpisodeCardWithSave } from '@/components/episode-card-with-save'
import { CATEGORY_LABEL, EPISODES, type EpisodeCategory } from '@/lib/mock-data'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('changupdocu', {
  title: '에피소드',
  description: '성공·실패·브랜드·트렌드·인터뷰. 자영업·가맹의 실제 데이터와 이야기를 영상으로 만나보세요.',
  path: '/episodes',
})

interface EpisodesPageProps {
  searchParams: { category?: string; sort?: string }
}

export default function EpisodesPage({ searchParams }: EpisodesPageProps) {
  const { category, sort = 'recent' } = searchParams

  let results = EPISODES.slice()
  if (category) results = results.filter((e) => e.category === category)
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

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">
            {category ? `${CATEGORY_LABEL[category as EpisodeCategory]} 에피소드` : '전체 에피소드'}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            성공·실패·브랜드·트렌드·인터뷰. 자영업·가맹의 실제 데이터와 이야기.
          </p>

          {/* Category chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((c) => (
              <a
                key={c || 'all'}
                href={c ? `/episodes?category=${c}` : '/episodes'}
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
          <div className="text-sm text-gray-700">{results.length}편</div>
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
  const qs = params.toString()
  return qs ? `/episodes?${qs}` : '/episodes'
}
