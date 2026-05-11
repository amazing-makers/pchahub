import { Clock, Eye, PlayCircle } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber, formatRelativeTime } from '@amakers/utils'
import { CATEGORY_COLOR, CATEGORY_LABEL, type MockEpisode } from '@/lib/mock-data'

interface EpisodeCardProps {
  episode: MockEpisode
  /** Large variant — used for hero feature card */
  large?: boolean
}

export function EpisodeCard({ episode, large = false }: EpisodeCardProps) {
  return (
    <a href={`/episodes/${episode.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div
            className={
              'relative w-full overflow-hidden ' + (large ? 'h-56 sm:h-64' : 'h-40')
            }
            style={{
              background: `linear-gradient(135deg, ${episode.thumbnailColors[0]}, ${episode.thumbnailColors[1] ?? episode.thumbnailColors[0]})`,
            }}
            aria-hidden
          >
            <div className="absolute left-3 top-3 flex flex-wrap gap-1">
              <Badge
                variant="default"
                className="text-white"
                style={{ background: CATEGORY_COLOR[episode.category] }}
              >
                {CATEGORY_LABEL[episode.category]}
              </Badge>
              {episode.trending && <Badge variant="warning">트렌딩</Badge>}
            </div>

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-white/90 p-3 shadow-lg transition-transform group-hover:scale-110">
                <PlayCircle className="h-8 w-8 text-gray-900" />
              </div>
            </div>

            <div className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
              {episode.duration}
            </div>
          </div>

          <div className={large ? 'p-6' : 'p-5'}>
            <h3
              className={
                'font-bold text-gray-900 ' +
                (large ? 'text-lg line-clamp-2' : 'text-base line-clamp-2')
              }
            >
              {episode.title}
            </h3>
            <p className={'mt-1.5 line-clamp-2 text-sm text-gray-600 ' + (large ? '' : '')}>
              {episode.subtitle}
            </p>

            <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {formatNumber(episode.views)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatRelativeTime(episode.publishedAt)}
              </span>
              {episode.brand && <span>· {episode.brand}</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
