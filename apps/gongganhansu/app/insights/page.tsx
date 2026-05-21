import type { Metadata } from 'next'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('gongganhansu', {
  title: '인사이트',
  description: 'F&B 매장 인테리어·시공 관련 인사이트와 트렌드.',
  path: '/insights',
})

import { Search } from 'lucide-react'
import { InsightCard } from '@/components/insight-card'
import { INSIGHTS } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'

const SORT_OPTIONS = [
  { key: 'recent', label: '최신 순' },
  { key: 'featured', label: '추천 순' },
  { key: 'read-short', label: '읽기 짧은 순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

interface InsightsPageProps {
  searchParams: { tag?: string; q?: string; sort?: string }
}

export default function InsightsPage({ searchParams }: InsightsPageProps) {
  const { tag, q, sort = 'recent' } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'recent') as SortKey
  const needle = q?.toLowerCase().trim() ?? ''
  let filtered = tag ? INSIGHTS.filter((i) => i.category === tag || i.tags?.includes(tag)) : [...INSIGHTS]
  if (needle) {
    filtered = filtered.filter(
      (i) =>
        i.title.toLowerCase().includes(needle) ||
        i.subtitle.toLowerCase().includes(needle) ||
        i.excerpt.toLowerCase().includes(needle) ||
        i.authorName.toLowerCase().includes(needle) ||
        i.tags.some((t) => t.toLowerCase().includes(needle)) ||
        i.category.toLowerCase().includes(needle),
    )
  }
  filtered = [...filtered].sort((a, b) => {
    switch (activeSort) {
      case 'featured': return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case 'read-short': return a.readTime - b.readTime
      default: return b.publishedAt.localeCompare(a.publishedAt)
    }
  })

  // Derive unique categories from INSIGHTS (preserving order of first appearance)
  const tags = Array.from(new Set(INSIGHTS.map((i) => i.category)))

  const listJsonLd = buildItemListJsonLd({
    url: 'https://gongganhansu.amakers.co.kr/insights',
    items: filtered.slice(0, 20).map((i) => ({ name: i.title, url: `https://gongganhansu.amakers.co.kr/insights/${i.id}` })),
  })

  const totalReadTime = INSIGHTS.reduce((s, i) => s + i.readTime, 0)
  const categoryCount = new Set(INSIGHTS.map((i) => i.category)).size

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">한 수 인사이트</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            시공 단가·디자인·시공 관리·본사 vs 직접 발주·트렌드. 매장 시공의 핵심 인사이트.
          </p>

          {/* Search bar */}
          <form method="GET" action="/insights" className="mt-5 flex max-w-md gap-2">
            {tag && <input type="hidden" name="tag" value={tag} />}
            {activeSort !== 'recent' && <input type="hidden" name="sort" value={activeSort} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="제목, 저자, 키워드 검색…"
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
                href={tag ? `/insights?tag=${encodeURIComponent(tag)}` : '/insights'}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>

          {/* 태그 필터 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`/insights?${new URLSearchParams({ ...(activeSort !== 'recent' ? { sort: activeSort } : {}), ...(q ? { q } : {}) }).toString()}` || '/insights'}
              className={
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                (!tag ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
              }
            >
              전체 ({INSIGHTS.length})
            </a>
            {tags.map((t) => {
              const count = INSIGHTS.filter((i) => i.category === t || i.tags?.includes(t)).length
              return (
                <a
                  key={t}
                  href={`/insights?${new URLSearchParams({ tag: t, ...(activeSort !== 'recent' ? { sort: activeSort } : {}), ...(q ? { q } : {}) }).toString()}`}
                  className={
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                    (tag === t ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }
                >
                  {t} ({count})
                </a>
              )
            })}
          </div>
          {/* 정렬 칩 */}
          <div className="mt-2 flex flex-wrap gap-2">
            {SORT_OPTIONS.map((o) => (
              <a
                key={o.key}
                href={`/insights?${new URLSearchParams({ ...(tag ? { tag } : {}), sort: o.key, ...(q ? { q } : {}) }).toString()}`}
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
              <span className="text-xl font-black tracking-tight text-gray-900">{INSIGHTS.length}편</span>
              <span className="text-[11px] font-semibold text-gray-700">전체 인사이트</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{categoryCount}개</span>
              <span className="text-[11px] font-semibold text-gray-700">카테고리</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{INSIGHTS.filter((i) => i.featured).length}편</span>
              <span className="text-[11px] font-semibold text-gray-700">추천 콘텐츠</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{formatNumber(totalReadTime)}분</span>
              <span className="text-[11px] font-semibold text-gray-700">총 읽기 시간</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {q && (
          <div className="mb-4 text-sm text-gray-700">
            <span className="font-medium text-gray-900">&ldquo;{q}&rdquo;</span> 검색 결과{' '}
            {filtered.length}건
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-sm font-medium text-gray-500">
              {q ? `"${q}" 검색 결과가 없습니다` : '해당 태그의 인사이트가 없습니다'}
            </p>
            <a
              href="/insights"
              className="mt-4 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              전체 보기
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((i) => (
              <InsightCard key={i.id} insight={i} />
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">시공 인사이트를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 인사이트·평당 단가 동향·시공 사례를 격주로 보내드립니다.</p>
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
