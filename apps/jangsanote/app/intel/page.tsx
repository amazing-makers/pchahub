import type { Metadata } from 'next'
import { MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { IntelCard } from '@/components/intel-card'
import {
  FOOT_TRAFFIC_LABEL,
  INTEL_CATEGORY_LABEL,
  INTEL_REGIONS,
  INTELS,
  RENT_LEVEL_LABEL,
  TREND_LABEL,
  type FootTraffic,
  type IntelCategory,
  type IntelTrend,
  type RentLevel,
} from '@/lib/mock-intel'
import { getAllIntels } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '상권 인텔',
  description: '전국 자영업자·가맹점주가 직접 발로 뛰며 공유하는 상권 분석 리포트. 유동인구·임대료·트렌드를 지역·업종별로 확인하세요.',
  path: '/intel',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '장사노트', url: 'https://jangsanote.amakers.co.kr' },
    { name: '상권 인텔', url: 'https://jangsanote.amakers.co.kr/intel' },
  ],
})

const SORT_OPTIONS = [
  { key: 'latest', label: '최신 순' },
  { key: 'views', label: '조회 많은 순' },
  { key: 'likes', label: '좋아요 많은 순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

interface IntelPageProps {
  searchParams: { region?: string; category?: string; q?: string; trend?: string; traffic?: string; rent?: string; sort?: string }
}

export default async function IntelPage({ searchParams }: IntelPageProps) {
  const { region, category, q, trend, traffic, rent, sort = 'latest' } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'latest') as SortKey

  const results = await getAllIntels({ region, category, trend, traffic, rent, q, sort: activeSort })

  const listJsonLd = buildItemListJsonLd({
    url: 'https://jangsanote.amakers.co.kr/intel',
    items: results.slice(0, 20).map((i) => ({
      name: i.title,
      url: `https://jangsanote.amakers.co.kr/intel/${i.id}`,
    })),
  })

  const categoryKeys = Object.keys(INTEL_CATEGORY_LABEL) as IntelCategory[]

  function makeHref(changes: Partial<typeof searchParams>) {
    const next = { ...searchParams, ...changes }
    const params = new URLSearchParams()
    if (next.region) params.set('region', next.region)
    if (next.category) params.set('category', next.category)
    if (next.trend) params.set('trend', next.trend)
    if (next.traffic) params.set('traffic', next.traffic)
    if (next.rent) params.set('rent', next.rent)
    if (next.sort && next.sort !== 'latest') params.set('sort', next.sort)
    if (next.q) params.set('q', next.q)
    const qs = params.toString()
    return qs ? `/intel?${qs}` : '/intel'
  }

  const trendKeys = Object.keys(TREND_LABEL) as IntelTrend[]
  const trafficKeys = Object.keys(FOOT_TRAFFIC_LABEL) as FootTraffic[]
  const rentKeys = Object.keys(RENT_LEVEL_LABEL) as RentLevel[]

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />

      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-h3 font-bold text-gray-900">상권 인텔</h1>
              <p className="mt-1 text-sm text-gray-500">
                발로 뛴 점주들의 상권 분석 리포트 — 유동인구·임대료·트렌드를 지역·업종별로 확인
              </p>
            </div>
            <a
              href="/intel/new"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              <MapPin className="h-4 w-4" /> 상권 리포트 작성
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <span className="text-gray-500">
              리포트 <strong className="text-gray-900">{INTELS.length}건</strong>
            </span>
            <span className="text-gray-500">
              커버 지역 <strong className="text-gray-900">{INTEL_REGIONS.length}개</strong>
            </span>
            <span className="text-gray-500">
              총 조회 <strong className="text-gray-900">{INTELS.reduce((s, i) => s + i.views, 0).toLocaleString()}회</strong>
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* Sidebar filters */}
          <aside className="hidden lg:block lg:sticky lg:top-20 lg:self-start space-y-5">
            <FilterGroup title="지역">
              <FilterLink href={makeHref({ region: undefined })} active={!region}>전체</FilterLink>
              {INTEL_REGIONS.map((r) => (
                <FilterLink key={r} href={makeHref({ region: r })} active={region === r}>
                  {r}
                </FilterLink>
              ))}
            </FilterGroup>

            <FilterGroup title="업종">
              <FilterLink href={makeHref({ category: undefined })} active={!category}>전체</FilterLink>
              {categoryKeys.map((k) => (
                <FilterLink key={k} href={makeHref({ category: k })} active={category === k}>
                  {INTEL_CATEGORY_LABEL[k]}
                </FilterLink>
              ))}
            </FilterGroup>

            <FilterGroup title="상권 트렌드">
              <FilterLink href={makeHref({ trend: undefined })} active={!trend}>전체</FilterLink>
              {trendKeys.map((k) => (
                <FilterLink key={k} href={makeHref({ trend: k })} active={trend === k}>
                  {TREND_LABEL[k]}
                </FilterLink>
              ))}
            </FilterGroup>

            <FilterGroup title="유동인구">
              <FilterLink href={makeHref({ traffic: undefined })} active={!traffic}>전체</FilterLink>
              {trafficKeys.map((k) => (
                <FilterLink key={k} href={makeHref({ traffic: k })} active={traffic === k}>
                  {FOOT_TRAFFIC_LABEL[k]}
                </FilterLink>
              ))}
            </FilterGroup>

            <FilterGroup title="임대료">
              <FilterLink href={makeHref({ rent: undefined })} active={!rent}>전체</FilterLink>
              {rentKeys.map((k) => (
                <FilterLink key={k} href={makeHref({ rent: k })} active={rent === k}>
                  {RENT_LEVEL_LABEL[k]}
                </FilterLink>
              ))}
            </FilterGroup>
          </aside>

          {/* Main content */}
          <div>
            {/* Search */}
            <form method="GET" action="/intel" className="mb-5 flex gap-2">
              {region && <input type="hidden" name="region" value={region} />}
              {category && <input type="hidden" name="category" value={category} />}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  name="q"
                  type="search"
                  defaultValue={q ?? ''}
                  placeholder="지역명, 업종, 키워드 검색…"
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                style={{ background: 'var(--brand-primary)' }}
              >
                검색
              </button>
            </form>

            {/* Mobile category chips */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              <a
                href={makeHref({ category: undefined })}
                className={
                  'shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ' +
                  (!category ? 'text-white' : 'border-gray-200 text-gray-600')
                }
                style={!category ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : undefined}
              >
                전체
              </a>
              {categoryKeys.map((k) => (
                <a
                  key={k}
                  href={makeHref({ category: k })}
                  className={
                    'shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ' +
                    (category === k ? 'text-white' : 'border-gray-200 text-gray-600')
                  }
                  style={category === k ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : undefined}
                >
                  {INTEL_CATEGORY_LABEL[k]}
                </a>
              ))}
            </div>

            {/* Sort + advanced filter chips */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              {SORT_OPTIONS.map((o) => {
                const isActive = activeSort === o.key
                return (
                  <a
                    key={o.key}
                    href={makeHref({ sort: o.key })}
                    className={'rounded-full px-3 py-1 text-xs font-medium transition-colors ' + (isActive ? 'text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50')}
                    style={isActive ? { background: 'var(--brand-primary)' } : undefined}
                  >
                    {o.label}
                  </a>
                )
              })}
              {(trend || traffic || rent) && (
                <a href={makeHref({ trend: undefined, traffic: undefined, rent: undefined })} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500 hover:bg-gray-50">
                  고급 필터 초기화
                </a>
              )}
            </div>
            <div className="mb-3 text-sm font-semibold text-gray-700">
              {results.length}건
              {(region || category || trend || traffic || rent || q) && (
                <a href="/intel" className="ml-2 text-xs font-normal text-gray-400 underline">
                  전체 초기화
                </a>
              )}
            </div>

            {results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                <MapPin className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">조건에 맞는 리포트가 없습니다</p>
                <a href="/intel/new" className="mt-4 inline-block rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  첫 번째 리포트 작성하기
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((i) => (
                  <IntelCard key={i.id} intel={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</div>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  )
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={'block rounded-md px-3 py-1.5 text-sm transition-colors ' + (active ? 'text-white' : 'text-gray-700 hover:bg-gray-100')}
      style={active ? { background: 'var(--brand-primary)' } : undefined}
    >
      {children}
    </a>
  )
}
