import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'
import { ArrowRight, MessageCircle, ThumbsUp } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import {
  FRANCHISEE_QAS,
  QA_CATEGORIES,
  type FranchiseeQA,
} from '@/lib/franchisee-qa-data'
import { BrandSelect } from './brand-select'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '가맹점주 Q&A',
  description: '현직 가맹점주들이 직접 답하는 솔직한 창업 Q&A.',
  path: '/franchisee-qa',
})

const SORT_OPTIONS = [
  { key: 'helpful', label: '도움됨 순' },
  { key: 'latest', label: '최신 순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

interface PageProps {
  searchParams: {
    category?: string
    brand?: string
    sort?: string
  }
}

export default function FranchiseeQAPage({ searchParams }: PageProps) {
  const { category, brand, sort = 'helpful' } = searchParams
  const activeSort: SortKey = sort === 'latest' ? 'latest' : 'helpful'

  // Filter
  let results: FranchiseeQA[] = FRANCHISEE_QAS
  if (category) results = results.filter((q) => q.category === category)
  if (brand) results = results.filter((q) => q.brandName === brand)

  // Sort
  if (activeSort === 'helpful') {
    results = [...results].sort((a, b) => b.helpful - a.helpful)
  } else {
    results = [...results].sort((a, b) => b.answeredAt.localeCompare(a.answeredAt))
  }

  const uniqueBrands = Array.from(new Set(FRANCHISEE_QAS.map((q) => q.brandName))).sort()

  function makeHref(changes: Partial<PageProps['searchParams']>) {
    const next = { category, brand, sort, ...changes }
    const params = new URLSearchParams()
    if (next.category) params.set('category', next.category)
    if (next.brand) params.set('brand', next.brand)
    if (next.sort && next.sort !== 'helpful') params.set('sort', next.sort)
    const qs = params.toString()
    return qs ? `/franchisee-qa?${qs}` : '/franchisee-qa'
  }

  return (
    <main className="bg-gray-50 pb-24">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-10 text-center">
          <p className="mb-2 text-sm font-semibold tracking-widest text-indigo-600 uppercase">
            가맹점주 Q&A
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            가맹점주가 직접 답하는 솔직한 Q&A
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500">
            <strong className="text-gray-700">20개 답변</strong> · 현직 가맹점주 직접 답변 ·
            계약·수익·운영·리스크 모두 솔직하게
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white shadow-sm">
        <div className="container mx-auto py-3">
          {/* Category chips */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={makeHref({ category: undefined, brand: undefined })}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                !category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체
            </a>
            {QA_CATEGORIES.map((cat) => (
              <a
                key={cat}
                href={makeHref({ category: cat })}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </a>
            ))}

            {/* Brand dropdown */}
            <div className="ml-auto flex items-center gap-2">
              <BrandSelect
                brands={uniqueBrands}
                currentBrand={brand}
                currentCategory={category}
                currentSort={sort}
              />

              {/* Sort */}
              <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden text-sm">
                {SORT_OPTIONS.map((opt) => (
                  <a
                    key={opt.key}
                    href={makeHref({ sort: opt.key })}
                    className={`px-3 py-1.5 transition-colors ${
                      activeSort === opt.key
                        ? 'bg-indigo-50 font-semibold text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="container mx-auto pt-6 pb-2">
        <p className="text-sm text-gray-500">
          {category ? (
            <span>
              <strong className="text-gray-900">{category}</strong> 카테고리{' '}
            </span>
          ) : null}
          {results.length}개 답변
        </p>
      </div>

      {/* Q&A cards */}
      <div className="container mx-auto py-4">
        {results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <MessageCircle className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">해당 조건의 Q&A가 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((qa) => (
              <QACard key={qa.id} qa={qa} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function QACard({ qa }: { qa: FranchiseeQA }) {
  return (
    <a href={`/franchisee-qa/${qa.id}`} className="group block">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardContent className="flex h-full flex-col p-5">
          {/* Badges */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            <CategoryBadge category={qa.category} />
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {qa.brandCategory}
            </span>
            {qa.featured && (
              <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-bold text-yellow-700">
                추천
              </span>
            )}
          </div>

          {/* Question */}
          <p className="mb-2 text-sm font-bold leading-snug text-gray-900 group-hover:text-indigo-700 line-clamp-2">
            Q. {qa.question}
          </p>

          {/* Truncated answer */}
          <p className="flex-1 text-xs leading-relaxed text-gray-500 line-clamp-2">
            {qa.answer}
          </p>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs text-gray-400">{qa.answererProfile}</span>
            <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
              <ThumbsUp className="h-3.5 w-3.5" />
              {qa.helpful}
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}

function CategoryBadge({ category }: { category: string }) {
  const colorMap: Record<string, string> = {
    '계약 조건': 'bg-blue-100 text-blue-700',
    수익성: 'bg-green-100 text-green-700',
    '본사 지원': 'bg-purple-100 text-purple-700',
    '운영 실무': 'bg-orange-100 text-orange-700',
    리스크: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorMap[category] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {category}
    </span>
  )
}
