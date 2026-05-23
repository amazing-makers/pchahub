import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Store,
  Users,
  Video,
} from 'lucide-react'
import { Badge, Card, CardContent, MobileCTA } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { buildBreadcrumbsJsonLd, buildEventJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import {
  channelLabel,
  MEETING_TYPE_LABEL,
  MEETINGS,
  userById,
} from '@/lib/mock-data'
import { MeetingCard } from '@/components/meeting-card'
import { UserChip } from '@/components/user-chip'
import { RsvpButton } from './rsvp-button'
import { MeetingContactButton } from './meeting-contact-button'
import { ShareMeetingButton } from './share-meeting-button'
import { MeetingViewTracker } from './meeting-view-tracker'

export function generateStaticParams() {
  return MEETINGS.map((m) => ({ id: m.id }))
}

interface MeetingDetailProps {
  params: { id: string }
}

export function generateMetadata({ params }: MeetingDetailProps): Metadata {
  const m = MEETINGS.find((m) => m.id === params.id)
  if (!m) return {}
  return buildPageMetadata('jangsanote', {
    title: m.title,
    description: `${m.description} · ${MEETING_TYPE_LABEL[m.type]} · ${m.location} · 정원 ${m.maxParticipants}명.`,
    path: `/meetings/${m.id}`,
  })
}

export default function MeetingDetailPage({ params }: MeetingDetailProps) {
  const meeting = MEETINGS.find((m) => m.id === params.id)
  if (!meeting) notFound()
  const host = userById(meeting.hostId)
  const channel = channelLabel(meeting.channelType, meeting.channelKey)
  const related = MEETINGS.filter(
    (m) => m.id !== meeting.id && m.status === 'upcoming',
  ).slice(0, 3)
  const full = meeting.currentParticipants >= meeting.maxParticipants
  const closed = meeting.status === 'closed'

  const meetingUrl = `https://jangsanote.amakers.co.kr/meetings/${meeting.id}`
  const eventStatus = meeting.status === 'closed' ? 'sold-out' : 'scheduled'
  const meetingJsonLd = buildEventJsonLd({
    name: meeting.title,
    description: meeting.description,
    url: meetingUrl,
    image: meeting.coverImage,
    startDate: meeting.date,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
    eventType: meeting.type,
    locationName: meeting.location,
    priceWon: meeting.isFree ? 0 : meeting.feeWon,
    status: eventStatus,
    organizer: { name: host?.handle ?? '장사노트', url: 'https://jangsanote.amakers.co.kr' },
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '모임', url: 'https://jangsanote.amakers.co.kr/meetings' },
      { name: meeting.title, url: meetingUrl },
    ],
  })

  const formatLongDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  return (
    <main className="bg-gray-50">
      <MeetingViewTracker
        meetingId={meeting.id}
        meetingTitle={meeting.title}
        meetingType={meeting.type}
        meetingDate={meeting.date}
      />
      <JsonLd data={meetingJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          {/* 브레드크럼 */}
          <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-900">홈</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <a href="/meetings" className="hover:text-gray-900">모임</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate font-medium text-gray-900">{meeting.title}</span>
          </nav>

          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={meeting.type === 'online' ? 'primary' : 'default'} className="gap-0.5">
                {meeting.type === 'online' && <Video className="h-3 w-3" />}
                {MEETING_TYPE_LABEL[meeting.type]}
              </Badge>
              <Badge variant="default">{channel}</Badge>
              {meeting.featured && <Badge variant="warning">추천</Badge>}
              {closed && <Badge variant="default">모집 마감</Badge>}
              {full && !closed && <Badge variant="error">정원 마감</Badge>}
            </div>
            <h1 className="mt-3 text-h2 font-bold text-gray-900">{meeting.title}</h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-700">
              {meeting.description}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6 min-w-0">
            <SectionCard title="모임 정보">
              <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                <Spec icon={Calendar} label="일시" value={`${formatLongDate(meeting.date)} ${meeting.startTime} - ${meeting.endTime}`} />
                <Spec icon={MapPin} label="장소" value={meeting.location} />
                <Spec icon={Users} label="정원" value={`${meeting.currentParticipants} / ${meeting.maxParticipants}명`} />
                <Spec
                  icon={Clock}
                  label="참가비"
                  value={meeting.isFree ? '무료' : `${formatNumber(meeting.feeWon)}원`}
                />
              </div>
            </SectionCard>

            {meeting.agenda.length > 0 && (
              <SectionCard title="진행 순서">
                <ol className="space-y-3">
                  {meeting.agenda.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex h-7 w-14 shrink-0 items-center justify-center rounded-md bg-amber-50 text-xs font-bold text-amber-700">
                        {item.time}
                      </div>
                      <div className="text-sm text-gray-800">{item.topic}</div>
                    </li>
                  ))}
                </ol>
              </SectionCard>
            )}

            {host && (
              <SectionCard title="주최자">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white"
                    style={{ background: host.avatarColor }}
                  >
                    {host.handle.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-bold text-gray-900">{host.handle}</div>
                    <div className="text-sm text-gray-600">{host.role}</div>
                    <div className="mt-2 inline-flex items-center gap-3 text-xs text-gray-500">
                      <span>주최 모임 {host.postCount}회</span>
                      <span>도움됨 {host.helpfulCount}</span>
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}

            {meeting.tags.length > 0 && (
              <SectionCard title="태그">
                <div className="flex flex-wrap gap-1.5">
                  {meeting.tags.map((t) => (
                    <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                      #{t}
                    </span>
                  ))}
                </div>
              </SectionCard>
            )}

            <SectionCard title="참여 안내">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  참여 신청 후 1일 이내 주최자가 확인 메시지를 보냅니다.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  유료 모임은 주최자에게 직접 송금 또는 모임 당일 현장 결제입니다.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  본사 마케팅 목적의 참여는 금지됩니다. 점주·예비 점주·전문가 위주 모임입니다.
                </li>
              </ul>
            </SectionCard>

            {related.length > 0 && (
              <SectionCard title="다른 모임">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {related.map((m) => (
                    <MeetingCard key={m.id} meeting={m} compact />
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          <aside id="cta" className="lg:sticky lg:top-20 lg:self-start">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="space-y-4 p-5">
                <div>
                  <div className="text-xs text-gray-500">참가비</div>
                  <div className="mt-1 text-h3 font-bold text-gray-900">
                    {meeting.isFree ? (
                      <span className="text-emerald-600">무료</span>
                    ) : (
                      <>
                        {formatNumber(meeting.feeWon)}
                        <span className="text-base font-medium text-gray-500"> 원</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2 rounded-lg bg-gray-50 p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">일시</span>
                    <span className="font-medium text-gray-900">
                      {meeting.date} {meeting.startTime}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="shrink-0 text-gray-500">장소</span>
                    <span className="text-right font-medium text-gray-900 line-clamp-1">
                      {meeting.location}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">정원</span>
                      <span className="font-medium text-gray-900">
                        {meeting.currentParticipants} / {meeting.maxParticipants}명
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={
                          'h-full rounded-full transition-all ' +
                          (meeting.currentParticipants >= meeting.maxParticipants
                            ? 'bg-red-500'
                            : meeting.currentParticipants / meeting.maxParticipants >= 0.8
                              ? 'bg-amber-500'
                              : 'bg-emerald-500')
                        }
                        style={{
                          width: `${Math.min(100, (meeting.currentParticipants / meeting.maxParticipants) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <RsvpButton
                  meetingId={meeting.id}
                  meetingTitle={meeting.title}
                  isFree={meeting.isFree}
                  feeWon={meeting.feeWon}
                  disabled={closed || full}
                  disabledLabel={closed ? '모집 마감' : full ? '정원 마감' : undefined}
                />
                <MeetingContactButton
                  meetingId={meeting.id}
                  meetingTitle={meeting.title}
                  hostHandle={host?.handle ?? '주최자'}
                />
                <ShareMeetingButton meetingTitle={meeting.title} />
                <p className="text-center text-xs text-gray-500">
                  신청 내역은 마이페이지에서 확인할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            {/* amakers crosslinks */}
            <Card className="mt-4 border-gray-200 bg-gray-50">
              <CardContent className="p-4">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  amakers에서 더 알아보기
                </div>
                <div className="space-y-2">
                  <a
                    href={`https://pchahub.amakers.co.kr/brands?q=${encodeURIComponent(meeting.tags?.[0] ?? '')}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Store className="h-3.5 w-3.5 text-indigo-500" />
                      가맹 브랜드 정보
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href="https://themanual.amakers.co.kr/courses"
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                      가맹 운영 강의
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href={`/posts?region=${encodeURIComponent(meeting.region)}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                      {meeting.region} 지역 글
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href="https://bestplace.amakers.co.kr/stores"
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Store className="h-3.5 w-3.5 text-amber-500" />
                      우수 매장 보기
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* 뉴스레터 CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h4 font-bold text-gray-900">모임 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 오프라인 모임·지역별 네트워킹·특별 강연 소식을 격주로 알려드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
                aria-label="이메일 주소"
                placeholder="이메일 주소"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                구독하기
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>

      <MobileCTA label="참여 신청하기" href="#cta" />
    </main>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">{title}</h2>
        {children}
      </CardContent>
    </Card>
  )
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2 border-b border-gray-50 py-2 last:border-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0 flex-1 text-sm">
        <div className="text-gray-500">{label}</div>
        <div className="mt-0.5 font-medium text-gray-900">{value}</div>
      </div>
    </div>
  )
}
