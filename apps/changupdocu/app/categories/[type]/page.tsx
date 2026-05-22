import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, MapPin, Search, Store } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
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

const SORT_OPTIONS = [
  { key: 'recent', label: '최신 순' },
  { key: 'views', label: '조회 많은 순' },
  { key: 'duration-short', label: '짧은 영상 순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

interface CategoryPageProps {
  params: { type: string }
  searchParams: { q?: string; sort?: string }
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

function parseDuration(duration: string): number {
  const parts = duration.split(':').map(Number)
  if (parts.length === 2) return (parts[0] ?? 0) * 60 + (parts[1] ?? 0)
  if (parts.length === 3) return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0)
  return 0
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const cat = params.type as EpisodeCategory
  if (!VALID_CATEGORIES.includes(cat)) notFound()
  const { q, sort = 'recent' } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'recent') as SortKey
  const needle = q?.toLowerCase().trim() ?? ''
  const allEpisodes = episodesByCategory(cat)
  const totalViews = allEpisodes.reduce((s, e) => s + (e.views ?? 0), 0)
  const avgViews = allEpisodes.length ? Math.round(totalViews / allEpisodes.length) : 0
  const mostRecent = [...allEpisodes].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0]
  let filtered = needle
    ? allEpisodes.filter(
        (e) =>
          e.title.toLowerCase().includes(needle) ||
          e.hook.toLowerCase().includes(needle) ||
          (e.brand ?? '').toLowerCase().includes(needle) ||
          e.tags.some((t) => t.toLowerCase().includes(needle)),
      )
    : [...allEpisodes]
  const episodes = [...filtered].sort((a, b) => {
    switch (activeSort) {
      case 'views': return (b.views ?? 0) - (a.views ?? 0)
      case 'duration-short': return parseDuration(a.duration) - parseDuration(b.duration)
      default: return b.publishedAt.localeCompare(a.publishedAt)
    }
  })

  const catUrl = `https://changupdocu.amakers.co.kr/categories/${cat}`
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '에피소드', url: 'https://changupdocu.amakers.co.kr/episodes' },
      { name: CATEGORY_LABEL[cat], url: catUrl },
    ],
  })
  const listJsonLd = buildItemListJsonLd({
    url: catUrl,
    items: episodes.slice(0, 20).map((e) => ({ name: e.title, url: `https://changupdocu.amakers.co.kr/episodes/${e.id}` })),
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
                aria-label="이 카테고리에서 검색…"
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
                href={activeSort !== 'recent' ? `/categories/${cat}?sort=${activeSort}` : `/categories/${cat}`}
                className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
              >
                초기화
              </a>
            )}
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {SORT_OPTIONS.map((o) => (
              <a
                key={o.key}
                href={`/categories/${cat}?sort=${o.key}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                className={
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors ' +
                  (activeSort === o.key
                    ? 'bg-white text-gray-900'
                    : 'border border-white/30 bg-white/10 text-white hover:bg-white/20')
                }
              >
                {o.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 카테고리 통계 스트립 */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-4">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{allEpisodes.length}편</span>
              <span className="text-[11px] font-semibold text-gray-700">총 에피소드</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{formatNumber(totalViews)}</span>
              <span className="text-[11px] font-semibold text-gray-700">누적 조회</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{formatNumber(avgViews)}</span>
              <span className="text-[11px] font-semibold text-gray-700">평균 조회</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{mostRecent?.publishedAt ?? '-'}</span>
              <span className="text-[11px] font-semibold text-gray-700">최신 업로드</span>
            </div>
          </div>
        </div>
      </section>

      {/* amakers 생태계 크로스링크 */}
      <div className="container mx-auto pt-0 pb-4">
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              amakers에서 더 알아보기
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <a
                href="https://pchahub.amakers.co.kr/brands"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5 text-indigo-500" />
                  가맹 브랜드 탐색
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href={`https://themanual.amakers.co.kr/courses`}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                  창업·운영 강의
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href="https://themyungdang.amakers.co.kr/listings"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  창업 매물 찾기
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

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

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">창업다큐 에피소드를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">이 카테고리의 신규 에피소드·현장 취재·인터뷰를 격주로 보내드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
                aria-label="이메일 주소"
                placeholder="이메일 주소"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                구독하기
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}
