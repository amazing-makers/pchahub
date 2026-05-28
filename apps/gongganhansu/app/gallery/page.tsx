import type { Metadata } from 'next'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('gongganhansu', {
  title: '시공 갤러리',
  description: 'F&B 매장 시공 포트폴리오. 업종·카테고리별로 둘러보세요.',
  path: '/gallery',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '공간한수', url: 'https://gongganhansu.amakers.co.kr' },
    { name: '시공 갤러리', url: 'https://gongganhansu.amakers.co.kr/gallery' },
  ],
})

import { Search } from 'lucide-react'
import { NewsletterForm } from '@amakers/ui'
import { PortfolioCardWithSave } from '@/components/portfolio-card-with-save'
import { CATEGORIES, PORTFOLIO } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'

const SORT_OPTIONS = [
  { key: 'featured', label: '추천 순' },
  { key: 'recent', label: '최신 순' },
  { key: 'budget-asc', label: '예산 적은 순' },
  { key: 'budget-desc', label: '예산 많은 순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

const SIZE_OPTIONS = [
  { key: 'all', label: '전체 평수' },
  { key: 'small', label: '소형 (~15평)', min: 0, max: 15 },
  { key: 'mid', label: '중형 (16~30평)', min: 16, max: 30 },
  { key: 'large', label: '대형 (31평+)', min: 31, max: Infinity },
] as const
type SizeKey = (typeof SIZE_OPTIONS)[number]['key']

interface GalleryPageProps {
  searchParams: { category?: string; q?: string; sort?: string; size?: string }
}

export default function GalleryPage({ searchParams }: GalleryPageProps) {
  const { category, q, sort = 'featured', size } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'featured') as SortKey
  const activeSize = (SIZE_OPTIONS.find((o) => o.key === size)?.key ?? 'all') as SizeKey
  const needle = q?.toLowerCase().trim() ?? ''
  let items = category ? PORTFOLIO.filter((p) => p.category === category) : PORTFOLIO
  if (activeSize !== 'all') {
    const sizeOpt = SIZE_OPTIONS.find((o) => o.key === activeSize)
    if (sizeOpt && 'min' in sizeOpt) {
      items = items.filter((p) => p.area >= sizeOpt.min && p.area <= sizeOpt.max)
    }
  }
  if (needle) {
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.excerpt.toLowerCase().includes(needle) ||
        p.region.toLowerCase().includes(needle) ||
        p.district.toLowerCase().includes(needle) ||
        p.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }
  items = [...items].sort((a, b) => {
    switch (activeSort) {
      case 'recent': return b.completedAt.localeCompare(a.completedAt)
      case 'budget-asc': return a.budget - b.budget
      case 'budget-desc': return b.budget - a.budget
      default: return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    }
  })

  const listJsonLd = buildItemListJsonLd({
    url: 'https://gongganhansu.amakers.co.kr/gallery',
    items: items.slice(0, 20).map((p) => ({ name: p.title, url: `https://gongganhansu.amakers.co.kr/gallery/${p.id}` })),
  })

  const featuredCount = PORTFOLIO.filter((p) => p.featured).length
  const categoryCount = new Set(PORTFOLIO.map((p) => p.category)).size
  const regionCount = new Set(PORTFOLIO.map((p) => p.region)).size

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">매장 갤러리</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            F&B 매장 시공 실제 사례. 카테고리·평수·예산·시공 일수까지 모두 공개.
          </p>

          {/* Search bar */}
          <form method="GET" action="/gallery" className="mt-5 flex max-w-md gap-2">
            {category && <input type="hidden" name="category" value={category} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                aria-label="매장명, 지역, 태그 검색…"
                placeholder="매장명, 지역, 태그 검색…"
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
                href={category ? `/gallery?category=${category}` : '/gallery'}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>

          {/* 업종 필터 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[{ key: '', label: `전체 (${PORTFOLIO.length})` }, ...CATEGORIES.map((c) => {
              const count = PORTFOLIO.filter((p) => p.category === c.key).length
              return { key: c.key, label: `${c.label} (${count})`, count }
            }).filter((c) => c.count > 0)].map((c) => {
              const isActive = c.key === '' ? !category : category === c.key
              const href = c.key === ''
                ? `/gallery?${new URLSearchParams({ ...(activeSort !== 'featured' ? { sort: activeSort } : {}), ...(activeSize !== 'all' ? { size: activeSize } : {}), ...(q ? { q } : {}) }).toString()}` || '/gallery'
                : `/gallery?${new URLSearchParams({ category: c.key, ...(activeSort !== 'featured' ? { sort: activeSort } : {}), ...(activeSize !== 'all' ? { size: activeSize } : {}), ...(q ? { q } : {}) }).toString()}`
              return (
                <a
                  key={c.key}
                  href={href}
                  className={'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' + (isActive ? 'text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')}
                  style={isActive ? { background: 'var(--brand-primary)' } : undefined}
                >
                  {c.label}
                </a>
              )
            })}
          </div>
          {/* 평수 필터 */}
          <div className="mt-2 flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((o) => {
              const isActive = activeSize === o.key
              const href = `/gallery?${new URLSearchParams({ ...(category ? { category } : {}), ...(o.key !== 'all' ? { size: o.key } : {}), ...(activeSort !== 'featured' ? { sort: activeSort } : {}), ...(q ? { q } : {}) }).toString()}` || '/gallery'
              return (
                <a
                  key={o.key}
                  href={href}
                  className={'rounded-full px-3 py-1 text-xs font-medium transition-colors ' + (isActive ? 'text-white' : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300')}
                  style={isActive ? { background: 'var(--brand-primary)' } : undefined}
                >
                  {o.label}
                </a>
              )
            })}
          </div>
          {/* 정렬 칩 */}
          <div className="mt-2 flex flex-wrap gap-2">
            {SORT_OPTIONS.map((o) => {
              const isActive = activeSort === o.key
              return (
                <a
                  key={o.key}
                  href={`/gallery?${new URLSearchParams({ ...(category ? { category } : {}), ...(activeSize !== 'all' ? { size: activeSize } : {}), sort: o.key, ...(q ? { q } : {}) }).toString()}`}
                  className={'rounded-full px-3 py-1 text-xs font-medium transition-colors ' + (isActive ? 'text-white' : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300')}
                  style={isActive ? { background: 'var(--brand-primary)' } : undefined}
                >
                  {o.label}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* 통계 스트립 */}
      {!category && !q && (
        <section className="border-b border-gray-100 bg-white">
          <div className="container mx-auto py-4">
            <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{PORTFOLIO.length}건</span>
                <span className="text-[11px] font-semibold text-gray-700">전체 포트폴리오</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{categoryCount}개</span>
                <span className="text-[11px] font-semibold text-gray-700">업종 카테고리</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{featuredCount}건</span>
                <span className="text-[11px] font-semibold text-gray-700">추천 시공 사례</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{regionCount}개</span>
                <span className="text-[11px] font-semibold text-gray-700">지역 커버</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto py-8">
        {q && (
          <div className="mb-4 text-sm text-gray-700">
            <span className="font-medium text-gray-900">&ldquo;{q}&rdquo;</span> 검색 결과{' '}
            {items.length}건
          </div>
        )}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-sm font-medium text-gray-500">
              {q ? `"${q}" 검색 결과가 없습니다` : '해당 카테고리의 시공 사례가 없습니다'}
            </p>
            <a
              href="/gallery"
              className="mt-4 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              전체 보기
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <PortfolioCardWithSave key={p.id} item={p} />
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">시공 포트폴리오를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">최신 인테리어 시공 사례·업종별 트렌드·평당 단가 동향을 격주로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}
