import type { Metadata } from 'next'
import { ArrowRight, BookOpen, MapPin, MessageSquare, Search, Store } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { ArticleCard } from '@/components/article-card'
import { ARTICLES } from '@/lib/mock-data'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'

export const metadata: Metadata = buildPageMetadata('changupdocu', {
  title: '매거진',
  description: '현장에서 길어 올린 분석과 인사이트. 회계사·변호사·컨설턴트·점주가 함께 쓰는 글.',
  path: '/magazine',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '창업다큐', url: 'https://changupdocu.amakers.co.kr' },
    { name: '매거진', url: 'https://changupdocu.amakers.co.kr/magazine' },
  ],
})

const SORT_OPTIONS = [
  { key: 'recent', label: '최신 순' },
  { key: 'featured', label: '추천 순' },
  { key: 'read-short', label: '읽기 짧은 순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

interface MagazinePageProps {
  searchParams: { category?: string; q?: string; sort?: string }
}

export default function MagazinePage({ searchParams }: MagazinePageProps) {
  const { category, q, sort = 'recent' } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'recent') as SortKey
  const needle = q?.toLowerCase().trim() ?? ''

  // 고유 카테고리 목록 추출
  const categories = Array.from(new Set(ARTICLES.map((a) => a.category))).sort()

  let filtered = category ? ARTICLES.filter((a) => a.category === category) : [...ARTICLES]
  if (needle) {
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(needle) ||
        a.authorName.toLowerCase().includes(needle) ||
        a.tags.some((t) => t.toLowerCase().includes(needle)) ||
        a.category.toLowerCase().includes(needle),
    )
  }
  filtered = [...filtered].sort((a, b) => {
    switch (activeSort) {
      case 'featured': return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case 'read-short': return a.readTime - b.readTime
      default: return b.publishedAt.localeCompare(a.publishedAt)
    }
  })
  const featured = activeSort === 'recent' ? filtered.filter((a) => a.featured) : []
  const rest = activeSort === 'recent' ? filtered.filter((a) => !a.featured) : filtered
  const totalReadTime = ARTICLES.reduce((s, a) => s + a.readTime, 0)
  const authorCount = new Set(ARTICLES.map((a) => a.authorName)).size
  const categoryCount = new Set(ARTICLES.map((a) => a.category)).size

  const listJsonLd = buildItemListJsonLd({
    url: 'https://changupdocu.amakers.co.kr/magazine',
    items: filtered.slice(0, 20).map((a) => ({ name: a.title, url: `https://changupdocu.amakers.co.kr/magazine/${a.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">
            {category ? `${category} 매거진` : '매거진'}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            현장에서 길어 올린 분석과 인사이트. 회계사·변호사·컨설턴트·점주가 함께 쓰는 글.
          </p>

          {/* Search bar */}
          <form method="GET" action="/magazine" className="mt-5 flex max-w-md gap-2">
            {category && <input type="hidden" name="category" value={category} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="제목, 저자, 태그 검색…"
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
                href={category ? `/magazine?category=${encodeURIComponent(category)}` : '/magazine'}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>

          {/* 카테고리 필터 칩 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`/magazine?${new URLSearchParams({ ...(activeSort !== 'recent' ? { sort: activeSort } : {}), ...(q ? { q } : {}) }).toString()}` || '/magazine'}
              className={
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                (!category
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
              }
            >
              전체 ({ARTICLES.length})
            </a>
            {categories.map((c) => {
              const count = ARTICLES.filter((a) => a.category === c).length
              return (
                <a
                  key={c}
                  href={`/magazine?${new URLSearchParams({ category: c, ...(activeSort !== 'recent' ? { sort: activeSort } : {}), ...(q ? { q } : {}) }).toString()}`}
                  className={
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                    (category === c
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }
                >
                  {c} ({count})
                </a>
              )
            })}
          </div>
          {/* 정렬 칩 */}
          <div className="mt-2 flex flex-wrap gap-2">
            {SORT_OPTIONS.map((o) => (
              <a
                key={o.key}
                href={`/magazine?${new URLSearchParams({ ...(category ? { category } : {}), sort: o.key, ...(q ? { q } : {}) }).toString()}`}
                className={
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors ' +
                  (activeSort === o.key
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300')
                }
              >
                {o.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 통계 스트립 */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-4">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{ARTICLES.length}편</span>
              <span className="text-[11px] font-semibold text-gray-700">전체 아티클</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{authorCount}명</span>
              <span className="text-[11px] font-semibold text-gray-700">기고 저자</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{categoryCount}개</span>
              <span className="text-[11px] font-semibold text-gray-700">카테고리</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{formatNumber(totalReadTime)}분</span>
              <span className="text-[11px] font-semibold text-gray-700">총 읽기 시간</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto space-y-8 py-8">
        {featured.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">추천</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {featured.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-h4 font-semibold text-gray-900">
              {q ? (
                <>
                  <span className="text-gray-500 font-normal">&ldquo;{q}&rdquo;</span> 검색 결과
                </>
              ) : category ? (
                category
              ) : (
                '전체 매거진'
              )}
            </h2>
            <span className="text-sm text-gray-500">{rest.length}편</span>
          </div>
          {rest.length === 0 && featured.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
              <p className="text-sm font-medium text-gray-500">
                {q ? `"${q}" 검색 결과가 없습니다` : '해당 카테고리의 글이 없습니다'}
              </p>
              <a
                href="/magazine"
                className="mt-4 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                전체 보기
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rest.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </section>
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
                <a href="https://themanual.amakers.co.kr/knowhow" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-amber-500" />운영 노하우</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themyungdang.amakers.co.kr/areas" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-rose-500" />상권 분석</span>
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">창업 인사이트를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">회계사·변호사·컨설턴트·현직 점주가 쓴 창업 분석과 현장 노하우를 격주로 보내드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
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
