import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import {
  EVENT_FORMAT_LABEL,
  EVENT_TYPE_LABEL,
  EVENTS,
  UPCOMING_EVENTS,
  eventById,
  formatEventDate,
  isFull,
  spotsLeft,
  type EventType,
} from '@/lib/mock-events'

export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }))
}

interface EventPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = eventById(params.id)
  if (!event) return {}
  return buildPageMetadata('themanual', {
    title: event.title,
    description: event.excerpt,
    path: `/events/${event.id}`,
  })
}

const TYPE_COLORS: Record<EventType, string> = {
  webinar: '#7C3AED',
  lecture: '#DC2626',
  workshop: '#0891B2',
  qa: '#059669',
}

export default function EventDetailPage({ params }: EventPageProps) {
  const event = eventById(params.id)
  if (!event) notFound()

  const full = isFull(event)
  const left = spotsLeft(event)
  const pct = Math.round((event.currentAttendees / event.maxAttendees) * 100)
  const typeColor = TYPE_COLORS[event.type]
  const isUpcoming = new Date(event.date) > new Date('2026-05-25')

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '더메뉴얼', url: 'https://themanual.amakers.co.kr' },
      { name: '특강·이벤트', url: 'https://themanual.amakers.co.kr/events' },
      { name: event.title, url: `https://themanual.amakers.co.kr/events/${event.id}` },
    ],
  })

  const related = UPCOMING_EVENTS.filter(
    (e) => e.id !== event.id && (e.category === event.category || e.type === event.type),
  ).slice(0, 3)

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* Gradient hero */}
      <section
        className="border-b border-gray-100 text-white"
        style={{ background: `linear-gradient(135deg, ${typeColor}dd, ${typeColor}88)` }}
      >
        <div className="container mx-auto py-section">
          <a
            href="/events"
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> 이벤트 목록
          </a>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
              {EVENT_TYPE_LABEL[event.type]}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              {EVENT_FORMAT_LABEL[event.format]}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              {event.categoryLabel}
            </span>
            {event.price === 0 && (
              <span className="rounded-full bg-emerald-400/80 px-3 py-1 text-xs font-bold">
                무료
              </span>
            )}
          </div>

          <h1 className="mt-4 max-w-2xl text-h2 font-bold">{event.title}</h1>
          <p className="mt-3 max-w-2xl text-white/80">{event.excerpt}</p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatEventDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {event.durationMin >= 60
                ? `${Math.floor(event.durationMin / 60)}시간${event.durationMin % 60 ? ` ${event.durationMin % 60}분` : ''}`
                : `${event.durationMin}분`}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {event.currentAttendees}/{event.maxAttendees}명 신청
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-section">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <div className="space-y-8">
            {/* Host */}
            <Card className="border-gray-200">
              <CardContent className="p-5">
                <h2 className="text-sm font-bold text-gray-900">강연자</h2>
                <div className="mt-3 flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                    style={{ background: typeColor }}
                  >
                    {event.host[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{event.host}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{event.hostTitle}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What you'll learn */}
            <div>
              <h2 className="text-h4 font-bold text-gray-900">이 이벤트에서 배울 것들</h2>
              <ul className="mt-4 space-y-2.5">
                {event.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: typeColor }}
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h2 className="text-h4 font-bold text-gray-900">다른 예정 이벤트</h2>
                <div className="mt-4 space-y-3">
                  {related.map((e) => (
                    <a key={e.id} href={`/events/${e.id}`} className="block">
                      <Card className="border-gray-200 transition-shadow hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
                              style={{ background: TYPE_COLORS[e.type] }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-gray-900">{e.title}</div>
                              <div className="mt-0.5 text-xs text-gray-400">{formatEventDate(e.date)}</div>
                            </div>
                            <div className="shrink-0 text-xs font-bold text-gray-700">
                              {e.price === 0 ? '무료' : `${e.price.toLocaleString()}원`}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — registration */}
          <div className="space-y-4">
            <Card className="sticky top-4 border-gray-200">
              <CardContent className="p-5">
                <div className="text-2xl font-black text-gray-900">
                  {event.price === 0 ? '무료' : `${event.price.toLocaleString()}원`}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  신청 마감: {event.registrationDeadline}
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {event.currentAttendees}명 신청
                    </span>
                    <span>{left > 0 ? `잔여 ${left}석` : '마감'}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${full ? 'bg-gray-400' : 'bg-emerald-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <button
                  className="mt-4 w-full rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={
                    full || !event.registrationOpen || !isUpcoming
                      ? { background: '#d1d5db', color: '#6b7280' }
                      : { background: 'var(--brand-primary)' }
                  }
                  disabled={full || !event.registrationOpen || !isUpcoming}
                >
                  {!isUpcoming ? '종료된 이벤트' : full ? '신청 마감' : !event.registrationOpen ? '신청 종료' : '신청하기'}
                </button>

                {isUpcoming && !full && event.registrationOpen && (
                  <p className="mt-2 text-center text-xs text-gray-400">
                    신청 마감 전날까지 취소 가능
                  </p>
                )}

                {/* Details */}
                <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <span>{formatEventDate(event.date)}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <span>
                      {event.durationMin >= 60
                        ? `${Math.floor(event.durationMin / 60)}시간${event.durationMin % 60 ? ` ${event.durationMin % 60}분` : ''}`
                        : `${event.durationMin}분`}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <span>
                      {EVENT_FORMAT_LABEL[event.format]}
                      {event.location ? ` · ${event.location}` : ''}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mentor CTA */}
            <Card className="border-gray-100 bg-gray-50">
              <CardContent className="p-5">
                <p className="text-xs font-semibold text-gray-700">이벤트가 끝나고 더 깊은 상담이 필요하다면</p>
                <a
                  href="/mentors"
                  className="mt-3 flex items-center justify-between text-sm font-semibold hover:underline"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  1:1 멘토 상담 신청 <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
