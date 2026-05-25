import { Clock, Tag } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { INSIGHT_CATEGORY_LABEL, type MockInsight } from '@/lib/mock-insights'

interface InsightCardProps {
  insight: MockInsight
}

export function InsightCard({ insight: ins }: InsightCardProps) {
  return (
    <a href={`/insights/${ins.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        {/* Cover gradient */}
        <div
          className="h-2 w-full"
          style={{
            background: `linear-gradient(to right, ${ins.coverColors[0]}, ${ins.coverColors[1]})`,
          }}
        />
        <CardContent className="flex h-full flex-col p-5">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ background: ins.coverColors[0] }}
            >
              {INSIGHT_CATEGORY_LABEL[ins.category]}
            </span>
            {ins.featured && (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                추천
              </span>
            )}
          </div>

          <h3 className="mt-2.5 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-[var(--brand-primary)]">
            {ins.title}
          </h3>
          <p className="mt-1 text-xs text-gray-500">{ins.subtitle}</p>
          <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-600">
            {ins.excerpt}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" /> {ins.readTime}분
            </span>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-gray-400">{ins.publishedAt}</span>
            {ins.tags.slice(0, 2).map((t) => (
              <span key={t} className="inline-flex items-center gap-0.5 text-xs text-gray-400">
                <Tag className="h-2.5 w-2.5" />
                {t}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
