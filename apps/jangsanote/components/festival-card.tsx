import { CalendarDays, ExternalLink, MapPin } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { daysUntil, FESTIVAL_TYPE_LABEL, SOURCE_LABEL, type MockFestival } from '@/lib/hub-data'
import { ScrapButton } from './scrap-button'

interface FestivalCardProps {
  festival: MockFestival
}

function formatRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  const fmt = (d: Date) => d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  return start === end ? fmt(s) : `${fmt(s)} ~ ${fmt(e)}`
}

export function FestivalCard({ festival }: FestivalCardProps) {
  const d = daysUntil(festival.startDate)
  const ended = daysUntil(festival.endDate) < 0
  return (
    <a
      href={festival.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative h-36 w-full overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={festival.coverImage}
            alt={festival.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <Badge variant="primary">{FESTIVAL_TYPE_LABEL[festival.type]}</Badge>
            {festival.source && festival.source !== 'official' && (
              <Badge variant="default" className="bg-white/90">{SOURCE_LABEL[festival.source]}</Badge>
            )}
          </div>
          {!ended && d >= 0 && d <= 14 && (
            <Badge variant="error" className="absolute right-3 top-3">
              {d === 0 ? '오늘 시작' : `D-${d}`}
            </Badge>
          )}
          {ended && (
            <Badge variant="default" className="absolute right-3 top-3 bg-white/90">
              종료
            </Badge>
          )}
          <div className="absolute bottom-3 right-3 z-10">
            <ScrapButton bucket="festivals" id={festival.id} />
          </div>
        </div>
        <CardContent className="p-5">
          <h3 className="line-clamp-2 inline-flex items-start gap-1 text-base font-semibold text-gray-900">
            {festival.title}
            <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-300" />
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">{festival.summary}</p>

          <div className="mt-3 grid gap-1.5 text-xs text-gray-600">
            <div className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              {formatRange(festival.startDate, festival.endDate)}
            </div>
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="truncate">
                {festival.venue} · {festival.region}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
            <span className="truncate text-gray-500">주최 {festival.organizer}</span>
            <span className={festival.isFree ? 'font-semibold text-emerald-600' : 'text-gray-700'}>
              {festival.isFree ? '무료' : '유료'}
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
