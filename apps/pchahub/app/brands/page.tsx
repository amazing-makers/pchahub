import type { Metadata } from 'next'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '브랜드 검색',
  description: '공정거래위원회 가맹정보 기준 프랜차이즈 브랜드 전체 목록. 창업비·성장률·가맹비·매장 수로 필터·정렬하여 나에게 맞는 브랜드를 찾으세요.',
  path: '/brands',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차허브', url: 'https://pchahub.amakers.co.kr' },
    { name: '브랜드 검색', url: 'https://pchahub.amakers.co.kr/brands' },
  ],
})

import { ArrowRight, BookOpen, MapPin, Search, Star, Store } from 'lucide-react'
import { formatNumber } from '@amakers/utils'
import { Card, CardContent } from '@amakers/ui'
import { BrandCard } from '@/components/brand-card'
import { BrandSaveButton } from '@/components/brand-save-button'
import { CompareButton } from '@/components/compare-button'
import { CATEGORIES, FEATURED_BRANDS, compareBrandsRecommended } from '@/lib/mock-data'
import { getBrands, getDataSourceLabel } from '@/lib/kftc/source'

// 카테고리별 이모지 아이콘
const CATEGORY_EMOJI: Record<string, string> = {
  chicken:     '🍗',
  cafe:        '☕',
  korean:      '🍱',
  japanese:    '🍣',
  snack:       '🍢',
  dessert:     '🍰',
  bar:         '🍺',
  western:     '🍔',
  pizza:       '🍕',
  chinese:     '🥟',
  convenience: '🏪',
  bakery:      '🥐',
  fastfood:    '🍔',
  pcbang:      '🖥️',
  education:   '📚',
  study:       '📖',
  laundry:     '👕',
  life:        '🛒',
  leisure:     '🎮',
}

interface BrandsPageProps {
  searchParams: { category?: string; region?: string; q?: string; sort?: string; page?: string }
}

const PAGE_SIZE = 48

export const revalidate = 3600 // 1시간 캐시

export default async function BrandsPage({ searchParams }: BrandsPageProps) {
  const [allBrands, dataSource] = await Promise.all([getBrands(), Promise.resolve(getDataSourceLabel())])
  const { category: activeCategory, region: activeRegion, q, sort = 'recommended', page } = searchParams
  const pageNum = Math.max(1, parseInt(page ?? '1', 10) || 1)

  // 검색어·카테고리 필터 시 featured 포함 전체 대상, 조건 없는 기본 목록만 광고섹션과 중복 방지로 featured 제외
  const isFiltered = Boolean(q || activeCategory || activeRegion)
  const hqRegionCount = new Set(allBrands.map((b) => b.hqRegion).filter(Boolean)).size
  const totalStores = allBrands.reduce((acc, b) => acc + (b.storeCount ?? 0), 0)
  let results = isFiltered ? [...allBrands] : allBrands.filter((b) => !b.featured)
  if (activeCategory) {
    results = results.filter((b) => b.category === activeCategory)
  }
  if (activeRegion) {
    results = results.filter((b) => b.hqRegion === activeRegion)
  }
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (b) =>
        b.name.toLowerCase().includes(needle) ||
        b.categoryLabel.toLowerCase().includes(needle) ||
        b.description.toLowerCase().includes(needle),
    )
  }

  results = [...results].sort((a, b) => {
    switch (sort) {
      case 'cost-asc':
        return a.startupCost - b.startupCost
      case 'cost-desc':
        return b.startupCost - a.startupCost
      case 'growth-desc':
        return b.growthRate - a.growthRate
      case 'stores-desc':
        return b.storeCount - a.storeCount
      default:
        return compareBrandsRecommended(a, b)
    }
  })

  const totalResults = results.length
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE))
  const currentPage = Math.min(pageNum, totalPages)
  const pagedResults = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const categoryLabel = activeCategory
    ? CATEGORIES.find((c) => c.key === activeCategory)?.label
    : null

  const listJsonLd = buildItemListJsonLd({
    url: 'https://pchahub.amakers.co.kr/brands',
    items: pagedResults.map((b) => ({ name: b.name, url: `https://pchahub.amakers.co.kr/brands/${b.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* ── 통합 검색 헤더 ── */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">

          {/* 타이틀 행 */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-h3 font-bold text-gray-900">
                {categoryLabel
                  ? <>{CATEGORY_EMOJI[activeCategory ?? ''] ?? ''} {categoryLabel} 브랜드</>
                  : '브랜드 검색'}
                {q && (
                  <span className="ml-2 text-base font-normal text-gray-500">
                    '{q}' 검색 결과
                  </span>
                )}
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                공정위 가맹정보 기준 · 총 {allBrands.length.toLocaleString()}개 브랜드
                {dataSource === 'kftc' && (
                  <span className="ml-1.5 inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700">
                    실시간
                  </span>
                )}
              </p>
            </div>
            <a
              href="/brands/compare"
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              브랜드 비교 →
            </a>
          </div>

          {/* 검색 폼 */}
          <form method="get" action="/brands" className="mt-4">
            {/* 현재 카테고리·정렬은 유지 */}
            {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
            {sort !== 'recommended' && <input type="hidden" name="sort" value={sort} />}
            <div className="flex w-full max-w-2xl gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  name="q"
                  defaultValue={q ?? ''}
                  placeholder="브랜드명·키워드 검색"
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>
              <select
                name="region"
                defaultValue={activeRegion ?? ''}
                className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-[var(--brand-primary)] focus:outline-none"
              >
                <option value="">전국</option>
                {REGION_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <button
                type="submit"
                className="flex h-10 items-center gap-1.5 rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-semibold text-white hover:opacity-90"
              >
                <Search className="h-4 w-4" />
                검색
              </button>
            </div>
          </form>

          {/* 테마별 카테고리 칩 */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <a
              href={makeHref(searchParams, { category: undefined, page: undefined })}
              className={
                'flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ' +
                (!activeCategory
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400')
              }
            >
              전체
            </a>
            {CATEGORIES.map((c) => {
              const isActive = activeCategory === c.key
              return (
                <a
                  key={c.key}
                  href={makeHref(searchParams, { category: c.key, page: undefined })}
                  className={
                    'flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ' +
                    (isActive
                      ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400')
                  }
                >
                  <span>{CATEGORY_EMOJI[c.key]}</span>
                  {c.label}
                </a>
              )
            })}
          </div>

          {/* 활성 필터 요약 */}
          {(activeCategory || activeRegion || q) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400">필터:</span>
              {activeCategory && (
                <a
                  href={makeHref(searchParams, { category: undefined, page: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700 hover:bg-gray-200"
                >
                  {CATEGORY_EMOJI[activeCategory]} {categoryLabel} ✕
                </a>
              )}
              {activeRegion && (
                <a
                  href={makeHref(searchParams, { region: undefined, page: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700 hover:bg-gray-200"
                >
                  📍 {activeRegion} ✕
                </a>
              )}
              {q && (
                <a
                  href={makeHref(searchParams, { q: undefined, page: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700 hover:bg-gray-200"
                >
                  🔍 '{q}' ✕
                </a>
              )}
              <a
                href="/brands"
                className="text-xs text-[var(--brand-primary)] hover:underline"
              >
                전체 초기화
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── 통계 스트립 ── */}
      {!isFiltered && (
        <div className="border-b border-gray-100 bg-white">
          <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {[
              { value: formatNumber(allBrands.length), label: '전체 가맹 브랜드' },
              { value: String(CATEGORIES.length), label: '업종 카테고리' },
              { value: formatNumber(totalStores), label: '전국 총 매장 수' },
              { value: String(hqRegionCount), label: '본사 소재 지역' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-4">
                <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Filter sidebar */}
          <aside className="space-y-5">
            {/* 검색 결과 요약 */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">검색 결과</div>
              <div className="mt-2 text-2xl font-bold text-gray-900">{totalResults.toLocaleString()}<span className="ml-1 text-sm font-normal text-gray-500">개</span></div>
              {activeCategory && (
                <div className="mt-1 text-sm text-gray-600">
                  {CATEGORY_EMOJI[activeCategory]} {categoryLabel} 브랜드
                </div>
              )}
              {activeRegion && (
                <div className="mt-0.5 text-sm text-gray-600">📍 {activeRegion} 본사</div>
              )}
              {q && (
                <div className="mt-0.5 text-sm text-gray-600">🔍 &apos;{q}&apos; 검색</div>
              )}
              {(activeCategory || activeRegion || q) && (
                <a href="/brands" className="mt-2 block text-xs text-[var(--brand-primary)] hover:underline">
                  필터 초기화
                </a>
              )}
            </div>

            {/* 본사 지역 */}
            <FilterGroup title="본사 지역">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { region: undefined, page: undefined })} active={!activeRegion}>
                  전국 ({allBrands.length.toLocaleString()})
                </FilterLink>
                {REGION_OPTIONS.map((r) => {
                  const count = allBrands.filter((b) => b.hqRegion === r).length
                  if (count === 0) return null
                  return (
                    <FilterLink
                      key={r}
                      href={makeHref(searchParams, { region: r, page: undefined })}
                      active={activeRegion === r}
                    >
                      {r} ({count})
                    </FilterLink>
                  )
                })}
              </div>
            </FilterGroup>

            {/* 정렬 */}
            <FilterGroup title="정렬">
              <div className="space-y-1">
                {SORT_OPTIONS.map((s) => (
                  <FilterLink
                    key={s.key}
                    href={makeHref(searchParams, { sort: s.key, page: undefined })}
                    active={sort === s.key}
                  >
                    {s.label}
                  </FilterLink>
                ))}
              </div>
            </FilterGroup>

            {/* 창업 도구 바로가기 */}
            <FilterGroup title="창업 도구">
              <div className="space-y-1.5">
                <a href="/scanner" className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                  ✨ 창업 스캐너
                </a>
                <a href="/calculator" className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                  🧮 수익 계산기
                </a>
                <a href="/brands/compare" className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                  ⚖️ 브랜드 비교
                </a>
                <a href="/themes" className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                  🎯 테마별 보기
                </a>
              </div>
            </FilterGroup>

            {/* 데이터 출처 */}
            <Card className="border-gray-200 bg-indigo-50">
              <CardContent className="p-4 text-sm">
                <div className="font-semibold text-gray-900">데이터 출처</div>
                <p className="mt-1 text-xs text-gray-600">
                  {dataSource === 'kftc'
                    ? '공정거래위원회 가맹정보 실 API 데이터 · 매일 자동 갱신.'
                    : '공정거래위원회 협회 등록 정보공개서 기준이며, 분기마다 업데이트됩니다.'}
                </p>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="space-y-6">
            {!activeCategory && !q && FEATURED_BRANDS.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-700">상단 노출 (광고)</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {FEATURED_BRANDS.map((b) => (
                    <div key={b.id} className="relative">
                      <BrandCard brand={b} featured />
                      <div className="absolute top-2 left-2 z-10">
                        <BrandSaveButton brandId={b.id} />
                      </div>
                      <div className="absolute bottom-[72px] right-3 z-10">
                        <CompareButton brandId={b.id} brandName={b.name} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                  {totalResults > 0
                    ? `${((currentPage - 1) * PAGE_SIZE + 1).toLocaleString()}–${Math.min(currentPage * PAGE_SIZE, totalResults).toLocaleString()} / 총 ${totalResults.toLocaleString()}개`
                    : '0개 브랜드'}
                </h2>
                {totalPages > 1 && (
                  <span className="text-xs text-gray-400">{currentPage} / {totalPages} 페이지</span>
                )}
              </div>
              {pagedResults.length === 0 ? (
                <Card>
                  <CardContent className="p-10 text-center text-sm text-gray-500">
                    검색 결과가 없습니다. 필터를 줄여 다시 시도해보세요.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {pagedResults.map((b) => (
                    <div key={b.id} className="relative">
                      <BrandCard brand={b} />
                      <div className="absolute top-2 left-2 z-10">
                        <BrandSaveButton brandId={b.id} />
                      </div>
                      <div className="absolute bottom-[72px] right-3 z-10">
                        <CompareButton brandId={b.id} brandName={b.name} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  searchParams={searchParams}
                />
              )}
            </div>
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
                <a href="https://themyungdang.amakers.co.kr/listings" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-500" />창업 매물 찾기</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://bestplace.amakers.co.kr/stores" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" />우수 매장 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themanual.amakers.co.kr/courses" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-indigo-500" />창업 운영 강의</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://jangsanote.amakers.co.kr" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-rose-500" />점주 커뮤니티</span>
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">신규 브랜드 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">새로 등록된 가맹 브랜드·투자설명회·창업 이벤트 소식을 격주로 보내드립니다.</p>
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
  { key: 'recommended', label: '추천순' },
  { key: 'growth-desc', label: '성장률 높은 순' },
  { key: 'cost-asc', label: '창업비 낮은 순' },
  { key: 'cost-desc', label: '창업비 높은 순' },
  { key: 'stores-desc', label: '매장 수 많은 순' },
]

const REGION_OPTIONS = [
  '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산',
]

function makeHref(
  current: BrandsPageProps['searchParams'],
  changes: Partial<BrandsPageProps['searchParams']>,
) {
  const next = { ...current, ...changes }
  const params = new URLSearchParams()
  if (next.category) params.set('category', next.category)
  if (next.region) params.set('region', next.region)
  if (next.q) params.set('q', next.q)
  if (next.sort && next.sort !== 'recommended') params.set('sort', next.sort)
  // page=1은 URL에서 생략 (깔끔한 URL)
  if (next.page && next.page !== '1') params.set('page', next.page)
  const qs = params.toString()
  return qs ? `/brands?${qs}` : '/brands'
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

function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number
  totalPages: number
  searchParams: BrandsPageProps['searchParams']
}) {
  // 현재 페이지 주변 최대 5개 페이지 번호 표시
  const delta = 2
  const range: number[] = []
  for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
    range.push(i)
  }
  const rangeFirst = range[0] ?? 1
  const rangeLast = range[range.length - 1] ?? totalPages
  const showStartEllipsis = rangeFirst > 2
  const showEndEllipsis = rangeLast < totalPages - 1

  const pageHref = (p: number) => makeHref(searchParams, { page: String(p) })

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="페이지 탐색">
      <a
        href={pageHref(currentPage - 1)}
        aria-disabled={currentPage <= 1}
        className={
          'flex h-8 w-8 items-center justify-center rounded-md border text-sm ' +
          (currentPage <= 1
            ? 'pointer-events-none border-gray-100 text-gray-300'
            : 'border-gray-200 text-gray-700 hover:bg-gray-50')
        }
      >
        &lsaquo;
      </a>

      {rangeFirst > 1 && (
        <a href={pageHref(1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
          1
        </a>
      )}
      {showStartEllipsis && <span className="px-1 text-gray-400">…</span>}

      {range.map((p) => (
        <a
          key={p}
          href={pageHref(p)}
          aria-current={p === currentPage ? 'page' : undefined}
          className={
            'flex h-8 w-8 items-center justify-center rounded-md border text-sm ' +
            (p === currentPage
              ? 'border-gray-900 bg-gray-900 font-medium text-white'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50')
          }
        >
          {p}
        </a>
      ))}

      {showEndEllipsis && <span className="px-1 text-gray-400">…</span>}
      {rangeLast < totalPages && (
        <a href={pageHref(totalPages)} className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
          {totalPages}
        </a>
      )}

      <a
        href={pageHref(currentPage + 1)}
        aria-disabled={currentPage >= totalPages}
        className={
          'flex h-8 w-8 items-center justify-center rounded-md border text-sm ' +
          (currentPage >= totalPages
            ? 'pointer-events-none border-gray-100 text-gray-300'
            : 'border-gray-200 text-gray-700 hover:bg-gray-50')
        }
      >
        &rsaquo;
      </a>
    </nav>
  )
}
