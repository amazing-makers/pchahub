import type { Metadata } from 'next'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '가맹 입점 매물',
  description: '프랜차이즈 가맹 입점용 매물 목록. 카테고리·지역별로 찾아보세요.',
  path: '/listings',
})

import { ArrowRight, Plus, Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { CATEGORIES } from '@/lib/mock-data'
import { LISTINGS } from '@/lib/mock-listings'
import { ListingCard } from '@/components/listing-card'

interface ListingsPageProps {
  searchParams: { category?: string; type?: string; region?: string; q?: string }
}

const REGION_OPTIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산']

export default function ListingsPage({ searchParams }: ListingsPageProps) {
  const active = searchParams.category
  const activeType = searchParams.type
  const activeRegion = searchParams.region
  const { q } = searchParams
  const needle = q?.toLowerCase().trim() ?? ''
  let filtered = LISTINGS
  if (active) filtered = filtered.filter((l) => l.fitCategories.includes(active))
  if (activeType === '양도' || activeType === '신규임대') {
    filtered = filtered.filter((l) => l.listingType === activeType)
  }
  if (activeRegion) {
    filtered = filtered.filter((l) => l.region === activeRegion)
  }
  if (needle) {
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(needle) ||
        l.region.toLowerCase().includes(needle) ||
        l.district.toLowerCase().includes(needle) ||
        l.fullAddress.toLowerCase().includes(needle) ||
        l.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }

  const transferCount = LISTINGS.filter((l) => l.listingType === '양도').length
  const newCount = LISTINGS.filter((l) => l.listingType === '신규임대').length

  const listJsonLd = buildItemListJsonLd({
    url: 'https://pchahub.kr/listings',
    items: filtered.slice(0, 20).map((l) => ({ name: l.title, url: `https://pchahub.kr/listings/${l.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-h3 font-bold text-gray-900">가맹 입점 매물</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                전국 양도·신규임대 매물을 검색하세요. 모든 매물은 프차허브 운영팀의 실사를 거쳐 등록됩니다.
              </p>
            </div>
            <a
              href="/listings/new"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              매물 등록
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {/* Search bar */}
        <form method="GET" action="/listings" className="mb-5 flex max-w-lg gap-2">
          {active && <input type="hidden" name="category" value={active} />}
          {activeType && <input type="hidden" name="type" value={activeType} />}
          {activeRegion && <input type="hidden" name="region" value={activeRegion} />}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              name="q"
              type="search"
              defaultValue={q ?? ''}
              placeholder="매물 제목, 지역, 태그 검색…"
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
              href={pathFor({ category: active, type: activeType, region: activeRegion })}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              초기화
            </a>
          )}
        </form>

        <div className="mb-3 flex flex-wrap gap-2 text-sm">
          <FilterChip href={pathFor({ ...searchParams, category: undefined })} active={!active}>
            전체 업종 ({LISTINGS.length})
          </FilterChip>
          {CATEGORIES.map((c) => {
            const count = LISTINGS.filter((l) => l.fitCategories.includes(c.key)).length
            if (count === 0) return null
            return (
              <FilterChip
                key={c.key}
                href={pathFor({ ...searchParams, category: c.key })}
                active={active === c.key}
              >
                {c.label} ({count})
              </FilterChip>
            )
          })}
        </div>

        <div className="mb-3 flex flex-wrap gap-2 text-sm">
          <FilterChip href={pathFor({ ...searchParams, region: undefined })} active={!activeRegion}>
            전국
          </FilterChip>
          {REGION_OPTIONS.map((r) => {
            const count = LISTINGS.filter((l) => l.region === r).length
            if (count === 0) return null
            return (
              <FilterChip
                key={r}
                href={pathFor({ ...searchParams, region: r })}
                active={activeRegion === r}
              >
                {r} ({count})
              </FilterChip>
            )
          })}
        </div>

        <div className="mb-5 flex flex-wrap gap-2 text-sm">
          <FilterChip href={pathFor({ ...searchParams, type: undefined })} active={!activeType}>
            전체 유형
          </FilterChip>
          <FilterChip href={pathFor({ ...searchParams, type: '양도' })} active={activeType === '양도'}>
            양도 ({transferCount})
          </FilterChip>
          <FilterChip
            href={pathFor({ ...searchParams, type: '신규임대' })}
            active={activeType === '신규임대'}
          >
            신규임대 ({newCount})
          </FilterChip>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-gray-500">
              조건에 맞는 매물이 없습니다. 필터를 변경해보세요.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-3 text-sm text-gray-700">
              {q ? (
                <>
                  <span className="font-medium text-gray-900">&ldquo;{q}&rdquo;</span> 검색 결과{' '}
                  {filtered.length}건
                </>
              ) : (
                <>{filtered.length}건의 매물</>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </>
        )}

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center">
          <div className="text-sm text-gray-500">매물 등록 문의</div>
          <h2 className="mt-1 text-h4 font-bold text-gray-900">양도 매물을 올려보세요</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
            가맹점 양도·신규임대 매물을 등록하면 예비 창업자에게 직접 연결됩니다. 등록비 무료.
          </p>
          <a
            href="/listings/new"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            매물 등록하기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </main>
  )
}

function pathFor(params: { category?: string; type?: string; region?: string; q?: string }): string {
  const usp = new URLSearchParams()
  if (params.category) usp.set('category', params.category)
  if (params.type) usp.set('type', params.type)
  if (params.region) usp.set('region', params.region)
  if (params.q) usp.set('q', params.q)
  const qs = usp.toString()
  return qs ? `/listings?${qs}` : '/listings'
}

function FilterChip({
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
        'rounded-full px-3 py-1.5 transition-colors ' +
        (active
          ? 'bg-gray-900 text-white'
          : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300')
      }
    >
      {children}
    </a>
  )
}
