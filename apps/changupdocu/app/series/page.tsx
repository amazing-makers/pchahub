import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ArrowRight, PlayCircle } from 'lucide-react'
import { SeriesCard } from '@/components/series-card'
import { SERIES } from '@/lib/mock-series'
import { CATEGORY_COLOR, CATEGORY_LABEL, type EpisodeCategory } from '@/lib/mock-data'

export const metadata: Metadata = buildPageMetadata('changupdocu', {
  title: '에피소드 시리즈 — 창업다큐',
  description: '관련 에피소드를 묶은 창업다큐 시리즈. 치킨 창업부터 권리금 분쟁까지, 주제별로 이어 보세요.',
  path: '/series',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '창업다큐', url: 'https://changupdocu.amakers.co.kr' },
    { name: '시리즈', url: 'https://changupdocu.amakers.co.kr/series' },
  ],
})

interface SearchParams { cat?: string }

export default function SeriesPage({ searchParams }: { searchParams: SearchParams }) {
  const catFilter = searchParams.cat as EpisodeCategory | undefined

  const categories = Array.from(new Set(SERIES.map((s) => s.category)))
  const filtered = catFilter ? SERIES.filter((s) => s.category === catFilter) : SERIES

  const totalEpisodes = SERIES.reduce((s, sr) => s + sr.episodeRefs.length, 0)

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* Header */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            Series · 에피소드 시리즈
          </p>
          <h1 className="mt-4 text-h2 font-bold text-gray-900">
            주제별로 이어 보는
            <br />
            창업다큐 시리즈
          </h1>
          <p className="mt-3 max-w-xl text-gray-600">
            단편 에피소드보다 더 깊게. 같은 주제의 에피소드를 시리즈로 묶어
            창업의 맥락을 처음부터 끝까지 따라갈 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-500">{SERIES.length}개 시리즈 · {totalEpisodes}개 에피소드</span>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-3">
          <div className="flex flex-wrap gap-2">
            <a
              href="/series"
              className={
                'rounded-full border px-3 py-1 text-xs font-semibold transition-colors ' +
                (!catFilter
                  ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300')
              }
            >
              전체
            </a>
            {categories.map((cat) => (
              <a
                key={cat}
                href={`/series?cat=${cat}`}
                className={
                  'rounded-full border px-3 py-1 text-xs font-semibold transition-colors ' +
                  (catFilter === cat
                    ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300')
                }
              >
                {CATEGORY_LABEL[cat as EpisodeCategory]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Series grid */}
      <section className="container mx-auto py-section">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((series) => (
            <SeriesCard key={series.id} series={series} large />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            <PlayCircle className="mx-auto h-10 w-10 opacity-30" />
            <p className="mt-4 text-sm">해당 카테고리의 시리즈가 없습니다.</p>
          </div>
        )}
      </section>

      {/* CTA — 에피소드 전체 보기 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">시리즈 외 단편 에피소드도 있어요</p>
              <h2 className="mt-1 text-h3 font-bold text-gray-900">전체 에피소드 둘러보기</h2>
            </div>
            <a
              href="/episodes"
              className="inline-flex items-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              에피소드 전체 <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
