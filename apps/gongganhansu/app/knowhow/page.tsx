import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { BookOpen, Clock, Eye, Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { KNOWHOW_ARTICLES, KNOWHOW_CATEGORIES } from '@/lib/knowhow-data'

export const metadata: Metadata = buildPageMetadata('gongganhansu', {
  title: '시공 노하우',
  description: '검증된 F&B 시공사가 직접 작성한 인테리어 노하우와 기술 가이드.',
  path: '/knowhow',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '공간의한수', url: 'https://gongganhansu.amakers.co.kr' },
    { name: '시공 노하우', url: 'https://gongganhansu.amakers.co.kr/knowhow' },
  ],
})

const SORT_OPTIONS = [
  { key: 'recent', label: '최신순' },
  { key: 'featured', label: '추천순' },
  { key: 'views', label: '조회 많은 순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

interface KnowhowPageProps {
  searchParams: { category?: string; q?: string; sort?: string }
}

export default function KnowhowPage({ searchParams }: KnowhowPageProps) {
  const { category, q, sort = 'recent' } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'recent') as SortKey
  const needle = q?.toLowerCase().trim() ?? ''

  let filtered = category
    ? KNOWHOW_ARTICLES.filter((a) => a.category === category)
    : [...KNOWHOW_ARTICLES]

  if (needle) {
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(needle) ||
        a.excerpt.toLowerCase().includes(needle) ||
        a.authorName.toLowerCase().includes(needle) ||
        a.category.toLowerCase().includes(needle) ||
        a.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }

  filtered = [...filtered].sort((a, b) => {
    switch (activeSort) {
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case 'views':
        return b.views - a.views
      default:
        return b.publishedAt.localeCompare(a.publishedAt)
    }
  })

  const listJsonLd = buildItemListJsonLd({
    url: 'https://gongganhansu.amakers.co.kr/knowhow',
    items: filtered.slice(0, 20).map((a) => ({
      name: a.title,
      url: `https://gongganhansu.amakers.co.kr/knowhow/${a.slug}`,
    })),
  })

  const totalCategories = KNOWHOW_CATEGORIES.length
  const featuredCount = KNOWHOW_ARTICLES.filter((a) => a.featured).length

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />

      {/* 히어로 */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-h3 font-bold text-gray-900">
                시공 전문가가 직접 쓴 F&B 인테리어 노하우
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                동선 설계·자재 선택·비용 절감·트렌드·시공 기법·설비까지. 현장 경험이 녹아든
                실전 가이드를 무료로 읽어보세요.
              </p>
            </div>
          </div>

          {/* 통계 */}
          <div className="mt-5 flex flex-wrap gap-6">
            <div className="text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">
                {KNOWHOW_ARTICLES.length}개
              </span>
              <span className="ml-1.5 text-sm text-gray-500">아티클</span>
            </div>
            <div className="text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">
                {totalCategories}개
              </span>
              <span className="ml-1.5 text-sm text-gray-500">카테고리</span>
            </div>
            <div className="text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">
                전문가 직접
              </span>
              <span className="ml-1.5 text-sm text-gray-500">집필</span>
            </div>
          </div>

          {/* 검색 */}
          <form method="GET" action="/knowhow" className="mt-5 flex max-w-md gap-2">
            {category && <input type="hidden" name="category" value={category} />}
            {activeSort !== 'recent' && <input type="hidden" name="sort" value={activeSort} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                aria-label="제목, 저자, 키워드 검색…"
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
                href={category ? `/knowhow?category=${encodeURIComponent(category)}` : '/knowhow'}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>

          {/* 카테고리 필터 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { value: '', label: `전체 (${KNOWHOW_ARTICLES.length})` },
              ...KNOWHOW_CATEGORIES.map((cat) => ({
                value: cat,
                label: `${cat} (${KNOWHOW_ARTICLES.filter((a) => a.category === cat).length})`,
              })),
            ].map((item) => {
              const isActive = item.value === '' ? !category : category === item.value
              const href =
                item.value === ''
                  ? `/knowhow?${new URLSearchParams({
                      ...(activeSort !== 'recent' ? { sort: activeSort } : {}),
                      ...(q ? { q } : {}),
                    }).toString()}` || '/knowhow'
                  : `/knowhow?${new URLSearchParams({
                      category: item.value,
                      ...(activeSort !== 'recent' ? { sort: activeSort } : {}),
                      ...(q ? { q } : {}),
                    }).toString()}`
              return (
                <a
                  key={item.value}
                  href={href}
                  className={
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                    (isActive
                      ? 'text-white'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }
                  style={isActive ? { background: 'var(--brand-primary)' } : undefined}
                >
                  {item.label}
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
                  href={`/knowhow?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    sort: o.key,
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className={
                    'rounded-full px-3 py-1 text-xs font-medium transition-colors ' +
                    (isActive
                      ? 'text-white'
                      : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300')
                  }
                  style={isActive ? { background: 'var(--brand-primary)' } : undefined}
                >
                  {o.label}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* 아티클 그리드 */}
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
              {q ? `"${q}" 검색 결과가 없습니다` : '해당 카테고리의 노하우가 없습니다'}
            </p>
            <a
              href="/knowhow"
              className="mt-4 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              전체 보기
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <a key={article.slug} href={`/knowhow/${article.slug}`} className="group block">
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                  {/* 커버 이미지 */}
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    {/* 카테고리 배지 */}
                    <span
                      className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                      style={{ background: 'var(--brand-primary)' }}
                    >
                      {article.category}
                    </span>

                    {/* 제목 */}
                    <h2 className="mt-2 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-[var(--brand-primary)]">
                      {article.title}
                    </h2>

                    {/* 발췌 */}
                    <p className="mt-1.5 line-clamp-2 text-xs text-gray-500">{article.excerpt}</p>

                    {/* 저자 + 메타 */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <span className="truncate text-xs font-semibold text-gray-700">
                          {article.authorName}
                        </span>
                        <span className="ml-1 text-[11px] text-gray-400">
                          · {article.authorTitle}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2.5 text-[11px] text-gray-400">
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {article.readMinutes}분
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Eye className="h-3 w-3" />
                          {article.views.toLocaleString('ko-KR')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
