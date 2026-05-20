import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, Clock } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import {
  buildArticleJsonLd,
  buildBreadcrumbsJsonLd,
  buildPageMetadata,
  JsonLd,
} from '@amakers/design-system'
import { ARTICLES, articleById } from '@/lib/mock-data'
import { ArticleCard } from '@/components/article-card'
import { ArticleActions } from './article-actions'
import { ArticleViewTracker } from './article-view-tracker'
import { SaveArticleButton } from './save-article-button'
import { ReadingProgress } from './reading-progress'

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ id: a.id }))
}

interface ArticleDetailProps {
  params: { id: string }
}

export function generateMetadata({ params }: ArticleDetailProps): Metadata {
  const article = articleById(params.id)
  if (!article) return {}
  return buildPageMetadata('changupdocu', {
    title: article.title,
    description: `${article.subtitle} · ${article.authorName} (${article.authorRole}) · ${article.readTime}분 읽기.`,
    path: `/magazine/${article.id}`,
    openGraphType: 'article',
    publishedTime: article.publishedAt,
    authors: [article.authorName],
  })
}

export default function ArticleDetailPage({ params }: ArticleDetailProps) {
  const article = articleById(params.id)
  if (!article) notFound()
  const related = ARTICLES.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3)

  const articleUrl = `https://changupdocu.amakers.co.kr/magazine/${article.id}`
  const articleJsonLd = buildArticleJsonLd({
    headline: article.title,
    description: article.subtitle,
    url: articleUrl,
    image: article.coverImage,
    authorName: article.authorName,
    authorRole: article.authorRole,
    publishedAt: article.publishedAt,
    publisher: { name: '창업다큐', url: 'https://changupdocu.amakers.co.kr' },
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '매거진', url: 'https://changupdocu.amakers.co.kr/magazine' },
      { name: article.category, url: 'https://changupdocu.amakers.co.kr/magazine' },
      { name: article.title, url: articleUrl },
    ],
  })

  return (
    <main className="bg-white">
      <ReadingProgress />
      <ArticleViewTracker articleId={article.id} />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* Hero cover */}
      <div className="relative h-72 w-full overflow-hidden bg-gray-100 sm:h-96">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/30" />
      </div>

      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-8">
          {/* 브레드크럼 */}
          <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-900">홈</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <a href="/magazine" className="hover:text-gray-900">매거진</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate font-medium text-gray-900">{article.title}</span>
          </nav>

          <div className="mt-4 mx-auto max-w-3xl">
            <Badge variant="primary">{article.category}</Badge>
            <h1 className="mt-3 text-h2 font-bold text-gray-900">{article.title}</h1>
            <p className="mt-2 text-base text-gray-700">{article.subtitle}</p>

            <div className="mt-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {article.authorAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.authorAvatar}
                    alt={article.authorName}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = 'none'
                      const fallback = target.nextElementSibling as HTMLElement | null
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className="h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ background: 'var(--brand-primary)', display: article.authorAvatar ? 'none' : 'flex' }}
                  aria-hidden="true"
                >
                  {article.authorName.slice(0, 1)}
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
          <div className="mt-8 border-t border-gray-100 pt-6 flex items-center gap-3">
            <ArticleActions articleId={article.id} title={article.title} />
            <SaveArticleButton articleId={article.id} />
          </div>

          {/* Author bio */}
          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <div className="flex items-start gap-4">
              {article.authorAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.authorAvatar}
                  alt={article.authorName}
                  className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  {article.authorName.slice(0, 1)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">글쓴이</div>
                <div className="mt-1 text-base font-bold text-gray-900">{article.authorName}</div>
                <div className="text-sm text-gray-500">{article.authorRole}</div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  창업다큐 에디터로 자영업·프랜차이즈 현장을 취재하고 있습니다. 성공과 실패의 교차점에서 실제 이야기를 전합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* 뉴스레터 CTA */}
      <section className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-10">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-2 text-h4 font-bold text-gray-900">창업다큐 뉴스레터</h2>
            <p className="mt-1 text-sm text-gray-500">매주 창업 현장 이야기·트렌드 분석을 받아보세요.</p>
            <form action="#" className="mt-5 flex gap-2">
              <input
                type="email"
                placeholder="이메일 주소"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                구독
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-400">언제든 구독 해제 가능</p>
          </div>
        </div>
      </section>

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
