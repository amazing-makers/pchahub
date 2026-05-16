import type { Metadata } from 'next'
import { ArticleCard } from '@/components/article-card'
import { ARTICLES } from '@/lib/mock-data'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('changupdocu', {
  title: '매거진',
  description: '현장에서 길어 올린 분석과 인사이트. 회계사·변호사·컨설턴트·점주가 함께 쓰는 글.',
  path: '/magazine',
})

interface MagazinePageProps {
  searchParams: { category?: string }
}

export default function MagazinePage({ searchParams }: MagazinePageProps) {
  const { category } = searchParams

  const allArticles = [...ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  // 고유 카테고리 목록 추출
  const categories = Array.from(new Set(allArticles.map((a) => a.category))).sort()

  const filtered = category ? allArticles.filter((a) => a.category === category) : allArticles
  const featured = filtered.filter((a) => a.featured)
  const rest = filtered.filter((a) => !a.featured)

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">
            {category ? `${category} 매거진` : '매거진'}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            현장에서 길어 올린 분석과 인사이트. 회계사·변호사·컨설턴트·점주가 함께 쓰는 글.
          </p>

          {/* 카테고리 필터 칩 */}
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="/magazine"
              className={
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                (!category
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
              }
            >
              전체 ({allArticles.length})
            </a>
            {categories.map((c) => {
              const count = allArticles.filter((a) => a.category === c).length
              return (
                <a
                  key={c}
                  href={`/magazine?category=${encodeURIComponent(c)}`}
                  className={
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                    (category === c
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }
                >
                  {c} ({count})
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto space-y-8 py-8">
        {featured.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">추천</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {featured.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-h4 font-semibold text-gray-900">
              {category ? category : '전체 매거진'}
            </h2>
            <span className="text-sm text-gray-500">{rest.length}편</span>
          </div>
          {rest.length === 0 && featured.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
              <p className="text-sm font-medium text-gray-500">해당 카테고리의 글이 없습니다</p>
              <a
                href="/magazine"
                className="mt-4 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                전체 보기
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rest.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
