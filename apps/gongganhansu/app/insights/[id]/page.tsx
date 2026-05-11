import { notFound } from 'next/navigation'
import { ChevronRight, Clock } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { INSIGHTS, insightById } from '@/lib/mock-data'
import { InsightCard } from '@/components/insight-card'

export function generateStaticParams() {
  return INSIGHTS.map((i) => ({ id: i.id }))
}

interface InsightDetailProps {
  params: { id: string }
}

export default function InsightDetailPage({ params }: InsightDetailProps) {
  const ins = insightById(params.id)
  if (!ins) notFound()
  const related = INSIGHTS.filter((i) => i.id !== ins.id).slice(0, 3)

  return (
    <main className="bg-white">
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
            <Badge variant="primary">{ins.category}</Badge>
            <h1 className="mt-3 text-h2 font-bold text-gray-900">{ins.title}</h1>
            <p className="mt-2 text-base text-gray-700">{ins.subtitle}</p>

            <div className="mt-6 flex items-center gap-3">
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
              <span className="ml-auto inline-flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {ins.readTime}분 · {ins.publishedAt}
              </span>
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
