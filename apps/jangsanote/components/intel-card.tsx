import { Eye, MapPin, ThumbsUp, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import {
  FOOT_TRAFFIC_LABEL,
  INTEL_CATEGORY_LABEL,
  RENT_LEVEL_LABEL,
  TREND_LABEL,
  type MockIntel,
} from '@/lib/mock-intel'
import { intelAuthor } from '@/lib/mock-intel'

const TREND_COLOR: Record<MockIntel['trend'], string> = {
  up: 'text-emerald-600 bg-emerald-50',
  stable: 'text-blue-600 bg-blue-50',
  down: 'text-rose-600 bg-rose-50',
}

interface IntelCardProps {
  intel: MockIntel
}

export function IntelCard({ intel: it }: IntelCardProps) {
  const author = intelAuthor(it.authorId)
  return (
    <a href={`/intel/${it.id}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="flex h-full flex-col p-5">
          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              {INTEL_CATEGORY_LABEL[it.category]}
            </span>
            <span
              className={
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ' +
                TREND_COLOR[it.trend]
              }
            >
              {it.trend === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : it.trend === 'down' ? (
                <TrendingDown className="h-3 w-3" />
              ) : null}
              {TREND_LABEL[it.trend]}
            </span>
          </div>

          {/* Title + region */}
          <h3 className="mt-2.5 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-[var(--brand-primary)]">
            {it.title}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            {it.district}
          </div>

          <p className="mt-2 line-clamp-2 flex-1 text-xs text-gray-600">{it.summary}</p>

          {/* Metrics chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
              {FOOT_TRAFFIC_LABEL[it.footTraffic]}
            </span>
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
              {RENT_LEVEL_LABEL[it.rentLevel]}
            </span>
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
            <span>{author?.handle ?? '익명'}</span>
            <span className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" /> {it.likes}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" /> {it.views.toLocaleString()}
              </span>
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
