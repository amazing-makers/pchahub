import { notFound } from 'next/navigation'
import { ChevronRight, Clock, Share2, ThumbsUp } from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { ARTICLES, articleById } from '@/lib/mock-data'
import { ArticleCard } from '@/components/article-card'

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ id: a.id }))
}

interface ArticleDetailProps {
  params: { id: string }
}

export default function ArticleDetailPage({ params }: ArticleDetailProps) {
  const article = articleById(params.id)
  if (!article) notFound()
  const related = ARTICLES.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3)

  return (
    <main className="bg-white">
      {/* Hero cover */}
      <div
        className="relative h-56 w-full sm:h-72"
        style={{
          background: `linear-gradient(135deg, ${article.coverColors[0]}, ${article.coverColors[1] ?? article.coverColors[0]})`,
        }}
        aria-hidden
      />

      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/magazine" className="hover:text-gray-900">매거진</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700 line-clamp-1">{article.title}</span>
          </nav>

          <div className="mt-4 mx-auto max-w-3xl">
            <Badge variant="primary">{article.category}</Badge>
            <h1 className="mt-3 text-h2 font-bold text-gray-900">{article.title}</h1>
            <p className="mt-2 text-base text-gray-700">{article.subtitle}</p>

            <div className="mt-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: article.authorAvatarColor }}
                  aria-hidden
                >
                  {article.authorName.charAt(0)}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{article.authorName}</div>
                  <div className="text-xs text-gray-500">{article.authorRole}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readTime}분
                </span>
                <span>· {article.publishedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <article className="container mx-auto py-10">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-5 text-lg leading-relaxed text-gray-800">
            {article.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Key points */}
          <Card className="mt-10 border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-amber-900">핵심 정리</h3>
              <ul className="mt-3 space-y-2 text-sm text-amber-900">
                {article.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" />
                    {kp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-1.5">
              {article.tags.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex items-center gap-2 border-t border-gray-100 pt-6">
            <Button size="sm" variant="outline" className="gap-1">
              <ThumbsUp className="h-3.5 w-3.5" /> 좋아요
            </Button>
            <Button size="sm" variant="ghost" className="gap-1 text-gray-600">
              <Share2 className="h-3.5 w-3.5" /> 공유
            </Button>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto">
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              같은 카테고리의 매거진
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <ArticleCard key={r.id} article={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
