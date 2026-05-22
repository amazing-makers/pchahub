import type { Metadata } from 'next'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('themyungdang', {
  title: '매물 목록',
  description: '전국 프랜차이즈 가맹 입점 매물. 권리금 양도·신규임대·업종·지역·면적별로 나에게 맞는 입점 매물을 찾으세요.',
  path: '/listings',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '더명당', url: 'https://themyungdang.amakers.co.kr' },
    { name: '매물 목록', url: 'https://themyungdang.amakers.co.kr/listings' },
  ],
})

import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, Map, Star, Store, X } from 'lucide-react'
import { formatNumber } from '@amakers/utils'
import { Card, CardContent } from '@amakers/ui'
import { ListingCard } from '@/components/listing-card'
import { ListingCardWithSave } from '@/components/listing-card-with-save'
import {
  LISTING_CATEGORIES,
  LISTINGS,
  TYPE_LABEL,
  type ListingType,
} from '@/lib/mock-data'
import { MobileFilterToggle } from '@/components/mobile-filter-toggle'

const REGIONS = [
  '서울',
  '경기',
  '인천',
  '부산',
  '대구',
  '대전',
  '광주',
  '울산',
  '강원',
  '충청',
  '전라',
  '경상',
  '제주',
]

const ITEMS_PER_PAGE = 12

interface ListingsPageProps {
  searchParams: { type?: string; region?: string; q?: string; sort?: string; fitCategory?: string; source?: string; page?: string }
}

// 출처 필터: 'own' = 자체 매물, 'changupmall' 등 = 외부 출처 slug
const SOURCE_OPTIONS = [
  { key: 'own', label: '자체 등록' },
  { key: 'changupmall', label: '창업몰' },
]

export default function ListingsPage({ searchParams }: ListingsPageProps) {
  const { type, region, q, sort = 'recommended', fitCategory, source, page: pageStr } = searchParams
  const currentPage = Math.max(1, parseInt(pageStr ?? '1', 10))

  let results = LISTINGS.slice()
  if (type) results = results.filter((l) => l.type === type)
  if (region) results = results.filter((l) => l.region === region)
  if (fitCategory) results = results.filter((l) => l.fitCategories.includes(fitCategory))
  if (source) {
    if (source === 'own') results = results.filter((l) => !l.externalSource)
    else results = results.filter((l) => l.externalSource?.name === source)
  }
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(needle) ||
        l.fullAddress.toLowerCase().includes(needle) ||
        l.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }

  results = [...results].sort((a, b) => {
    switch (sort) {
      case 'rent-asc':
        return a.monthlyRent - b.monthlyRent
      case 'rent-desc':
        return b.monthlyRent - a.monthlyRent
      case 'area-desc':
        return b.area - a.area
      case 'area-asc':
        return a.area - b.area
      case 'newest':
        return b.createdAt.localeCompare(a.createdAt)
      default:
        return b.viewCount - a.viewCount
    }
  })

  const totalCount       = results.length
  const totalPages       = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))
  const safePage         = Math.min(currentPage, totalPages)
  const paginatedResults = results.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE)

  const typeLabel        = type        ? TYPE_LABEL[type as ListingType] : null
  const fitCategoryLabel = fitCategory ? (LISTING_CATEGORIES.find((c) => c.key === fitCategory)?.label ?? null) : null
  const sourceLabel      = source      ? (SOURCE_OPTIONS.find((s) => s.key === source)?.label ?? null) : null
  const hasActiveFilters = !!(type || region || fitCategory || q || source)

  const listJsonLd = buildItemListJsonLd({
    url: 'https://themyungdang.amakers.co.kr/listings',
    items: paginatedResults.map((l) => ({ name: l.title, url: `https://themyungdang.amakers.co.kr/listings/${l.id}` })),
  })

  const transferCount = LISTINGS.filter((l) => l.type === 'transfer').length
  const verifiedCount = LISTINGS.filter((l) => l.verified).length
  const regionCount = new Set(LISTINGS.map((l) => l.region)).size

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">
            {typeLabel ? `${typeLabel} 매물` : '전체 매물'}
            {region && (
              <span className="ml-2 text-base font-normal text-gray-500">· {region}</span>
            )}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            총 {totalCount}건
            {!hasActiveFilters && ` · 본인 확인 매물 위주`}
          </p>

          {/* Active filter badges */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400">필터:</span>
              {type && (
                <a
                  href={makeHref(searchParams, { type: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-gray-700"
                >
                  {TYPE_LABEL[type as ListingType]}
                  <X className="h-3 w-3" />
                </a>
              )}
              {region && (
                <a
                  href={makeHref(searchParams, { region: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-gray-700"
                >
                  {region}
                  <X className="h-3 w-3" />
                </a>
              )}
              {fitCategoryLabel && (
                <a
                  href={makeHref(searchParams, { fitCategory: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-gray-700"
                >
                  {fitCategoryLabel}
                  <X className="h-3 w-3" />
                </a>
              )}
              {sourceLabel && (
                <a
                  href={makeHref(searchParams, { source: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-gray-700"
                >
                  출처: {sourceLabel}
                  <X className="h-3 w-3" />
                </a>
              )}
              {q && (
                <a
                  href={makeHref(searchParams, { q: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-gray-700"
                >
                  &apos;{q}&apos;
                  <X className="h-3 w-3" />
                </a>
              )}
              <a
                href="/listings"
                className="text-xs text-gray-400 underline hover:text-gray-700"
              >
                전체 초기화
              </a>
            </div>
          )}
          {/* Keyword search */}
          <form
            method="get"
            action="/listings"
            className="mt-4 flex max-w-lg items-center gap-2"
          >
            {/* Preserve existing filters when searching */}
            {type        && <input type="hidden" name="type"        value={type} />}
            {region      && <input type="hidden" name="region"      value={region} />}
            {fitCategory && <input type="hidden" name="fitCategory" value={fitCategory} />}
            {source      && <input type="hidden" name="source"      value={source} />}
            {sort !== 'recommended' && <input type="hidden" name="sort" value={sort} />}
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                defaultValue={q ?? ''}
                placeholder="상호명, 주소, 업종 검색…"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              {q && (
                <a
                  href={makeHref(searchParams, { q: undefined })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  aria-label="검색어 지우기"
                >
                  ✕
                </a>
              )}
            </div>
            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
            >
              검색
            </button>
          </form>
        </div>
      </section>

      {/* 통계 스트립 */}
      {!hasActiveFilters && (
        <section className="border-b border-gray-100 bg-white">
          <div className="container mx-auto py-4">
            <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{LISTINGS.length}건</span>
                <span className="text-[11px] font-semibold text-gray-700">전체 매물</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{transferCount}건</span>
                <span className="text-[11px] font-semibold text-gray-700">양도 매물</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{verifiedCount}건</span>
                <span className="text-[11px] font-semibold text-gray-700">본인 확인 매물</span>
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
        <div className="mb-4">
          <MobileFilterToggle>
            <div className="space-y-5">
              <FilterGroup title="거래 유형">
                <div className="space-y-1">
                  <FilterLink href={makeHref(searchParams, { type: undefined })} active={!type}>
                    전체 ({LISTINGS.length})
                  </FilterLink>
                  {(['transfer', 'new', 'sale'] as ListingType[]).map((t) => {
                    const count = LISTINGS.filter((l) => l.type === t).length
                    return (
                      <FilterLink
                        key={t}
                        href={makeHref(searchParams, { type: t })}
                        active={type === t}
                      >
                        {TYPE_LABEL[t]} ({count})
                      </FilterLink>
                    )
                  })}
                </div>
              </FilterGroup>

              <FilterGroup title="지역">
                <div className="space-y-1">
                  <FilterLink
                    href={makeHref(searchParams, { region: undefined })}
                    active={!region}
                  >
                    전국
                  </FilterLink>
                  {REGIONS.map((r) => {
                    const count = LISTINGS.filter((l) => l.region === r).length
                    if (count === 0) return null
                    return (
                      <FilterLink
                        key={r}
                        href={makeHref(searchParams, { region: r })}
                        active={region === r}
                      >
                        {r} ({count})
                      </FilterLink>
                    )
                  })}
                </div>
              </FilterGroup>

              <FilterGroup title="업종">
                <div className="space-y-1">
                  <FilterLink href={makeHref(searchParams, { fitCategory: undefined })} active={!fitCategory}>
                    전체
                  </FilterLink>
                  {LISTING_CATEGORIES.map((c) => {
                    const count = LISTINGS.filter((l) => l.fitCategories.includes(c.key)).length
                    if (count === 0) return null
                    return (
                      <FilterLink
                        key={c.key}
                        href={makeHref(searchParams, { fitCategory: c.key })}
                        active={fitCategory === c.key}
                      >
                        {c.label} ({count})
                      </FilterLink>
                    )
                  })}
                </div>
              </FilterGroup>

              <FilterGroup title="출처">
                <div className="space-y-1">
                  <FilterLink href={makeHref(searchParams, { source: undefined })} active={!source}>
                    전체 ({LISTINGS.length})
                  </FilterLink>
                  {SOURCE_OPTIONS.map((s) => {
                    const count = s.key === 'own'
                      ? LISTINGS.filter((l) => !l.externalSource).length
                      : LISTINGS.filter((l) => l.externalSource?.name === s.key).length
                    if (count === 0) return null
                    return (
                      <FilterLink
                        key={s.key}
                        href={makeHref(searchParams, { source: s.key })}
                        active={source === s.key}
                      >
                        {s.label} ({count})
                      </FilterLink>
                    )
                  })}
                </div>
              </FilterGroup>

              <FilterGroup title="정렬">
                <div className="space-y-1">
                  {SORT_OPTIONS.map((s) => (
                    <FilterLink
                      key={s.key}
                      href={makeHref(searchParams, { sort: s.key })}
                      active={sort === s.key}
                    >
                      {s.label}
                    </FilterLink>
                  ))}
                </div>
              </FilterGroup>
            </div>
          </MobileFilterToggle>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="hidden space-y-5 lg:block">
            {hasActiveFilters && (
              <a
                href="/listings"
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900"
              >
                <X className="h-3.5 w-3.5" />
                필터 전체 초기화
              </a>
            )}
            <FilterGroup title="거래 유형">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { type: undefined })} active={!type}>
                  전체 ({LISTINGS.length})
                </FilterLink>
                {(['transfer', 'new', 'sale'] as ListingType[]).map((t) => {
                  const count = LISTINGS.filter((l) => l.type === t).length
                  return (
                    <FilterLink
                      key={t}
                      href={makeHref(searchParams, { type: t })}
                      active={type === t}
                    >
                      {TYPE_LABEL[t]} ({count})
                    </FilterLink>
                  )
                })}
              </div>
            </FilterGroup>

            <FilterGroup title="지역">
              <div className="space-y-1">
                <FilterLink
                  href={makeHref(searchParams, { region: undefined })}
                  active={!region}
                >
                  전국
                </FilterLink>
                {REGIONS.map((r) => {
                  const count = LISTINGS.filter((l) => l.region === r).length
                  if (count === 0) return null
                  return (
                    <FilterLink
                      key={r}
                      href={makeHref(searchParams, { region: r })}
                      active={region === r}
                    >
                      {r} ({count})
                    </FilterLink>
                  )
                })}
              </div>
            </FilterGroup>

            <FilterGroup title="업종">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { fitCategory: undefined })} active={!fitCategory}>
                  전체
                </FilterLink>
                {LISTING_CATEGORIES.map((c) => {
                  const count = LISTINGS.filter((l) => l.fitCategories.includes(c.key)).length
                  if (count === 0) return null
                  return (
                    <FilterLink
                      key={c.key}
                      href={makeHref(searchParams, { fitCategory: c.key })}
                      active={fitCategory === c.key}
                    >
                      {c.label} ({count})
                    </FilterLink>
                  )
                })}
              </div>
            </FilterGroup>

            <FilterGroup title="출처">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { source: undefined })} active={!source}>
                  전체 ({LISTINGS.length})
                </FilterLink>
                {SOURCE_OPTIONS.map((s) => {
                  const count = s.key === 'own'
                    ? LISTINGS.filter((l) => !l.externalSource).length
                    : LISTINGS.filter((l) => l.externalSource?.name === s.key).length
                  if (count === 0) return null
                  return (
                    <FilterLink
                      key={s.key}
                      href={makeHref(searchParams, { source: s.key })}
                      active={source === s.key}
                    >
                      {s.label} ({count})
                    </FilterLink>
                  )
                })}
              </div>
            </FilterGroup>

            <FilterGroup title="정렬">
              <div className="space-y-1">
                {SORT_OPTIONS.map((s) => (
                  <FilterLink
                    key={s.key}
                    href={makeHref(searchParams, { sort: s.key })}
                    active={sort === s.key}
                  >
                    {s.label}
                  </FilterLink>
                ))}
              </div>
            </FilterGroup>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-gray-700">
                {totalCount}건
                {totalPages > 1 && (
                  <span className="ml-1.5 font-normal text-gray-400">
                    ({safePage} / {totalPages} 페이지)
                  </span>
                )}
              </h2>
              <a
                href="/listings/map"
                className="flex items-center gap-1.5 rounded-lg border border-gray-900 bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                <Map className="h-3.5 w-3.5" />
                지도로 검색
              </a>
            </div>

            {paginatedResults.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-sm text-gray-500">
                  검색 결과가 없습니다.{hasActiveFilters && ' 필터를 줄여 다시 시도해보세요.'}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedResults.map((l) => (
                  <ListingCardWithSave key={l.id} listing={l} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                searchParams={searchParams}
                currentPage={safePage}
                totalPages={totalPages}
              />
            )}
          </div>
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
                <a href="https://bestplace.amakers.co.kr/stores" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" />우수 매장 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themanual.amakers.co.kr/courses" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-rose-500" />창업 운영 강의</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://jangsanote.amakers.co.kr" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-emerald-500" />점주 커뮤니티</span>
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">새 입점 매물을 가장 먼저 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 공실·권리금·임대료 시세 동향을 지역별로 정리해 격주로 보내드립니다.</p>
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

const SORT_OPTIONS = [
  { key: 'recommended', label: '인기순' },
  { key: 'newest', label: '최신 등록순' },
  { key: 'rent-asc', label: '월세 낮은 순' },
  { key: 'rent-desc', label: '월세 높은 순' },
  { key: 'area-desc', label: '평수 큰 순' },
  { key: 'area-asc', label: '평수 작은 순' },
]

function makeHref(
  current: ListingsPageProps['searchParams'],
  changes: Partial<ListingsPageProps['searchParams']>,
) {
  const next = { ...current, ...changes }
  const params = new URLSearchParams()
  if (next.type) params.set('type', next.type)
  if (next.region) params.set('region', next.region)
  if (next.fitCategory) params.set('fitCategory', next.fitCategory)
  if (next.source) params.set('source', next.source)
  if (next.q) params.set('q', next.q)
  if (next.sort && next.sort !== 'recommended') params.set('sort', next.sort)
  // Only carry `page` when explicitly provided in changes (filter changes reset to page 1)
  const pageNum = 'page' in changes ? changes.page : undefined
  if (pageNum && pageNum !== '1') params.set('page', pageNum)
  const qs = params.toString()
  return qs ? `/listings?${qs}` : '/listings'
}

function Pagination({
  searchParams,
  currentPage,
  totalPages,
}: {
  searchParams: ListingsPageProps['searchParams']
  currentPage: number
  totalPages: number
}) {
  const pageNums: (number | '…')[] = []
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
      pageNums.push(p)
    } else if (pageNums[pageNums.length - 1] !== '…') {
      pageNums.push('…')
    }
  }

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-1"
      aria-label="페이지 이동"
    >
      <a
        href={currentPage > 1 ? makeHref(searchParams, { page: String(currentPage - 1) }) : undefined}
        aria-disabled={currentPage === 1}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-colors ${
          currentPage === 1
            ? 'pointer-events-none border-gray-100 text-gray-300'
            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </a>

      {pageNums.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-gray-400">
            …
          </span>
        ) : (
          <a
            key={p}
            href={makeHref(searchParams, { page: String(p) })}
            aria-current={p === currentPage ? 'page' : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
              p === currentPage
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {p}
          </a>
        ),
      )}

      <a
        href={currentPage < totalPages ? makeHref(searchParams, { page: String(currentPage + 1) }) : undefined}
        aria-disabled={currentPage === totalPages}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-colors ${
          currentPage === totalPages
            ? 'pointer-events-none border-gray-100 text-gray-300'
            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </a>
    </nav>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={
        'block rounded-md px-3 py-1.5 text-sm transition-colors ' +
        (active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100')
      }
    >
      {children}
    </a>
  )
}
