import { notFound } from 'next/navigation'
import {
  ChevronRight,
  Clock,
  MessageCircle,
  Star,
} from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { CourseCard } from '@/components/course-card'
import { coursesByInstructor, MENTORS } from '@/lib/mock-data'

export function generateStaticParams() {
  return MENTORS.map((m) => ({ id: m.id }))
}

interface MentorDetailProps {
  params: { id: string }
}

export default function MentorDetailPage({ params }: MentorDetailProps) {
  const mentor = MENTORS.find((m) => m.id === params.id)
  if (!mentor) notFound()
  const courses = coursesByInstructor(mentor.id)
  const otherMentors = MENTORS.filter((m) => m.id !== mentor.id).slice(0, 3)

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/mentors" className="hover:text-gray-900">멘토</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{mentor.name}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-start gap-5">
            <div
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl text-3xl font-bold text-white"
              style={{ background: mentor.avatarColor }}
            >
              {mentor.name.charAt(0)}
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
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                        style={{ background: m.avatarColor }}
                      >
                        {m.name.charAt(0)}
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

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="space-y-4 p-5">
                <div>
                  <div className="text-xs text-gray-500">시간당 상담료</div>
                  <div className="mt-1 text-h3 font-bold text-gray-900">
                    {formatNumber(mentor.hourlyRate)}
                    <span className="text-base font-medium text-gray-500"> 원</span>
                  </div>
                </div>
                <Button size="lg" className="w-full gap-1">
                  <MessageCircle className="h-4 w-4" />
                  1:1 상담 신청
                </Button>
                <Button size="lg" variant="outline" className="w-full">
                  메시지 보내기
                </Button>
                <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                  상담은 영업일 기준 3일 이내 매칭됩니다. 매칭 후 일정 조율은 멘토와 직접
                  진행합니다.
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}
