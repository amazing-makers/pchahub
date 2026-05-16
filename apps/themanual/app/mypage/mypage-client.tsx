'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Clock, Heart, MessageCircle } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { CourseCard } from '@/components/course-card'
import { COURSES } from '@/lib/mock-data'

interface Consultation {
  id: string
  mentorId: string
  mentorName: string
  name: string
  phone: string
  topic: string
  question: string
  status: string
  createdAt: string
}

const TOPIC_LABEL: Record<string, string> = {
  startup: '창업 준비',
  ops: '매장 운영',
  finance: '세무·회계',
  legal: '법률·계약',
  marketing: '마케팅',
  interior: '인테리어',
  other: '기타',
}

export function MyPageClient() {
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('themanual:savedCourses')
      if (raw) setSavedIds(JSON.parse(raw) as string[])
    } catch {
      // ignore
    }
    try {
      const raw2 = window.localStorage.getItem('themanual:consultations')
      if (raw2) setConsultations(JSON.parse(raw2) as Consultation[])
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  const savedCourses = savedIds
    .map((id) => COURSES.find((c) => c.id === id))
    .filter(Boolean) as typeof COURSES

  if (!hydrated) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 통계 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={BookOpen} label="수강 중" value="0강" />
        <StatCard icon={BookOpen} label="완료한 강의" value="0강" />
        <StatCard icon={Heart} label="찜한 강의" value={`${savedCourses.length}강`} />
        <StatCard icon={MessageCircle} label="멘토 상담" value={`${consultations.length}건`} />
      </div>

      {/* 찜한 강의 */}
      <section>
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">찜한 강의</h2>
        {savedCourses.length === 0 ? (
          <Card className="border-dashed border-gray-200">
            <CardContent className="p-8 text-center">
              <Heart className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                아직 찜한 강의가 없습니다.
              </p>
              <a
                href="/courses"
                className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                강의 둘러보기
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedCourses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>

      {/* 멘토 상담 내역 */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-[var(--brand-primary)]" />
          <h2 className="text-h4 font-semibold text-gray-900">멘토 상담 내역</h2>
        </div>
        {consultations.length === 0 ? (
          <Card className="border-dashed border-gray-200">
            <CardContent className="p-8 text-center">
              <MessageCircle className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                아직 신청한 상담이 없습니다.
              </p>
              <a
                href="/mentors"
                className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                멘토 찾기
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {consultations.map((c) => (
              <Card key={c.id} className="border-gray-200">
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-gray-900">
                          {c.mentorName} 멘토
                        </span>
                        <Badge variant="warning">본사 응답 대기</Badge>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span>주제 · {TOPIC_LABEL[c.topic] ?? c.topic}</span>
                        <span>신청일 · {c.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  {c.question && (
                    <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        내가 보낸 질문
                      </div>
                      <p className="mt-1 line-clamp-2">{c.question}</p>
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-end border-t border-gray-100 pt-3">
                    <a
                      href={`/mentors/${c.mentorId}`}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      멘토 보기 →
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen
  label: string
  value: string
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <Icon className="h-4 w-4 text-gray-400" />
        <div className="mt-2 text-xs text-gray-500">{label}</div>
        <div className="mt-0.5 text-base font-semibold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  )
}
