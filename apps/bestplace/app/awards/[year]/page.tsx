import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, Trophy } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import {
  awardsByCategory,
  AVAILABLE_YEARS,
  awardsByYear,
  brandById,
  CATEGORIES,
  RANK_COLOR,
  RANK_LABEL,
  storeById,
} from '@/lib/mock-data'
import { AwardCard } from '@/components/award-card'

export function generateStaticParams() {
  return AVAILABLE_YEARS.map((y) => ({ year: String(y) }))
}

interface YearPageProps {
  params: { year: string }
  searchParams: { category?: string }
}

export function generateMetadata({ params }: YearPageProps): Metadata {
  const year = Number(params.year)
  if (!AVAILABLE_YEARS.includes(year)) return {}
  return buildPageMetadata('bestplace', {
    title: `${year} 베스트 어워드`,
    description: `${year}년 amakers 베스트 어워드. 매장 운영·점주 만족도·매출 안정성 기준 카테고리별 베스트를 선정합니다.`,
    path: `/awards/${year}`,
  })
}

export default function AwardsYearPage({ params, searchParams }: YearPageProps) {
  const year = Number(params.year)
  if (!AVAILABLE_YEARS.includes(year)) notFound()

  const allYearAwards = awardsByYear(year)
  const categoriesWithAwards = Array.from(new Set(allYearAwards.map((a) => a.category)))
    .map((key) => CATEGORIES.find((c) => c.key === key))
    .filter((c): c is { key: string; label: string } => Boolean(c))

  const activeCategory = searchParams.category
  const filteredAwards = activeCategory
    ? awardsByCategory(year, activeCategory)
    : allYearAwards

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '어워드', url: 'https://bestplace.kr/awards' },
      { name: `${year} 어워드`, url: `https://bestplace.kr/awards/${year}` },
    ],
  })
  const listJsonLd = buildItemListJsonLd({
    url: `https://bestplace.kr/awards/${year}`,
    items: filteredAwards.slice(0, 20).map((a) => {
      const store = a.representativeStoreId ? storeById(a.representativeStoreId) : undefined
      return { name: store?.name ?? a.citation, url: store ? `https://bestplace.kr/stores/${store.id}` : `https://bestplace.kr/awards/${year}` }
    }),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/awards" className="hover:text-gray-900">어워드</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{year}</span>
          </nav>
          <h1 className="mt-3 inline-flex items-center gap-2 text-h2 font-bold text-gray-900">
            <Trophy className="h-7 w-7 text-amber-500" />
            {year} 베스트 어워드
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            한 해 동안 매장 운영·점주 만족도·매출 안정성을 평가해 카테고리별 베스트를 선정합니다.
          </p>

          {/* Year tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {AVAILABLE_YEARS.map((y) => (
              <a
                key={y}
                href={`/awards/${y}`}
                className={
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ' +
                  (y === year
                    ? 'border-amber-500 bg-amber-50 text-amber-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300')
                }
              >
                {y}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
          {/* Category filter */}
          <aside className="space-y-1 lg:sticky lg:top-20 lg:self-start">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              카테고리
            </div>
            <div className="mt-2 space-y-1">
              <CategoryLink href={`/awards/${year}`} active={!activeCategory}>
                전체
              </CategoryLink>
              {categoriesWithAwards.map((c) => (
                <CategoryLink
                  key={c.key}
                  href={`/awards/${year}?category=${c.key}`}
                  active={activeCategory === c.key}
                >
                  {c.label}
                </CategoryLink>
              ))}
            </div>
          </aside>

          {/* Awards grid */}
          <div className="space-y-6">
            {filteredAwards.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-sm text-gray-500">
                  해당 카테고리 시상이 없습니다.
                </CardContent>
              </Card>
            ) : (
              groupByCategory(filteredAwards).map(([categoryKey, awards]) => {
                const category = CATEGORIES.find((c) => c.key === categoryKey)
                return (
                  <section key={categoryKey}>
                    <h2 className="mb-3 text-h4 font-semibold text-gray-900">
                      {category?.label ?? categoryKey}
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {awards.map((a) => (
                        <AwardCard key={a.id} award={a} />
                      ))}
                    </div>
                  </section>
                )
              })
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function groupByCategory<T extends { category: string }>(items: T[]): Array<[string, T[]]> {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const list = map.get(item.category) ?? []
    list.push(item)
    map.set(item.category, list)
  }
  return Array.from(map.entries())
}

function CategoryLink({
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
