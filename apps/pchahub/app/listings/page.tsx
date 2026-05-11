import { ArrowRight, Plus } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { CATEGORIES } from '@/lib/mock-data'
import { LISTINGS } from '@/lib/mock-listings'
import { ListingCard } from '@/components/listing-card'

interface ListingsPageProps {
  searchParams: { category?: string; type?: string }
}

export default function ListingsPage({ searchParams }: ListingsPageProps) {
  const active = searchParams.category
  const activeType = searchParams.type
  let filtered = LISTINGS
  if (active) filtered = filtered.filter((l) => l.fitCategories.includes(active))
  if (activeType === '양도' || activeType === '신규임대') {
    filtered = filtered.filter((l) => l.listingType === activeType)
  }

  const transferCount = LISTINGS.filter((l) => l.listingType === '양도').length
  const newCount = LISTINGS.filter((l) => l.listingType === '신규임대').length

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-h3 font-bold text-gray-900">가맹 입점 매물</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                전국 양도·신규임대 매물을 검색하세요. 모든 매물은 amakers 운영팀의 실사를 거쳐 등록됩니다.
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
        <div className="mb-3 flex flex-wrap gap-2 text-sm">
          <FilterChip href={pathFor(undefined, activeType)} active={!active}>
            전체 업종 ({LISTINGS.length})
          </FilterChip>
          {CATEGORIES.map((c) => {
            const count = LISTINGS.filter((l) => l.fitCategories.includes(c.key)).length
            if (count === 0) return null
            return (
              <FilterChip
                key={c.key}
                href={pathFor(c.key, activeType)}
                active={active === c.key}
              >
                {c.label} ({count})
              </FilterChip>
            )
          })}
        </div>

        <div className="mb-5 flex flex-wrap gap-2 text-sm">
          <FilterChip href={pathFor(active, undefined)} active={!activeType}>
            전체 유형
          </FilterChip>
          <FilterChip href={pathFor(active, '양도')} active={activeType === '양도'}>
            양도 ({transferCount})
          </FilterChip>
          <FilterChip href={pathFor(active, '신규임대')} active={activeType === '신규임대'}>
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
            <div className="mb-3 text-sm text-gray-700">{filtered.length}건의 매물</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </>
        )}

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center">
          <div className="text-sm text-gray-500">전국 부동산 매물 + 상권 분석</div>
          <h2 className="mt-1 text-h4 font-bold text-gray-900">더명당에서 상권 분석까지</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
            가맹 입점 외 일반 상가 매물, 상권 분석, 안전 거래까지 부동산 전문 서비스는 더명당에서 제공합니다.
          </p>
          <a
            href="https://themyungdang.kr"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            더명당으로 이동 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </main>
  )
}

function pathFor(category: string | undefined, type: string | undefined): string {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (type) params.set('type', type)
  const qs = params.toString()
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
