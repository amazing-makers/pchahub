import { ArticleCard } from '@/components/article-card'
import { ARTICLES } from '@/lib/mock-data'

export default function MagazinePage() {
  const all = [...ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  const featured = all.filter((a) => a.featured)
  const rest = all.filter((a) => !a.featured)

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">매거진</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            현장에서 길어 올린 분석과 인사이트. 회계사·변호사·컨설턴트·점주가 함께 쓰는 글.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-8">
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
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">전체 매거진</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rest.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
