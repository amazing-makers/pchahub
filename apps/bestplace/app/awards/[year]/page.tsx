import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, Megaphone, Store, Trophy, Wrench } from 'lucide-react'
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

  const yearIndex = AVAILABLE_YEARS.indexOf(year)
  const prevYear = yearIndex > 0 ? AVAILABLE_YEARS[yearIndex - 1] : null
  const nextYear = yearIndex < AVAILABLE_YEARS.length - 1 ? AVAILABLE_YEARS[yearIndex + 1] : null

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
      { name: '어워드', url: 'https://bestplace.amakers.co.kr/awards' },
      { name: `${year} 어워드`, url: `https://bestplace.amakers.co.kr/awards/${year}` },
    ],
  })
  const listJsonLd = buildItemListJsonLd({
    url: `https://bestplace.amakers.co.kr/awards/${year}`,
    items: filteredAwards.slice(0, 20).map((a) => {
      const store = a.representativeStoreId ? storeById(a.representativeStoreId) : undefined
      return { name: store?.name ?? a.citation, url: store ? `https://bestplace.amakers.co.kr/stores/${store.id}` : `https://bestplace.amakers.co.kr/awards/${year}` }
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

          {/* Stats summary row */}
          <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-3 max-w-lg">
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center">
              <div className="text-xl font-black tracking-tight text-amber-900">{allYearAwards.length}</div>
              <div className="mt-0.5 text-xs text-amber-700">총 시상 수</div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center">
              <div className="text-xl font-black tracking-tight text-amber-900">{categoriesWithAwards.length}</div>
              <div className="mt-0.5 text-xs text-amber-700">참여 업종</div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center">
              <div className="text-xl font-black tracking-tight text-amber-900">
                {allYearAwards.filter((a) => a.rank === 1).length}
              </div>
              <div className="mt-0.5 text-xs text-amber-700">대상 수상</div>
            </div>
          </div>

          {/* Year navigation + tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {prevYear ? (
              <a
                href={`/awards/${prevYear}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
                aria-label={`${prevYear}년 어워드`}
              >
                <ChevronLeft className="h-4 w-4" />
              </a>
            ) : (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-300" aria-hidden>
                <ChevronLeft className="h-4 w-4" />
              </span>
            )}
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
            {nextYear ? (
              <a
                href={`/awards/${nextYear}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
                aria-label={`${nextYear}년 어워드`}
              >
                <ChevronRight className="h-4 w-4" />
              </a>
            ) : (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-300" aria-hidden>
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
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

      {/* amakers 생태계 크로스링크 */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-8">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                amakers에서 더 알아보기
              </div>
              <p className="mt-1 text-sm text-gray-600">
                수상 매장을 운영하는 브랜드 정보, 인테리어·마케팅·운영 노하우를 함께 확인하세요.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <a
                  href="https://pchahub.amakers.co.kr/brands"
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5 text-indigo-500" />
                    가맹 브랜드 비교
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a
                  href="https://gongganhansu.amakers.co.kr/quote"
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-slate-500" />
                    매장 인테리어 견적
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a
                  href="https://openrun.amakers.co.kr/services"
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Megaphone className="h-3.5 w-3.5 text-rose-500" />
                    오픈런 마케팅 캠페인
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a
                  href="https://themanual.amakers.co.kr/knowhow"
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-amber-600" />
                    매장 운영 노하우
                  </span>
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">어워드 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">우수 매장 어워드·수상 매장 인터뷰·연간 베스트 리포트를 격주로 보내드립니다.</p>
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
