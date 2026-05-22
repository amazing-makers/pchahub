import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  MapPin,
  MessageCircle,
  Star,
  Store,
} from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { buildBreadcrumbsJsonLd, buildPageMetadata, buildPersonJsonLd, JsonLd } from '@amakers/design-system'
import { CourseCard } from '@/components/course-card'
import { coursesByInstructor, MENTORS } from '@/lib/mock-data'
import { ConsultForm } from './consult-form'
import { SaveMentorButton } from './save-mentor-button'
import { ShareMentorButton } from './share-mentor-button'
import { MentorViewTracker } from './mentor-view-tracker'

export function generateStaticParams() {
  return MENTORS.map((m) => ({ id: m.id }))
}

interface MentorDetailProps {
  params: { id: string }
}

export function generateMetadata({ params }: MentorDetailProps): Metadata {
  const mentor = MENTORS.find((m) => m.id === params.id)
  if (!mentor) return {}
  return buildPageMetadata('themanual', {
    title: `${mentor.name} — 멘토`,
    description: `${mentor.role} · ${mentor.specialties.slice(0, 3).join(' · ')} 전문 · 평점 ${mentor.rating} · 상담 ${mentor.totalConsultations}건.`,
    path: `/mentors/${mentor.id}`,
  })
}

export default function MentorDetailPage({ params }: MentorDetailProps) {
  const mentor = MENTORS.find((m) => m.id === params.id)
  if (!mentor) notFound()
  const courses = coursesByInstructor(mentor.id)
  const otherMentors = MENTORS.filter((m) => m.id !== mentor.id).slice(0, 3)

  const mentorUrl = `https://themanual.amakers.co.kr/mentors/${mentor.id}`
  const personJsonLd = buildPersonJsonLd({
    name: mentor.name,
    jobTitle: mentor.role,
    description: mentor.bio,
    url: mentorUrl,
    image: mentor.avatarUrl || undefined,
    knowsAbout: mentor.specialties,
    offer: {
      price: mentor.hourlyRate,
      description: '시간당 멘토링 상담',
    },
    aggregateRating: {
      ratingValue: mentor.rating,
      reviewCount: mentor.totalConsultations,
    },
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '멘토', url: 'https://themanual.amakers.co.kr/mentors' },
      { name: mentor.name, url: mentorUrl },
    ],
  })

  return (
    <main className="bg-gray-50">
      <MentorViewTracker
        mentorId={mentor.id}
        mentorName={mentor.name}
        mentorRole={mentor.role}
        mentorAvatarColor={mentor.avatarColor}
      />
      <JsonLd data={personJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/mentors" className="hover:text-gray-900">멘토</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{mentor.name}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-start gap-5">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-3xl bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mentor.avatarUrl}
                alt={mentor.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-h2 font-bold text-gray-900">{mentor.name}</h1>
                {mentor.featured && <Badge variant="primary">추천 멘토</Badge>}
              </div>
              <p className="mt-1 text-base text-gray-700">{mentor.role}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-gray-900">{mentor.rating}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {formatNumber(mentor.totalConsultations)}회 상담
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {mentor.yearsOfExperience}년차
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {mentor.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <SaveMentorButton mentorId={mentor.id} />
                <ShareMentorButton mentorName={mentor.name} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6 min-w-0">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-h4 font-semibold text-gray-900">소개</h2>
                <p className="mt-3 text-base leading-relaxed text-gray-700">{mentor.bio}</p>
              </CardContent>
            </Card>

            {courses.length > 0 && (
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-h4 font-semibold text-gray-900">{mentor.name} 멘토의 강의</h2>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {courses.map((c) => (
                      <CourseCard key={c.id} course={c} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQ */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-h4 font-semibold text-gray-900">자주 묻는 질문</h2>
                <dl className="mt-4 space-y-4">
                  {[
                    {
                      q: '첫 상담에서 무엇을 준비해야 하나요?',
                      a: '현재 매장 혹은 창업 계획의 기본 정보(업종·지역·예산)와 가장 궁금한 사항을 간략히 정리해 오시면 상담 시간을 더 효율적으로 활용할 수 있습니다.',
                    },
                    {
                      q: '상담 취소·환불 정책은 어떻게 되나요?',
                      a: '예약 후 24시간 이내 취소 시 전액 환불됩니다. 이후 취소는 상담일 2일 전까지 50% 환불이 가능합니다.',
                    },
                    {
                      q: '상담 언어나 방식에 제한이 있나요?',
                      a: '모든 상담은 한국어로 진행되며, 화상(Zoom·Meet) 또는 음성 통화 중 원하는 방식을 선택할 수 있습니다.',
                    },
                  ].map((item) => (
                    <div key={item.q} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <dt className="text-sm font-semibold text-gray-900">Q. {item.q}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-gray-600">{item.a}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-h4 font-semibold text-gray-900">다른 멘토</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {otherMentors.map((m) => (
                    <a
                      key={m.id}
                      href={`/mentors/${m.id}`}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-colors hover:border-gray-400"
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.avatarUrl}
                          alt={m.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-gray-900">{m.name}</div>
                        <div className="truncate text-xs text-gray-500">{m.role}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
            {/* 예약하기 CTA */}
            <Card className="border-[var(--brand-primary)]/30 bg-gradient-to-br from-[var(--brand-primary)]/5 to-white shadow-sm">
              <CardContent className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)]">1:1 화상 상담 예약</div>
                <p className="mt-1 text-sm text-gray-600">
                  날짜·시간을 선택하고 상담 내용을 입력하면 {mentor.name} 멘토와 바로 예약됩니다.
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-h4 font-bold text-gray-900">{formatNumber(mentor.hourlyRate)}만원</span>
                  <span className="text-xs text-gray-500">/ 시간</span>
                </div>
                <a href={`/mentors/${mentor.id}/book`} className="mt-3 block">
                  <Button size="md" className="w-full">
                    예약하기
                  </Button>
                </a>
              </CardContent>
            </Card>

            <ConsultForm
              mentorId={mentor.id}
              mentorName={mentor.name}
              hourlyRate={mentor.hourlyRate}
            />

            {/* amakers 생태계 크로스링크 */}
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-4">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  amakers에서 더 알아보기
                </div>
                <div className="space-y-2">
                  <a
                    href={`/courses?mentor=${mentor.id}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                      {mentor.name} 멘토 강의
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href="https://pchahub.amakers.co.kr/brands"
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Store className="h-3.5 w-3.5 text-indigo-500" />
                      가맹 브랜드 정보
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href="https://jangsanote.amakers.co.kr"
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                      점주 커뮤니티
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href="https://themyungdang.amakers.co.kr/listings"
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      입점 매물 찾기
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
            <h2 className="mt-3 text-h4 font-bold text-gray-900">멘토 강연 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 멘토 강연·1:1 멘토링 일정·가맹 운영 팁을 격주로 보내드립니다.</p>
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
    </main>
  )
}
