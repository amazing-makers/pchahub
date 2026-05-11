import { Clock } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatRelativeTime } from '@amakers/utils'
import type { MockInsight } from '@/lib/mock-data'

interface InsightCardProps {
  insight: MockInsight
}

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <a href={`/insights/${insight.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div
            className="h-32 w-full"
            style={{
              background: `linear-gradient(135deg, ${insight.coverColors[0]}, ${insight.coverColors[1] ?? insight.coverColors[0]})`,
            }}
            aria-hidden
          />
          <div className="p-5">
            <Badge variant="primary">{insight.category}</Badge>
            <h3 className="mt-3 line-clamp-2 text-base font-bold text-gray-900">{insight.title}</h3>
            <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">{insight.excerpt}</p>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <span
                className="h-5 w-5 shrink-0 rounded-full"
                style={{ background: insight.authorAvatarColor }}
                aria-hidden
              />
              <span className="truncate">{insight.authorName}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {insight.readTime}분
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
