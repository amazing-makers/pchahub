import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ChevronRight,
  Clock,
  MessageCircle,
  Star,
} from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { buildBreadcrumbsJsonLd, buildPageMetadata, buildPersonJsonLd, JsonLd } from '@amakers/design-system'
import { CourseCard } from '@/components/course-card'
import { coursesByInstructor, MENTORS } from '@/lib/mock-data'
import { ConsultForm } from './consult-form'
import { SaveMentorButton } from './save-mentor-button'

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
              <div className="mt-4">
                <SaveMentorButton mentorId={mentor.id} />
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
          </aside>
        </div>
      </div>
    </main>
  )
}
