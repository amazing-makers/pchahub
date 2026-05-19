import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Search } from 'lucide-react'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { EpisodeCard } from '@/components/episode-card'
import {
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  episodesByCategory,
  type EpisodeCategory,
} from '@/lib/mock-data'

const VALID_CATEGORIES: EpisodeCategory[] = ['success', 'failure', 'brand', 'trend', 'interview']

export function generateStaticParams() {
  return VALID_CATEGORIES.map((type) => ({ type }))
}

interface CategoryPageProps {
  params: { type: string }
  searchParams: { q?: string }
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const cat = params.type as EpisodeCategory
  if (!VALID_CATEGORIES.includes(cat)) return {}
  const count = episodesByCategory(cat).length
  return buildPageMetadata('changupdocu', {
    title: `${CATEGORY_LABEL[cat]} — 창업다큐`,
    description: `창업다큐 ${CATEGORY_LABEL[cat]} 카테고리. 총 ${count}편의 에피소드를 확인하세요.`,
    path: `/categories/${cat}`,
  })
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const cat = params.type as EpisodeCategory
  if (!VALID_CATEGORIES.includes(cat)) notFound()
  const { q } = searchParams
  const needle = q?.toLowerCase().trim() ?? ''
  const allEpisodes = episodesByCategory(cat)
  const episodes = needle
    ? allEpisodes.filter(
        (e) =>
          e.title.toLowerCase().includes(needle) ||
          e.hook.toLowerCase().includes(needle) ||
          (e.brand ?? '').toLowerCase().includes(needle) ||
          e.tags.some((t) => t.toLowerCase().includes(needle)),
      )
    : allEpisodes

  const catUrl = `https://changupdocu.kr/categories/${cat}`
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '에피소드', url: 'https://changupdocu.kr/episodes' },
      { name: CATEGORY_LABEL[cat], url: catUrl },
    ],
  })
  const listJsonLd = buildItemListJsonLd({
    url: catUrl,
    items: episodes.slice(0, 20).map((e) => ({ name: e.title, url: `https://changupdocu.kr/episodes/${e.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={listJsonLd} />
      <section
        className="text-white"
        style={{
          background: `linear-gradient(135deg, ${CATEGORY_COLOR[cat]}, ${CATEGORY_COLOR[cat]}AA)`,
        }}
      >
        <div className="container mx-auto py-section">
          <p className="text-sm font-semibold uppercase tracking-wider opacity-80">
            카테고리
          </p>
          <h1 className="mt-3 text-h1 font-bold">{CATEGORY_LABEL[cat]}</h1>
          <p className="mt-3 max-w-2xl text-base opacity-90">
            {cat === 'success' && '실제 매출 성장의 변곡점을 다큐로 추적합니다.'}
            {cat === 'failure' && '실패의 원인을 데이터와 인터뷰로 분석합니다.'}
            {cat === 'brand' && '본사가 직접 풀어주는 성장 비결을 다큐로 기록합니다.'}
            {cat === 'trend' && '시장의 변화를 데이터로 추적합니다.'}
            {cat === 'interview' && '점주들의 일상과 솔직한 후기를 인터뷰로 듣습니다.'}
          </p>
          <form
            method="GET"
            action={`/categories/${cat}`}
            className="mt-6 flex max-w-md gap-2"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="이 카테고리에서 검색…"
                className="w-full rounded-lg border border-white/30 bg-white/10 py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/60 focus:border-white/60 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
            >
              검색
            </button>
            {q && (
              <a
                href={`/categories/${cat}`}
                className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
              >
                초기화
              </a>
            )}
          </form>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="mb-4 text-sm text-gray-700">
          {q ? (
            <>
              <span className="font-medium text-gray-900">&ldquo;{q}&rdquo;</span> 검색 결과{' '}
              {episodes.length}편
            </>
          ) : (
            <>{episodes.length}편</>
          )}
        </div>
        {episodes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-sm font-medium text-gray-500">
              &ldquo;{q}&rdquo; 검색 결과가 없습니다.
            </p>
            <a
              href={`/categories/${cat}`}
              className="mt-4 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              전체 보기
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {episodes.map((e) => (
              <EpisodeCard key={e.id} episode={e} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
