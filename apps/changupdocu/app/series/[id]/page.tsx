import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ArrowLeft, Clock, PlayCircle, Tag } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { episodeById, CATEGORY_COLOR, CATEGORY_LABEL } from '@/lib/mock-data'
import { seriesById } from '@/lib/mock-series'
import { EpisodeCardWithSave } from '@/components/episode-card-with-save'

interface Props { params: { id: string } }

export function generateMetadata({ params }: Props): Metadata {
  const s = seriesById(params.id)
  if (!s) return {}
  return buildPageMetadata('changupdocu', {
    title: `${s.title} — 시리즈`,
    description: s.description,
    path: `/series/${s.id}`,
  })
}

export default function SeriesDetailPage({ params }: Props) {
  const series = seriesById(params.id)
  if (!series) notFound()

  const episodes = series.episodeRefs
    .sort((a, b) => a.order - b.order)
    .map((ref) => ({ ref, ep: episodeById(ref.episodeId) }))
    .filter((item): item is { ref: typeof item.ref; ep: NonNullable<typeof item.ep> } => Boolean(item.ep))

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '창업다큐', url: 'https://changupdocu.amakers.co.kr' },
      { name: '시리즈', url: 'https://changupdocu.amakers.co.kr/series' },
      { name: series.title, url: `https://changupdocu.amakers.co.kr/series/${series.id}` },
    ],
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />

      {/* Hero */}
      <section
        className="border-b border-gray-100"
        style={{
          background: `linear-gradient(135deg, ${series.thumbnailColors[0]}18, ${series.thumbnailColors[1]}08)`,
        }}
      >
        <div className="container mx-auto py-section">
          <a
            href="/series"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> 시리즈 목록
          </a>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: CATEGORY_COLOR[series.category] }}
            >
              {CATEGORY_LABEL[series.category]}
            </span>
            <span className="text-xs text-gray-500">
              {episodes.length}편 · 총 {series.totalDuration}
            </span>
          </div>

          <h1 className="mt-3 text-h2 font-bold text-gray-900">{series.title}</h1>
          <p className="mt-2 text-base text-gray-600">{series.subtitle}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">{series.description}</p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {series.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs text-gray-600"
              >
                <Tag className="h-2.5 w-2.5" />#{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Episodes */}
      <section className="container mx-auto py-section">
        <h2 className="mb-6 flex items-center gap-2 text-h3 font-semibold text-gray-900">
          <PlayCircle className="h-5 w-5" style={{ color: series.thumbnailColors[0] }} />
          시리즈 에피소드
        </h2>

        <div className="space-y-4">
          {episodes.map(({ ref, ep }) => (
            <div key={ep.id} className="flex items-start gap-4">
              {/* Order number */}
              <div
                className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                style={{ background: series.thumbnailColors[0] }}
              >
                {ref.order}
              </div>
              <div className="min-w-0 flex-1">
                <EpisodeCardWithSave episode={ep} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Other series */}
      <section className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">다른 시리즈도 둘러보세요</p>
            <a
              href="/series"
              className="text-xs font-medium hover:opacity-80"
              style={{ color: 'var(--brand-primary)' }}
            >
              전체 시리즈 →
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
