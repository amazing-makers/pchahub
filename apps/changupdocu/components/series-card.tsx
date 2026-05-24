import { ArrowRight, Clock, PlayCircle } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { CATEGORY_COLOR, CATEGORY_LABEL } from '@/lib/mock-data'
import type { MockSeries } from '@/lib/mock-series'

interface SeriesCardProps {
  series: MockSeries
  large?: boolean
}

export function SeriesCard({ series, large = false }: SeriesCardProps) {
  return (
    <a href={`/series/${series.id}`} className="group block">
      <Card className="h-full overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
        {/* Thumbnail */}
        <div
          className={`relative ${large ? 'h-44' : 'h-32'} w-full`}
          style={{
            background: `linear-gradient(135deg, ${series.thumbnailColors[0]}, ${series.thumbnailColors[1]})`,
          }}
        >
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <PlayCircle className="h-12 w-12 text-white/80" />
          </div>
          {/* Episode count badge */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
            <PlayCircle className="h-3 w-3" />
            {series.episodeRefs.length}편
          </div>
          {/* Category badge */}
          <div
            className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
            style={{ background: CATEGORY_COLOR[series.category] }}
          >
            {CATEGORY_LABEL[series.category]}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className={`font-bold text-gray-900 transition-colors group-hover:text-[var(--brand-primary)] ${large ? 'text-base' : 'text-sm'} line-clamp-1`}>
            {series.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">{series.subtitle}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              총 {series.totalDuration}
            </div>
            <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--brand-primary)] opacity-0 transition-opacity group-hover:opacity-100">
              보기 <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
