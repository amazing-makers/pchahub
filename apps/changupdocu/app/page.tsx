import type { Metadata } from 'next'
import { buildFaqPageJsonLd, buildOrganizationJsonLd, buildPageMetadata, buildWebSiteJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('changupdocu', {
  title: '창업다큐 — 자영업·가맹의 진짜 이야기',
  description: '남의 창업에서 내 답을 찾으세요. 실제 데이터와 현장 인터뷰로 풀어낸 성공 다큐·실패 분석·브랜드 인사이드·점주 인터뷰.',
  path: '/',
})

import { ArrowRight, Flame, Mic, PlayCircle, Search } from 'lucide-react'
import { Card, CardContent, NewsletterForm } from '@amakers/ui'
import { EpisodeCardWithSave } from '@/components/episode-card-with-save'
import { ArticleCard } from '@/components/article-card'
import { SeriesCard } from '@/components/series-card'
import { SavedEpisodesSection } from '@/components/saved-episodes-section'
import { SavedArticlesSection } from '@/components/saved-articles-section'
import { RecentlyViewedEpisodes } from '@/components/recently-viewed-episodes'
import { RecentlyViewedArticles } from '@/components/recently-viewed-articles'
import {
  ARTICLES,
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  EPISODES,
  FEATURED_ARTICLES,
  FEATURED_EPISODES,
  recentArticles,
  recentEpisodes,
  TRENDING_EPISODES,
  type EpisodeCategory,
} from '@/lib/mock-data'
import { FEATURED_SERIES } from '@/lib/mock-series'
import { formatNumber } from '@amakers/utils'

const FEATURED_CATEGORIES: EpisodeCategory[] = ['success', 'failure', 'brand']

const FAQS = [
  {
    q: '창업다큐의 콘텐츠는 어떻게 만들어지나요?',
    a: '실제 매장 데이터와 점주·전문가 현장 인터뷰를 바탕으로 제작합니다. 성공 다큐, 실패 분석, 브랜드 인사이드 등 카테고리별로 검증된 사실에 근거해 창업의 진짜 이야기를 다룹니다.',
  },
  {
    q: '에피소드는 무료로 볼 수 있나요?',
    a: '모든 에피소드와 매거진 콘텐츠는 무료로 열람할 수 있습니다. 회원가입 시 관심 콘텐츠 저장과 최근 본 에피소드 이어보기 등 편의 기능을 추가로 이용할 수 있습니다.',
  },
  {
    q: '새 에피소드는 얼마나 자주 올라오나요?',
    a: '신규 에피소드와 현장 분석 리포트가 매주 업데이트됩니다. 뉴스레터를 구독하면 새 콘텐츠 소식을 메일로 가장 먼저 받아볼 수 있습니다.',
  },
  {
    q: '제 창업 이야기나 매장을 제보하고 싶어요.',
    a: '점주 인터뷰와 사례 제보를 상시 받고 있습니다. 성공·실패 경험 모두 다른 창업자에게 소중한 인사이트가 되며, 제보된 사례는 취재·검증을 거쳐 콘텐츠로 제작됩니다.',
  },
]

export default function HomePage() {
  const heroEpisode = FEATURED_EPISODES[0]
  const otherFeatured = FEATURED_EPISODES.slice(1)
  const recent = recentEpisodes(6)
  const recentMag = recentArticles(4)

  const orgJsonLd = buildOrganizationJsonLd({
    name: '창업다큐',
    url: 'https://changupdocu.amakers.co.kr',
    description: '성공 다큐·실패 분석·브랜드 인사이드·점주 인터뷰. 실제 데이터와 현장 인터뷰로 풀어내는 프랜차이즈 창업 이야기.',
  })
  const siteJsonLd = buildWebSiteJsonLd({
    name: '창업다큐',
    url: 'https://changupdocu.amakers.co.kr',
    searchUrlTemplate: 'https://changupdocu.amakers.co.kr/search?q={search_term_string}',
  })
  const faqJsonLd = buildFaqPageJsonLd({
    url: 'https://changupdocu.amakers.co.kr',
    items: FAQS.map((f) => ({ question: f.q, answer: f.a })),
  })
  return (
    <main>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={siteJsonLd} />
      <JsonLd data={faqJsonLd} />
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
            성공도 실패도, 다 이유가 있습니다
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            실제 데이터와 현장 인터뷰로 풀어낸 성공 다큐·실패 분석·점주 인터뷰. 남의 경험에서 내 창업의 답을 찾으세요.
          </p>

          <form
            action="/search"
            method="get"
            className="mt-6 flex max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md focus-within:ring-2 focus-within:ring-[var(--brand-primary)]"
          >
            <Search className="m-3.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden />
            <input
              name="q"
              type="search"
              placeholder="에피소드·매거진 검색 (예: 치킨 실패 사례, 카페 창업)"
              className="flex-1 bg-transparent py-3 pr-2 text-sm text-gray-900 placeholder-gray-400 outline-none"
            />
            <button
              type="submit"
              className="m-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              검색
            </button>
          </form>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            {heroEpisode && (
              <div>
                <EpisodeCardWithSave episode={heroEpisode} large />
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

      {/* Stats strip */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {[
              { value: `${EPISODES.length}개`, label: '창업 에피소드' },
              { value: `${ARTICLES.length}개`, label: '매거진 아티클' },
              { value: `${Object.keys(CATEGORY_LABEL).length}개`, label: '카테고리' },
              { value: formatNumber(EPISODES.reduce((s, e) => s + e.views, 0)), label: '누적 조회' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-4">
                <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SavedEpisodesSection />
      <SavedArticlesSection />
      <RecentlyViewedEpisodes />
      <RecentlyViewedArticles />

      {/* Other featured */}
      {otherFeatured.length > 0 && (
        <section className="container mx-auto pt-section">
          <h2 className="mb-6 text-h3 font-semibold text-gray-900">대표 에피소드</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {otherFeatured.map((e) => (
              <EpisodeCardWithSave key={e.id} episode={e} />
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

      {/* 창업 여정 미리보기 */}
      <section className="border-y border-gray-100 bg-white">
        <div className="container mx-auto py-section">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-h3 font-semibold text-gray-900">창업 여정 미리보기</h2>
              <p className="mt-1 text-sm text-gray-500">
                준비기부터 성장기까지 — 프랜차이즈 창업 5단계 전체 로드맵
              </p>
            </div>
            <a
              href="/timeline"
              className="hidden items-center gap-1 text-sm text-gray-600 hover:text-gray-900 sm:inline-flex"
            >
              전체 타임라인 <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { order: 1, phase: '준비기', duration: '1-3개월', color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', desc: '시장조사·브랜드 선택·자금 계획' },
              { order: 2, phase: '계약기', duration: '2-4주', color: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', desc: '가맹계약 검토·임대차 계약' },
              { order: 3, phase: '구축기', duration: '1-3개월', color: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', desc: '인테리어·설비·인허가' },
              { order: 4, phase: '오픈기', duration: '2-4주', color: 'bg-pink-500', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', desc: '사전마케팅·직원교육·오픈이벤트' },
              { order: 5, phase: '성장기', duration: '지속', color: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', desc: '운영 최적화·재투자' },
            ].map((p) => (
              <a
                key={p.order}
                href="/timeline"
                className={`group flex items-center gap-3 rounded-xl border ${p.border} ${p.bg} px-4 py-3 transition-shadow hover:shadow-sm`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${p.color}`}
                >
                  {p.order}
                </span>
                <div>
                  <div className={`text-sm font-bold ${p.text}`}>
                    {p.phase}
                    <span className="ml-1.5 text-xs font-normal opacity-70">{p.duration}</span>
                  </div>
                  <div className="text-xs text-gray-500">{p.desc}</div>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-5 text-center sm:hidden">
            <a href="/timeline" className="text-sm text-gray-600 hover:text-gray-900">
              전체 타임라인 보러가기 →
            </a>
          </div>
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
            <EpisodeCardWithSave key={e.id} episode={e} />
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

      {/* 시리즈 */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
              <PlayCircle className="h-6 w-6 text-gray-400" />
              이어 보는 시리즈
            </h2>
            <p className="mt-1 text-sm text-gray-500">관련 에피소드를 주제별로 묶어 깊게</p>
          </div>
          <a
            href="/series"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 시리즈 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_SERIES.map((s) => (
            <SeriesCard key={s.id} series={s} />
          ))}
        </div>
      </section>

      {/* 제보 CTA */}
      <section className="container mx-auto pt-section">
        <Card className="overflow-hidden border-gray-200">
          <CardContent className="p-0">
            <div className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center"
              style={{ background: 'linear-gradient(135deg, var(--brand-primary)12, transparent)' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">당신의 이야기가 다음 다큐가 됩니다</h2>
                  <p className="mt-0.5 text-sm text-gray-500">
                    창업 성공·실패·브랜드 경험을 제보해 주세요. 취재 후 에피소드로 제작됩니다.
                  </p>
                </div>
              </div>
              <a
                href="/submit-story"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                style={{ background: 'var(--brand-primary)' }}
              >
                <Mic className="h-4 w-4" /> 사연 제보하기
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 자주 묻는 질문 */}
      <section className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-h3 font-bold text-gray-900">자주 묻는 질문</h2>
            <div className="mt-8 divide-y divide-gray-100 rounded-2xl border border-gray-100">
              {FAQS.map((f, i) => (
                <details key={i} className="group px-5 py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-gray-900 marker:content-['']">
                    {f.q}
                    <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">창업 현장 이야기를 가장 먼저 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">매주 새 에피소드와 현장 분석 리포트를 메일로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>

    </main>
  )
}
