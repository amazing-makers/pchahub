import { ArrowRight, Flame } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { platformColors, type PlatformKey } from '@amakers/design-system'
import { EpisodeCard } from '@/components/episode-card'
import { ArticleCard } from '@/components/article-card'
import {
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  FEATURED_EPISODES,
  FEATURED_ARTICLES,
  recentArticles,
  recentEpisodes,
  TRENDING_EPISODES,
  type EpisodeCategory,
} from '@/lib/mock-data'

const otherPlatforms = (
  Object.entries(platformColors) as Array<[PlatformKey, (typeof platformColors)[PlatformKey]]>
).filter(([key]) => key !== 'changupdocu')

const FEATURED_CATEGORIES: EpisodeCategory[] = ['success', 'failure', 'brand']

export default function HomePage() {
  const heroEpisode = FEATURED_EPISODES[0]
  const otherFeatured = FEATURED_EPISODES.slice(1)
  const recent = recentEpisodes(6)
  const recentMag = recentArticles(4)

  return (
    <main>
      {/* Hero — featured episode + sidebar */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            창업다큐 · changupdocu.kr
          </p>
          <h1 className="mt-4 text-h2 font-bold text-gray-900">
            자영업·가맹의 진짜 이야기
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            성공 다큐 · 실패 분석 · 브랜드 인사이드 · 점주 인터뷰까지.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            {heroEpisode && (
              <div>
                <EpisodeCard episode={heroEpisode} large />
              </div>
            )}
            <aside className="space-y-3">
              <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Flame className="h-4 w-4 text-orange-500" />
                트렌딩
              </h2>
              {TRENDING_EPISODES.slice(0, 4).map((e, i) => (
                <a
                  key={e.id}
                  href={`/episodes/${e.id}`}
                  className="flex items-start gap-3 rounded-lg p-2 hover:bg-white"
                >
                  <span className="w-5 shrink-0 text-sm font-bold text-gray-400">{i + 1}</span>
                  <div
                    className="h-14 w-20 shrink-0 rounded-md"
                    style={{
                      background: `linear-gradient(135deg, ${e.thumbnailColors[0]}, ${e.thumbnailColors[1] ?? e.thumbnailColors[0]})`,
                    }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-sm font-medium text-gray-900">{e.title}</div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {CATEGORY_LABEL[e.category]} · {e.duration}
                    </div>
                  </div>
                </a>
              ))}
            </aside>
          </div>
        </div>
      </section>

      {/* Other featured */}
      {otherFeatured.length > 0 && (
        <section className="container mx-auto pt-section">
          <h2 className="mb-6 text-h3 font-semibold text-gray-900">대표 에피소드</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {otherFeatured.map((e) => (
              <EpisodeCard key={e.id} episode={e} />
            ))}
          </div>
        </section>
      )}

      {/* Category quick access */}
      <section className="container mx-auto pt-section">
        <h2 className="mb-6 text-h3 font-semibold text-gray-900">카테고리별 보기</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FEATURED_CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`/categories/${cat}`}
              className="group rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div
                className="inline-flex h-10 items-center rounded-md px-3 text-sm font-semibold text-white"
                style={{ background: CATEGORY_COLOR[cat] }}
              >
                {CATEGORY_LABEL[cat]}
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {cat === 'success' && '실제 매출 성장의 변곡점을 따라가는 다큐'}
                {cat === 'failure' && '실패의 원인을 데이터로 풀어내는 분석'}
                {cat === 'brand' && '본사가 직접 풀어주는 성장 비결'}
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-sm text-gray-700 group-hover:text-gray-900">
                전체 보기 <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Recent episodes */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-h3 font-semibold text-gray-900">최근 에피소드</h2>
          <a
            href="/episodes"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 보기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((e) => (
            <EpisodeCard key={e.id} episode={e} />
          ))}
        </div>
      </section>

      {/* Magazine */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">매거진</h2>
            <p className="mt-1 text-sm text-gray-500">현장에서 길어 올린 분석과 인사이트</p>
          </div>
          <a
            href="/magazine"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 매거진 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recentMag.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* Other platforms */}
      <section className="container mx-auto py-section">
        <div className="mb-4">
          <h2 className="text-h4 font-semibold text-gray-900">amakers의 다른 플랫폼</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          {otherPlatforms.map(([key, p]) => (
            <a key={key} href={`https://${p.domain}`} className="group">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-7 w-7 shrink-0 rounded-md"
                      style={{ background: p.primary }}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-gray-900">
                        {p.name}
                      </div>
                      <div className="truncate text-xs text-gray-500">{p.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
