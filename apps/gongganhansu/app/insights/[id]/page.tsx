import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, ChevronRight, Clock, MapPin, Store, Wrench } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import {
  buildArticleJsonLd,
  buildBreadcrumbsJsonLd,
  buildPageMetadata,
  JsonLd,
} from '@amakers/design-system'
import { INSIGHTS, insightById } from '@/lib/mock-data'
import { InsightCard } from '@/components/insight-card'
import { SaveInsightButton } from './save-insight-button'

export function generateStaticParams() {
  return INSIGHTS.map((i) => ({ id: i.id }))
}

interface InsightDetailProps {
  params: { id: string }
}

export function generateMetadata({ params }: InsightDetailProps): Metadata {
  const ins = insightById(params.id)
  if (!ins) return {}
  return buildPageMetadata('gongganhansu', {
    title: `${ins.title} — 한 수 인사이트`,
    description: `${ins.subtitle} · ${ins.authorName} · ${ins.readTime}분 읽기.`,
    path: `/insights/${ins.id}`,
    openGraphType: 'article',
    publishedTime: ins.publishedAt,
    authors: [ins.authorName],
  })
}

export default function InsightDetailPage({ params }: InsightDetailProps) {
  const ins = insightById(params.id)
  if (!ins) notFound()
  const related = INSIGHTS.filter((i) => i.id !== ins.id).slice(0, 3)

  const insightUrl = `https://gongganhansu.amakers.co.kr/insights/${ins.id}`
  const articleJsonLd = buildArticleJsonLd({
    headline: ins.title,
    description: ins.subtitle,
    url: insightUrl,
    authorName: ins.authorName,
    authorRole: ins.authorRole,
    publishedAt: ins.publishedAt,
    publisher: { name: '공간의한수', url: 'https://gongganhansu.amakers.co.kr' },
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '인사이트', url: 'https://gongganhansu.amakers.co.kr/insights' },
      { name: ins.title, url: insightUrl },
    ],
  })

  return (
    <main className="bg-white">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbs} />
      <div
        className="h-56 w-full sm:h-72"
        style={{
          background: `linear-gradient(135deg, ${ins.coverColors[0]}, ${ins.coverColors[1] ?? ins.coverColors[0]})`,
        }}
        aria-hidden
      />

      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/insights" className="hover:text-gray-900">인사이트</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700 line-clamp-1">{ins.title}</span>
          </nav>

          <div className="mx-auto mt-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{ins.category}</Badge>
            </div>
            <h1 className="mt-3 text-h2 font-bold text-gray-900">{ins.title}</h1>
            <p className="mt-2 text-base text-gray-700">{ins.subtitle}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: ins.authorAvatarColor }}
                aria-hidden
              >
                {ins.authorName.charAt(0)}
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">{ins.authorName}</div>
                <div className="text-xs text-gray-500">{ins.authorRole}</div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {ins.readTime}분 · {ins.publishedAt}
              </span>
              <div className="ml-auto">
                <SaveInsightButton insightId={ins.id} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <article className="container mx-auto py-10">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-5 text-lg leading-relaxed text-gray-800">
            {ins.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <Card className="mt-10 border-slate-200 bg-slate-50">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-slate-900">핵심 정리</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-800">
                {ins.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-700" />
                    {kp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {ins.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-1.5">
              {ins.tags.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* amakers 생태계 크로스링크 */}
          <Card className="mt-10 border-gray-200 bg-gray-50">
            <CardContent className="p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                amakers에서 더 알아보기
              </div>
              <p className="mt-1 text-sm text-gray-600">
                이 인사이트와 관련된 브랜드·매물·커뮤니티 정보를 확인하세요.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <a
                  href={`https://pchahub.amakers.co.kr/brands?q=${encodeURIComponent(ins.tags[0] ?? '')}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5 text-indigo-500" />
                    가맹 브랜드 보기
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a
                  href="https://gongganhansu.amakers.co.kr/quote"
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-slate-500" />
                    무료 견적 받기
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a
                  href="https://themyungdang.amakers.co.kr/listings"
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                    입점 매물 찾기
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto">
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">다른 인사이트</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <InsightCard key={r.id} insight={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
