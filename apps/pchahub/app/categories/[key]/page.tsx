import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, TrendingUp, Users, Wallet } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { Search } from 'lucide-react'
import { BrandCard } from '@/components/brand-card'
import { CATEGORIES, compareBrandsRecommended } from '@/lib/mock-data'
import { getBrands } from '@/lib/kftc/source'

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ key: c.key }))
}

export const revalidate = 3600

interface CategoryPageProps {
  params: { key: string }
  searchParams: { sort?: string; q?: string }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = CATEGORIES.find((c) => c.key === params.key)
  if (!category) return {}
  const allBrands = await getBrands()
  const brandCount = allBrands.filter((b) => b.category === category.key).length
  return buildPageMetadata('pchahub', {
    title: `${category.label} 가맹 브랜드 ${brandCount}개`,
    description: `공정거래위원회 가맹정보 기준 ${category.label} 카테고리 가맹 브랜드 ${brandCount}곳. 평균 창업비·매장 수·성장률 비교 + 추천.`,
    path: `/categories/${category.key}`,
  })
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = CATEGORIES.find((c) => c.key === params.key)
  if (!category) notFound()

  const allBrands = await getBrands()
  const { q } = searchParams
  const needle = q?.toLowerCase().trim() ?? ''
  const sort = searchParams.sort ?? 'recommended'

  const categoryBrands = allBrands.filter((b) => b.category === category.key)
  const brands = needle
    ? categoryBrands.filter((b) => b.name.toLowerCase().includes(needle))
    : categoryBrands

  const sorted = [...brands].sort((a, b) => {
    switch (sort) {
      case 'cost-asc':
        return a.startupCost - b.startupCost
      case 'cost-desc':
        return b.startupCost - a.startupCost
      case 'stores-desc':
        return b.storeCount - a.storeCount
      case 'growth-desc':
        return b.growthRate - a.growthRate
      default:
        return compareBrandsRecommended(a, b)
    }
  })

  const stats = computeCategoryStats(categoryBrands)

  const categoryUrl = `https://pchahub.kr/categories/${category.key}`
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '브랜드 검색', url: 'https://pchahub.kr/brands' },
      { name: category.label, url: categoryUrl },
    ],
  })
  const listJsonLd = buildItemListJsonLd({
    url: categoryUrl,
    items: sorted.slice(0, 20).map((b) => ({ name: b.name, url: `https://pchahub.kr/brands/${b.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/brands" className="hover:text-gray-900">브랜드 검색</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{category.label}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-h2 font-bold text-gray-900">{category.label} 가맹 브랜드</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-500">
                협회 등록 정보공개서 기준 {category.label} 카테고리 가맹 브랜드 {categoryBrands.length}곳을
                한눈에 확인하세요.
              </p>
            </div>
          </div>

          <form
            method="GET"
            action={`/categories/${category.key}`}
            className="mt-4 flex max-w-md gap-2"
          >
            <input type="hidden" name="sort" value={sort} />
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="브랜드명 검색…"
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
                href={`/categories/${category.key}?sort=${sort}`}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <CategoryStat
              icon={Users}
              label="브랜드"
              value={`${brands.length}개`}
              sub="협회 등록 기준"
            />
            <CategoryStat
              icon={Wallet}
              label="평균 창업비"
              value={`${formatNumber(stats.avgStartupCost)}만`}
              sub={`${formatNumber(stats.minStartupCost)}만 ~ ${formatNumber(stats.maxStartupCost)}만`}
            />
            <CategoryStat
              icon={Users}
              label="평균 매장 수"
              value={`${formatNumber(stats.avgStoreCount)}개`}
              sub={`총 ${formatNumber(stats.totalStores)}개 매장`}
            />
            <CategoryStat
              icon={TrendingUp}
              label="평균 성장률"
              value={`+${stats.avgGrowth}%`}
              sub="연간 매장 증가율"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-700">
            {q ? (
              <>
                <span className="font-medium text-gray-900">&ldquo;{q}&rdquo;</span> 검색 결과{' '}
                {brands.length}개
              </>
            ) : (
              <>{brands.length}개 브랜드</>
            )}
          </h2>
          <div className="flex flex-wrap gap-1.5 text-sm">
            {SORT_OPTIONS.map((s) => {
              const active = sort === s.key
              const baseHref = s.key === 'growth-desc'
                ? `/categories/${category.key}`
                : `/categories/${category.key}?sort=${s.key}`
              return (
                <a
                  key={s.key}
                  href={`${baseHref}${q ? `${baseHref.includes('?') ? '&' : '?'}q=${encodeURIComponent(q)}` : ''}`}
                  className={
                    'rounded-md px-3 py-1 transition-colors ' +
                    (active
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }
                >
                  {s.label}
                </a>
              )
            })}
          </div>
        </div>

        {sorted.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-gray-500">
              아직 등록된 브랜드가 없습니다.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((b) => (
              <BrandCard key={b.id} brand={b} />
            ))}
          </div>
        )}

        <Card className="mt-10 border-gray-200 bg-indigo-50">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold text-gray-900">
              {category.label} 창업, 어디서부터 시작할지 모르겠다면
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              7개 질문으로 본인의 자본·운영 조건에 가장 잘 맞는 {category.label} 브랜드를 추천해 드립니다.
              협회 정보공개서 데이터 기반으로 점수화되어 객관적입니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`/scanner?category=${category.key}`}
                className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                창업 스캐너 시작
              </a>
              <a
                href={`/calculator?category=${category.key}`}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                수익 계산해보기
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

const SORT_OPTIONS = [
  { key: 'growth-desc', label: '성장률순' },
  { key: 'cost-asc', label: '창업비 낮은순' },
  { key: 'cost-desc', label: '창업비 높은순' },
  { key: 'stores-desc', label: '매장 많은순' },
]

function computeCategoryStats(brands: { startupCost: number; storeCount: number; growthRate: number }[]) {
  if (brands.length === 0) {
    return {
      avgStartupCost: 0,
      minStartupCost: 0,
      maxStartupCost: 0,
      avgStoreCount: 0,
      totalStores: 0,
      avgGrowth: 0,
    }
  }
  const costs = brands.map((b) => b.startupCost)
  const stores = brands.map((b) => b.storeCount)
  const totalStores = stores.reduce((a, b) => a + b, 0)
  const growths = brands.map((b) => b.growthRate)
  return {
    avgStartupCost: Math.round(costs.reduce((a, b) => a + b, 0) / brands.length),
    minStartupCost: Math.min(...costs),
    maxStartupCost: Math.max(...costs),
    avgStoreCount: Math.round(totalStores / brands.length),
    totalStores,
    avgGrowth: Math.round(growths.reduce((a, b) => a + b, 0) / brands.length),
  }
}

function CategoryStat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Users
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <Icon className="h-4 w-4 text-gray-400" />
      <div className="mt-2 text-xs text-gray-500">{label}</div>
      <div className="mt-0.5 text-base font-bold text-gray-900">{value}</div>
      <div className="mt-0.5 text-xs text-gray-500">{sub}</div>
    </div>
  )
}
