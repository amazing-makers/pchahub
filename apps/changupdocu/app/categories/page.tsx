import type { Metadata } from 'next'
import { ArrowRight, BookOpen, Eye, MapPin, PlayCircle, Star, Store } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import { CATEGORY_COLOR, CATEGORY_LABEL, EPISODES, type EpisodeCategory } from '@/lib/mock-data'

const VALID_CATEGORIES: EpisodeCategory[] = ['success', 'failure', 'brand', 'trend', 'interview']

const CATEGORY_EMOJI: Record<EpisodeCategory, string> = {
  success:   '📈',
  failure:   '📉',
  brand:     '🏢',
  trend:     '🔥',
  interview: '🎙️',
}

const CATEGORY_DESC: Record<EpisodeCategory, string> = {
  success:   '실제 매출 성장의 변곡점을 따라가는 다큐. 어떤 결정이 매출을 바꿨나.',
  failure:   '실패의 원인을 데이터로 풀어내는 분석. 같은 실수를 반복하지 않도록.',
  brand:     '본사가 직접 풀어주는 성장 비결. 브랜드 탄생부터 확장 전략까지.',
  trend:     '지금 자영업·가맹 시장에서 무슨 일이 벌어지고 있나. 숫자로 본 트렌드.',
  interview: '현직 점주·창업자·전문가의 현장 이야기. 이론이 아닌 경험.',
}

export const metadata: Metadata = buildPageMetadata('changupdocu', {
  title: '카테고리',
  description: '창업다큐 카테고리 — 성공·실패·브랜드·트렌드·인터뷰별 에피소드.',
  path: '/categories',
})

export default function CategoriesPage() {
  const summaries = VALID_CATEGORIES.map((cat) => {
    const catEpisodes = EPISODES.filter((e) => e.category === cat)
    const totalViews = catEpisodes.reduce((s, e) => s + e.views, 0)
    // 가장 조회수 높은 에피소드
    const topEpisode = [...catEpisodes].sort((a, b) => b.views - a.views)[0]
    return {
      key: cat,
      label: CATEGORY_LABEL[cat],
      color: CATEGORY_COLOR[cat],
      count: catEpisodes.length,
      totalViews,
      topEpisode,
    }
  })

  const listJsonLd = buildItemListJsonLd({
    url: 'https://changupdocu.amakers.co.kr/categories',
    items: summaries.map((s) => ({ name: s.label, url: `https://changupdocu.amakers.co.kr/categories/${s.key}` })),
  })

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '창업다큐', url: 'https://changupdocu.amakers.co.kr' },
      { name: '카테고리', url: 'https://changupdocu.amakers.co.kr/categories' },
    ],
  })

  const totalViews = summaries.reduce((s, c) => s + c.totalViews, 0)
  const topCategory = [...summaries].sort((a, b) => b.totalViews - a.totalViews)[0]

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">카테고리</h1>
          <p className="mt-1 text-sm text-gray-500">
            창업다큐 에피소드를 주제별로 모아보세요. 총 {formatNumber(EPISODES.length)}편.
          </p>
        </div>
      </section>

      {/* 통계 스트립 */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          {[
            { value: `${VALID_CATEGORIES.length}개`, label: '카테고리' },
            { value: `${formatNumber(EPISODES.length)}편`, label: '전체 에피소드' },
            { value: formatNumber(totalViews), label: '누적 조회' },
            { value: topCategory?.label ?? '-', label: '인기 카테고리' },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-4">
              <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
              <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((s) => (
            <a key={s.key} href={`/categories/${s.key}`} className="group block h-full">
              <Card className="h-full overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
                {/* Color bar */}
                <div
                  className="h-1.5"
                  style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}88)` }}
                />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl"
                        style={{ background: `${s.color}18` }}
                        aria-hidden
                      >
                        {CATEGORY_EMOJI[s.key as EpisodeCategory]}
                      </span>
                      <div>
                        <h2 className="text-base font-bold text-gray-900 group-hover:text-gray-700">
                          {s.label}
                        </h2>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-0.5">
                            <PlayCircle className="h-3 w-3" />
                            {formatNumber(s.count)}편
                          </span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-0.5">
                            <Eye className="h-3 w-3" />
                            {formatNumber(s.totalViews)}회
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {CATEGORY_DESC[s.key as EpisodeCategory]}
                  </p>

                  {s.topEpisode && (
                    <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        인기 에피소드
                      </div>
                      <div className="mt-1 line-clamp-1 text-xs font-medium text-gray-800">
                        {s.topEpisode.title}
                      </div>
                      <div className="mt-0.5 text-[10px] text-gray-400">
                        {formatNumber(s.topEpisode.views)}회 · {s.topEpisode.duration}
                      </div>
                    </div>
                  )}

                  <div
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium transition-opacity group-hover:opacity-80"
                    style={{ color: s.color }}
                  >
                    전체 보기 <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* amakers 생태계 크로스링크 */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-6">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">amakers에서 더 알아보기</div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <a href="https://pchahub.amakers.co.kr/brands" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-indigo-500" />가맹 브랜드 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themyungdang.amakers.co.kr/listings" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-500" />창업 매물 찾기</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://bestplace.amakers.co.kr/stores" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" />우수 매장 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://jangsanote.amakers.co.kr" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-rose-500" />점주 커뮤니티</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">업종별 창업 인사이트를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">카테고리별 에피소드·현장 취재·시장 분석을 격주로 보내드립니다.</p>
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
