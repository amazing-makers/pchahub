import { Calendar, MapPin, Users, Video } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { MEETING_TYPE_LABEL, type MockMeeting, userById } from '@/lib/mock-data'

interface MeetingCardProps {
  meeting: MockMeeting
  compact?: boolean
}

export function MeetingCard({ meeting, compact = false }: MeetingCardProps) {
  const host = userById(meeting.hostId)
  const full = meeting.currentParticipants >= meeting.maxParticipants

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const day = d.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    })
    return day
  }

  return (
    <a href={`/meetings/${meeting.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        {!compact && (
          <div className="relative h-36 w-full overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={meeting.coverImage}
              alt={meeting.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
            {meeting.featured && (
              <Badge variant="warning" className="absolute right-3 top-3">
                추천 모임
              </Badge>
            )}
          </div>
        )}
        <CardContent className={compact ? 'p-4' : 'p-5'}>
          <div className="flex items-center gap-2">
            <Badge variant={meeting.type === 'online' ? 'primary' : 'default'} className="gap-0.5">
              {meeting.type === 'online' && <Video className="h-3 w-3" />}
              {MEETING_TYPE_LABEL[meeting.type]}
            </Badge>
            {compact && meeting.featured && <Badge variant="warning">추천</Badge>}
            {meeting.status === 'closed' && <Badge variant="default">모집 마감</Badge>}
            {full && meeting.status !== 'closed' && <Badge variant="error">정원 마감</Badge>}
          </div>

          <h3
            className={
              'mt-3 font-semibold text-gray-900 ' +
              (compact ? 'text-sm line-clamp-2' : 'text-base line-clamp-2')
            }
          >
            {meeting.title}
          </h3>

          {!compact && (
            <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">{meeting.description}</p>
          )}

          <div className={'mt-3 grid gap-1.5 text-xs text-gray-600 ' + (compact ? '' : 'sm:grid-cols-2')}>
            <div className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span>
                {formatDate(meeting.date)} · {meeting.startTime} - {meeting.endTime}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="truncate">{meeting.location}</span>
            </div>
          </div>

          {!compact && meeting.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {meeting.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div
            className={
              'mt-3 flex items-center justify-between gap-2 ' +
              (compact ? '' : 'border-t border-gray-100 pt-3')
            }
          >
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-500">
              <Users className="h-3 w-3" />
              {meeting.currentParticipants} / {meeting.maxParticipants}명
            </div>
            <div className="text-xs font-semibold">
              {meeting.isFree ? (
                <span className="text-emerald-600">무료</span>
              ) : (
                <span className="text-gray-900">참가비 {formatNumber(meeting.feeWon)}원</span>
              )}
            </div>
          </div>

          {!compact && host && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={host.avatarUrl}
                alt={host.handle}
                className="h-5 w-5 shrink-0 rounded-full object-cover"
                loading="lazy"
              />
              주최 · {host.handle}
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  )
}
