import type { Metadata } from 'next'
import { ArrowLeft, Clock } from 'lucide-react'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { InsightCard } from '@/components/insight-card'
import { INSIGHT_CATEGORY_LABEL, INSIGHTS, insightById } from '@/lib/mock-insights'
import { notFound } from 'next/navigation'

interface Params { params: { id: string } }

export function generateStaticParams() {
  return INSIGHTS.map((i) => ({ id: i.id }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const ins = insightById(params.id)
  if (!ins) return {}
  return buildPageMetadata('openrun', {
    title: ins.title,
    description: ins.excerpt,
    path: `/insights/${ins.id}`,
  })
}

export default function InsightDetailPage({ params }: Params) {
  const ins = insightById(params.id)
  if (!ins) notFound()

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '오픈런', url: 'https://openrun.amakers.co.kr' },
      { name: '인사이트', url: 'https://openrun.amakers.co.kr/insights' },
      { name: ins.title, url: `https://openrun.amakers.co.kr/insights/${ins.id}` },
    ],
  })

  const related = INSIGHTS.filter(
    (i) => i.id !== ins.id && (i.category === ins.category || i.featured),
  ).slice(0, 3)

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* Hero */}
      <div
        className="border-b border-gray-100"
        style={{
          background: `linear-gradient(135deg, ${ins.coverColors[0]}18, ${ins.coverColors[1]}10, #fff)`,
        }}
      >
        <div className="container mx-auto py-section">
          <a
            href="/insights"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" /> 인사이트 목록
          </a>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ background: ins.coverColors[0] }}
            >
              {INSIGHT_CATEGORY_LABEL[ins.category]}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" /> {ins.readTime}분 읽기
            </span>
            <span className="text-xs text-gray-400">{ins.publishedAt}</span>
          </div>
          <h1 className="mt-3 max-w-3xl text-h2 font-bold text-gray-900">{ins.title}</h1>
          <p className="mt-2 text-base text-gray-500">{ins.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto py-section">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Article */}
          <article>
            {/* Excerpt */}
            <p className="rounded-xl border-l-4 py-3 pl-5 text-sm font-medium leading-relaxed text-gray-700"
              style={{ borderColor: ins.coverColors[0], background: `${ins.coverColors[0]}0d` }}>
              {ins.excerpt}
            </p>

            {/* Key points */}
            <div className="mt-6 rounded-xl bg-gray-50 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">핵심 포인트</h2>
              <ul className="mt-3 space-y-2">
                {ins.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: ins.coverColors[0] }}
                    />
                    {kp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Body */}
            <div className="mt-6 space-y-5">
              {ins.body.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-gray-700">
                  {para}
                </p>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-1.5">
              {ins.tags.map((t) => (
                <a
                  key={t}
                  href={`/insights?category=${ins.category}`}
                  className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 hover:bg-gray-200"
                >
                  #{t}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div
              className="mt-8 rounded-2xl p-6 text-white"
              style={{
                background: `linear-gradient(135deg, ${ins.coverColors[0]}, ${ins.coverColors[1]})`,
              }}
            >
              <h3 className="text-base font-bold">오픈런의 캠페인 전략이 궁금하신가요?</h3>
              <p className="mt-1 text-sm text-white/80">
                무료 상담으로 우리 매장에 맞는 마케팅 플랜을 받아보세요.
              </p>
              <a
                href="/contact"
                className="mt-4 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                무료 상담 신청
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {related.length > 0 && (
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  관련 인사이트
                </h3>
                <div className="space-y-3">
                  {related.map((r) => (
                    <InsightCard key={r.id} insight={r} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}
