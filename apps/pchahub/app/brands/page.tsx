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
import { Card, CardContent, MobileFilterDrawer, NewsletterForm } from '@amakers/ui'
import { BrandCard } from '@/components/brand-card'
import { BrandSaveButton } from '@/components/brand-save-button'
import { CompareButton } from '@/components/compare-button'
import { CATEGORIES, FEATURED_BRANDS, compareBrandsRecommended } from '@/lib/mock-data'
import { getBrands, getDataSourceLabel } from '@/lib/kftc/source'
import { KOREAN_REGIONS } from '@/lib/regions-data'
import { CATEGORY_TRENDS, YEAR_STATS, REGION_SHARES } from '@/lib/trends-data'

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
  searchParams: { category?: string; region?: string; q?: string; sort?: string; page?: string; tab?: string }
}

const PAGE_SIZE = 48

export const revalidate = 3600 // 1시간 캐시

export default async function BrandsPage({ searchParams }: BrandsPageProps) {
  const [allBrands, dataSource] = await Promise.all([getBrands(), Promise.resolve(getDataSourceLabel())])
  const { category: activeCategory, region: activeRegion, q, sort = 'recommended', page, tab = 'brands' } = searchParams
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

  // 시장 트렌드 탭
  if (tab === 'trends') {
    const latest = YEAR_STATS[YEAR_STATS.length - 1]!
    const prev = YEAR_STATS[YEAR_STATS.length - 2]!
    return (
      <main className="bg-gray-50">
        <JsonLd data={breadcrumbs} />
        {/* 탭 네비게이션 */}
        <BrandsTabNav tab={tab} />
        <div className="container mx-auto space-y-10 py-10">
          {/* 연도별 통계 KPI */}
          <section>
            <h2 className="mb-5 text-h4 font-bold text-gray-900">📊 가맹 시장 연도별 통계</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: '전체 가맹 브랜드', value: latest.totalBrands.toLocaleString(), sub: `전년 대비 +${(latest.totalBrands - prev.totalBrands).toLocaleString()}`, up: true },
                { label: '전국 가맹 매장', value: latest.totalStores.toLocaleString(), sub: `${Math.round(((latest.totalStores - prev.totalStores) / prev.totalStores) * 100 * 10) / 10}% 성장`, up: true },
                { label: '평균 창업비용', value: `${latest.avgStartupCost.toLocaleString()}만원`, sub: `전년 대비 +${(latest.avgStartupCost - prev.avgStartupCost).toLocaleString()}만원`, up: false },
                { label: '신규 진입 브랜드', value: `${latest.newBrands}개`, sub: `폐업 ${latest.exitedBrands}개`, up: true },
              ].map(({ label, value, sub, up }) => (
                <Card key={label} className="border-gray-200 bg-white">
                  <CardContent className="p-5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</div>
                    <div className="mt-2 text-2xl font-black tracking-tight text-gray-900">{value}</div>
                    <div className={`mt-1 text-xs font-medium ${up ? 'text-emerald-600' : 'text-amber-600'}`}>{sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-2 text-right text-xs text-gray-400">공정거래위원회 가맹사업 정보공개서 기준 · {latest.year}년</p>
          </section>

          {/* 업종별 트렌드 */}
          <section>
            <h2 className="mb-5 text-h4 font-bold text-gray-900">🏪 업종별 트렌드</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[...CATEGORY_TRENDS].sort((a, b) => b.growthRate - a.growthRate).map((ct) => (
                <Card key={ct.category} className="border-gray-200 bg-white">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{ct.emoji}</span>
                        <span className="font-semibold text-gray-900">{ct.category}</span>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                          ct.growthRate >= 10 ? 'bg-emerald-100 text-emerald-700' :
                          ct.growthRate >= 0 ? 'bg-blue-50 text-blue-700' :
                          'bg-red-50 text-red-700'
                        }`}
                      >
                        {ct.growthRate >= 0 ? '+' : ''}{ct.growthRate}%
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div><span className="font-semibold text-gray-800">{ct.brands}</span> 브랜드</div>
                      <div><span className="font-semibold text-gray-800">{ct.storeCount.toLocaleString()}</span> 매장</div>
                      <div>평균 창업비 <span className="font-semibold text-gray-800">{ct.avgStartupCost.toLocaleString()}만</span></div>
                      <div>폐업률 <span className={`font-semibold ${ct.closureRate >= 15 ? 'text-red-600' : 'text-gray-800'}`}>{ct.closureRate}%</span></div>
                    </div>
                    <a
                      href={`/brands?category=${encodeURIComponent(ct.category)}`}
                      className="mt-3 block text-right text-xs font-medium text-indigo-600 hover:underline"
                    >
                      브랜드 보기 →
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 지역별 매장 비중 */}
          <section>
            <h2 className="mb-5 text-h4 font-bold text-gray-900">🗺️ 지역별 매장 분포</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {REGION_SHARES.map((r) => (
                <div key={r.region} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{r.region}</span>
                    <span className={`text-xs font-bold ${r.growth >= 10 ? 'text-emerald-600' : 'text-blue-600'}`}>
                      +{r.growth}%
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-bold text-gray-900">{r.storeCount.toLocaleString()}개</div>
                  <div className="mt-1 text-xs text-gray-500">전국 비중 {r.share}%</div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${(r.share / 25) * 100}%` }}
                    />
                  </div>
                  <a href={`/brands?tab=regions&region=${r.region}`} className="mt-2 block text-right text-[10px] text-gray-400 hover:text-indigo-600">
                    탐색 →
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    )
  }

  // 지역별 탐색 탭
  if (tab === 'regions') {
    const selectedRegion = searchParams.region
    const regionBrands = selectedRegion
      ? allBrands.filter((b) => b.hqRegion === selectedRegion)
      : []
    return (
      <main className="bg-gray-50">
        <JsonLd data={breadcrumbs} />
        <BrandsTabNav tab={tab} />
        <div className="container mx-auto py-10">
          {selectedRegion ? (
            <>
              <div className="mb-6 flex items-center gap-3">
                <a href="/brands?tab=regions" className="text-sm text-gray-500 hover:text-gray-800">← 전체 지역</a>
                <h2 className="text-h4 font-bold text-gray-900">📍 {selectedRegion} 본사 브랜드 ({regionBrands.length}개)</h2>
              </div>
              {regionBrands.length === 0 ? (
                <Card><CardContent className="p-10 text-center text-sm text-gray-500">해당 지역 브랜드 정보가 없습니다.</CardContent></Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {regionBrands.slice(0, 48).map((b) => (
                    <a key={b.id} href={`/brands/${b.id}`} className="group rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg" style={{ background: b.logoColor + '22' }}>
                          {b.categoryLabel.slice(0, 1)}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-gray-900 group-hover:text-indigo-700">{b.name}</div>
                          <div className="text-xs text-gray-500">{b.categoryLabel}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                        <span>창업비 {b.startupCost.toLocaleString()}만</span>
                        <span>{b.storeCount}개 매장</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="mb-6 text-h4 font-bold text-gray-900">🗺️ 지역별 브랜드 탐색</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {KOREAN_REGIONS.map((r) => {
                  const count = allBrands.filter((b) => b.hqRegion === r.key).length
                  const regionData = REGION_SHARES.find((rs) => rs.region === r.shortLabel)
                  return (
                    <a
                      key={r.key}
                      href={`/brands?tab=regions&region=${r.key}`}
                      className="group rounded-2xl border border-gray-200 bg-white p-5 text-center transition-all hover:border-indigo-300 hover:shadow-md"
                    >
                      <div className="text-2xl">📍</div>
                      <div className="mt-2 font-semibold text-gray-900 group-hover:text-indigo-700">{r.shortLabel}</div>
                      <div className="mt-0.5 text-xs text-gray-500">{count}개 브랜드</div>
                      {regionData && (
                        <div className="mt-1 text-[10px] font-semibold text-emerald-600">+{regionData.growth}% 성장</div>
                      )}
                    </a>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* ── 탭 네비게이션 ── */}
      <BrandsTabNav tab={tab} />
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
                  ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
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
          {/* Filter sidebar — inline on desktop, bottom-sheet drawer on mobile */}
          <MobileFilterDrawer>
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
          </MobileFilterDrawer>

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


      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">신규 브랜드 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">새로 등록된 가맹 브랜드·투자설명회·창업 이벤트 소식을 격주로 보내드립니다.</p>
            <NewsletterForm />
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

const REGION_OPTIONS = KOREAN_REGIONS.map((r) => r.key)

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

function BrandsTabNav({ tab }: { tab: string }) {
  const tabs = [
    { key: 'brands', href: '/brands', label: '🔍 브랜드 검색' },
    { key: 'trends', href: '/brands?tab=trends', label: '📈 시장 트렌드' },
    { key: 'regions', href: '/brands?tab=regions', label: '🗺️ 지역별 탐색' },
  ]
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="container mx-auto">
        <div className="flex gap-1 py-2">
          {tabs.map((t) => (
            <a
              key={t.key}
              href={t.href}
              className={
                'flex shrink-0 items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ' +
                (tab === t.key
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100')
              }
            >
              {t.label}
            </a>
          ))}
        </div>
      </div>
    </div>
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
