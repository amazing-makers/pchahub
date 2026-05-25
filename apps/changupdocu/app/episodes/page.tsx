import type { Metadata } from 'next'
import { ArrowRight, BookOpen, MapPin, MessageSquare, PlayCircle, Search, Store } from 'lucide-react'
import { Card, CardContent, NewsletterForm } from '@amakers/ui'
import { EpisodeCardWithSave } from '@/components/episode-card-with-save'
import { CATEGORY_LABEL, EPISODES, type EpisodeCategory } from '@/lib/mock-data'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'

export const metadata: Metadata = buildPageMetadata('changupdocu', {
  title: '에피소드',
  description: '성공·실패·브랜드·트렌드·인터뷰. 자영업·가맹의 실제 데이터와 이야기를 영상으로 만나보세요.',
  path: '/episodes',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '창업다큐', url: 'https://changupdocu.amakers.co.kr' },
    { name: '에피소드', url: 'https://changupdocu.amakers.co.kr/episodes' },
  ],
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
    url: 'https://changupdocu.amakers.co.kr/episodes',
    items: results.slice(0, 20).map((e) => ({ name: e.title, url: `https://changupdocu.amakers.co.kr/episodes/${e.id}` })),
  })

  const totalViews = EPISODES.reduce((s, e) => s + e.views, 0)
  const totalLikes = EPISODES.reduce((s, e) => s + e.likes, 0)
  const brandCount = new Set(EPISODES.map((e) => e.brand).filter(Boolean)).size
  const categoryCount = Object.keys(CATEGORY_LABEL).length

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
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
                aria-label="제목, 브랜드, 태그 검색…"
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
            {categories.map((c) => {
              const isActive = (c === '' && !category) || category === c
              return (
                <a
                  key={c || 'all'}
                  href={c ? `/episodes?category=${c}${q ? `&q=${encodeURIComponent(q)}` : ''}` : `/episodes${q ? `?q=${encodeURIComponent(q)}` : ''}`}
                  className={'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' + (isActive ? 'text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')}
                  style={isActive ? { background: 'var(--brand-primary)' } : undefined}
                >
                  {c === '' ? '전체' : CATEGORY_LABEL[c]}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* 통계 스트립 */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-4">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{EPISODES.length}편</span>
              <span className="text-[11px] font-semibold text-gray-700">전체 에피소드</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{formatNumber(totalViews)}</span>
              <span className="text-[11px] font-semibold text-gray-700">누적 조회수</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{brandCount}개</span>
              <span className="text-[11px] font-semibold text-gray-700">취재 브랜드</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{categoryCount}개</span>
              <span className="text-[11px] font-semibold text-gray-700">콘텐츠 카테고리</span>
            </div>
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
            {SORT_OPTIONS.map((s) => {
              const isActive = sort === s.key
              return (
                <a
                  key={s.key}
                  href={makeHref(searchParams, s.key)}
                  className={'rounded-md px-2 py-1 transition-colors ' + (isActive ? 'text-white' : 'text-gray-600 hover:bg-gray-100')}
                  style={isActive ? { background: 'var(--brand-primary)' } : undefined}
                >
                  {s.label}
                </a>
              )
            })}
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

      {/* amakers 생태계 크로스링크 */}
      <section className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-8">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">amakers에서 더 알아보기</div>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <a href="https://pchahub.amakers.co.kr/brands" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-indigo-500" />가맹 브랜드 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themanual.amakers.co.kr/courses" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-amber-500" />창업 운영 강의</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themyungdang.amakers.co.kr/listings" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-rose-500" />창업 매물 찾기</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://jangsanote.amakers.co.kr" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5 text-emerald-500" />점주 커뮤니티</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">창업다큐 에피소드를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 에피소드·브랜드 밀착 취재·점주 인터뷰를 격주로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
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
