import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ArrowRight, Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import {
  EVENT_FORMAT_LABEL,
  EVENT_TYPE_LABEL,
  EVENTS,
  PAST_EVENTS,
  UPCOMING_EVENTS,
  formatEventDate,
  isFull,
  spotsLeft,
  type EventType,
} from '@/lib/mock-events'

export const metadata: Metadata = buildPageMetadata('themanual', {
  title: '특강·이벤트 — 라이브 웨비나·워크샵·멘토 Q&A',
  description: '더메뉴얼 특강·이벤트 일정. 현직 점주·전문가와 함께하는 라이브 웨비나, 소그룹 워크샵, 멘토 Q&A를 신청하세요.',
  path: '/events',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '더메뉴얼', url: 'https://themanual.amakers.co.kr' },
    { name: '특강·이벤트', url: 'https://themanual.amakers.co.kr/events' },
  ],
})

const itemList = buildItemListJsonLd({
  url: 'https://themanual.amakers.co.kr/events',
  items: UPCOMING_EVENTS.map((e, i) => ({
    position: i + 1,
    name: e.title,
    url: `https://themanual.amakers.co.kr/events/${e.id}`,
  })),
})

const TYPE_COLORS: Record<EventType, string> = {
  webinar: '#7C3AED',
  lecture: '#DC2626',
  workshop: '#0891B2',
  qa: '#059669',
}

interface EventsPageProps {
  searchParams: { type?: string }
}

export default function EventsPage({ searchParams }: EventsPageProps) {
  const activeType = searchParams.type as EventType | undefined
  const filtered = activeType
    ? UPCOMING_EVENTS.filter((e) => e.type === activeType)
    : UPCOMING_EVENTS

  return (
    <main>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={itemList} />

      {/* Header */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto py-section">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            Live Events
          </p>
          <h1 className="mt-3 text-h2 font-bold text-gray-900">특강 · 이벤트</h1>
          <p className="mt-3 max-w-xl text-gray-600">
            현직 점주·전문가와 함께하는 라이브 웨비나, 소그룹 워크샵, 멘토 Q&A.
            듣고 끝이 아닌 질문하고 적용하는 live 교육입니다.
          </p>

          {/* Type filter */}
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="/events"
              className={
                'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ' +
                (!activeType
                  ? 'text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-400')
              }
              style={!activeType ? { background: 'var(--brand-primary)' } : undefined}
            >
              전체
            </a>
            {(Object.entries(EVENT_TYPE_LABEL) as [EventType, string][]).map(([type, label]) => (
              <a
                key={type}
                href={`/events?type=${type}`}
                className={
                  'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ' +
                  (activeType === type
                    ? 'text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-400')
                }
                style={activeType === type ? { background: TYPE_COLORS[type] } : undefined}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="container mx-auto py-section">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 py-16 text-center">
            <p className="text-sm text-gray-500">해당 유형의 예정된 이벤트가 없습니다.</p>
            <a href="/events" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--brand-primary)' }}>
              전체 보기 <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => {
              const full = isFull(event)
              const left = spotsLeft(event)
              const pct = Math.round((event.currentAttendees / event.maxAttendees) * 100)
              return (
                <a key={event.id} href={`/events/${event.id}`} className="block">
                  <Card className="group h-full overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
                    {/* Color bar */}
                    <div className="h-1.5 w-full" style={{ background: event.coverColor }} />
                    <CardContent className="p-5">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                          style={{ background: TYPE_COLORS[event.type] }}
                        >
                          {EVENT_TYPE_LABEL[event.type]}
                        </span>
                        <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-[11px] text-gray-600">
                          {EVENT_FORMAT_LABEL[event.format]}
                        </span>
                        <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-[11px] text-gray-600">
                          {event.categoryLabel}
                        </span>
                        {event.price === 0 && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                            무료
                          </span>
                        )}
                        {event.featured && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                            추천
                          </span>
                        )}
                      </div>

                      <h2 className="mt-3 text-sm font-bold text-gray-900 group-hover:underline">
                        {event.title}
                      </h2>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
                        {event.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="mt-4 space-y-1.5 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          {formatEventDate(event.date)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {event.durationMin >= 60
                            ? `${Math.floor(event.durationMin / 60)}시간${event.durationMin % 60 ? ` ${event.durationMin % 60}분` : ''}`
                            : `${event.durationMin}분`}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {event.location}
                          </div>
                        )}
                      </div>

                      {/* Attendees + price */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Users className="h-3.5 w-3.5" />
                            {event.currentAttendees}/{event.maxAttendees}명
                            {left <= 10 && !full && (
                              <span className="font-semibold text-rose-600">잔여 {left}석</span>
                            )}
                          </span>
                          <span className="font-bold text-gray-900">
                            {event.price === 0 ? '무료' : `${event.price.toLocaleString()}원`}
                          </span>
                        </div>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full transition-all ${full ? 'bg-gray-400' : 'bg-emerald-400'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* CTA */}
                      <div
                        className="mt-4 w-full rounded-xl py-2 text-center text-xs font-semibold"
                        style={
                          full || !event.registrationOpen
                            ? { background: '#f3f4f6', color: '#9ca3af' }
                            : { background: 'var(--brand-primary)', color: 'white' }
                        }
                      >
                        {full ? '신청 마감' : !event.registrationOpen ? '종료된 이벤트' : '신청하기'}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              )
            })}
          </div>
        )}
      </section>

      {/* Past events */}
      {PAST_EVENTS.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50">
          <div className="container mx-auto py-section">
            <h2 className="text-h4 font-bold text-gray-900">지난 이벤트</h2>
            <p className="mt-1 text-sm text-gray-500">종료된 이벤트 — 강의 녹화본은 개별 문의</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PAST_EVENTS.map((event) => (
                <a key={event.id} href={`/events/${event.id}`} className="block">
                  <Card className="h-full border-gray-200 opacity-70 transition-opacity hover:opacity-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                          style={{ background: TYPE_COLORS[event.type] }}
                        >
                          {EVENT_TYPE_LABEL[event.type]}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                          종료
                        </span>
                      </div>
                      <h3 className="mt-2 text-sm font-semibold text-gray-700">{event.title}</h3>
                      <p className="mt-1 text-xs text-gray-400">{formatEventDate(event.date)}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {event.currentAttendees}명 참가
                      </p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-section">
          <div className="rounded-2xl bg-gray-900 px-8 py-10 text-white">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-h3 font-bold">새 이벤트 알림 받기</h2>
                <p className="mt-2 text-sm text-gray-300">
                  신규 특강·웨비나·워크샵 일정을 먼저 받아보세요. 인기 이벤트는 빠르게 마감됩니다.
                </p>
              </div>
              <a
                href="/courses"
                className="inline-flex items-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                강의 전체 보기 <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
