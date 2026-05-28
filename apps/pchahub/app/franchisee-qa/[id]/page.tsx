import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@amakers/design-system'
import { ArrowLeft, Calendar, Tag, ThumbsUp, User } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { FRANCHISEE_QAS, type FranchiseeQA } from '@/lib/franchisee-qa-data'

interface PageProps {
  params: { id: string }
}

export function generateStaticParams() {
  return FRANCHISEE_QAS.map((qa) => ({ id: qa.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const qa = FRANCHISEE_QAS.find((q) => q.id === params.id)
  if (!qa) return {}
  return buildPageMetadata('pchahub', {
    title: `${qa.question.slice(0, 40)}… — 가맹점주 Q&A`,
    description: qa.answer.slice(0, 120),
    path: `/franchisee-qa/${qa.id}`,
  })
}

export default function FranchiseeQADetailPage({ params }: PageProps) {
  const qa = FRANCHISEE_QAS.find((q) => q.id === params.id)
  if (!qa) notFound()

  const related = FRANCHISEE_QAS.filter(
    (q) => q.category === qa.category && q.id !== qa.id,
  ).slice(0, 3)

  return (
    <main className="bg-gray-50 pb-24">
      <div className="container mx-auto py-8">
        <a
          href="/franchisee-qa"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          가맹점주 Q&A 목록
        </a>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-6">
            {/* Category + brand badges */}
            <div className="flex flex-wrap gap-2">
              <CategoryBadge category={qa.category} />
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {qa.brandCategory}
              </span>
              <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {qa.brandName}
              </span>
            </div>

            {/* Question */}
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                질문
              </p>
              <h1 className="text-2xl font-bold leading-snug text-gray-900">
                Q. {qa.question}
              </h1>
              <p className="mt-1 text-sm text-gray-500">{qa.questionerRole} 질문</p>
            </div>

            {/* Answer */}
            <Card>
              <CardContent className="p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-indigo-500">
                  가맹점주 답변
                </p>
                <p className="text-base leading-relaxed text-gray-800">{qa.answer}</p>

                {/* Helpful */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {qa.helpful}명에게 도움됨
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Answerer profile box */}
            <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-200 text-indigo-800">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{qa.answererProfile}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {qa.answeredAt} 답변
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {qa.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                {qa.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar — related Q&As */}
          {related.length > 0 && (
            <aside>
              <h2 className="mb-3 text-sm font-bold text-gray-700">
                같은 카테고리 Q&A ({qa.category})
              </h2>
              <div className="space-y-3">
                {related.map((r) => (
                  <a key={r.id} href={`/franchisee-qa/${r.id}`} className="group block">
                    <Card className="transition-shadow group-hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="mb-1.5 flex gap-1.5">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            {r.brandName}
                          </span>
                        </div>
                        <p className="text-sm font-semibold leading-snug text-gray-800 group-hover:text-indigo-700 line-clamp-2">
                          Q. {r.question}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                          <ThumbsUp className="h-3 w-3" />
                          {r.helpful}
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a
                  href={`/franchisee-qa?category=${encodeURIComponent(qa.category)}`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  {qa.category} Q&A 모두 보기 →
                </a>
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
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
