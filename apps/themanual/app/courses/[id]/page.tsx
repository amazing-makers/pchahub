import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  PlayCircle,
  Star,
  Users,
} from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { buildPageMetadata } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import {
  COURSE_CATEGORIES,
  COURSES,
  LEVEL_LABEL,
  MENTORS,
  type MockCourse,
} from '@/lib/mock-data'
import { CourseCard } from '@/components/course-card'

export function generateStaticParams() {
  return COURSES.map((c) => ({ id: c.id }))
}

interface CourseDetailPageProps {
  params: { id: string }
}

export function generateMetadata({ params }: CourseDetailPageProps): Metadata {
  const course = COURSES.find((c) => c.id === params.id)
  if (!course) return {}
  const cat = COURSE_CATEGORIES.find((c) => c.key === course.category)
  return buildPageMetadata('themanual', {
    title: `${course.title} — ${cat?.label ?? course.category}`,
    description: `${course.subtitle} · ${course.lessonCount}강 · ${Math.floor(course.durationMin / 60)}시간 · 평점 ${course.rating} · ${course.price === 0 ? '무료' : `${formatNumber(course.price)}원`}.`,
    path: `/courses/${course.id}`,
  })
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const course = COURSES.find((c) => c.id === params.id)
  if (!course) notFound()

  const category = COURSE_CATEGORIES.find((c) => c.key === course.category)
  const instructors = course.instructorIds
    .map((id) => MENTORS.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
  const related = COURSES.filter(
    (c) => c.id !== course.id && c.category === course.category,
  ).slice(0, 3)

  const isFree = course.price === 0
  const totalLessons = course.curriculum.reduce((s, sec) => s + sec.lessons.length, 0)
  const totalDuration = course.curriculum.reduce(
    (s, sec) => s + sec.lessons.reduce((ss, l) => ss + l.durationMin, 0),
    0,
  )

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/courses" className="hover:text-gray-900">강의</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <a href={`/courses?category=${course.category}`} className="hover:text-gray-900">
              {category?.label ?? course.category}
            </a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{course.title}</span>
          </nav>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {category && <Badge variant="primary">{category.label}</Badge>}
                <Badge variant="default">{LEVEL_LABEL[course.level]}</Badge>
                {isFree && <Badge variant="success">무료</Badge>}
                {course.featured && !isFree && <Badge variant="warning">추천</Badge>}
              </div>
              <h1 className="mt-3 text-h2 font-bold text-gray-900">{course.title}</h1>
              <p className="mt-2 text-gray-700">{course.subtitle}</p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-gray-900">{course.rating}</span>
                  ({formatNumber(course.reviewCount)}개)
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  수강생 {formatNumber(course.enrollment)}명
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {Math.floor(course.durationMin / 60)}시간 {course.durationMin % 60}분 · {course.lessonCount}강
                </span>
              </div>
            </div>

            {/* Sticky purchase card */}
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <div
                    className="h-36 w-full rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${course.thumbnailColor}, ${course.thumbnailColor}AA)`,
                    }}
                    aria-hidden
                  />
                  <div>
                    {isFree ? (
                      <div className="text-h3 font-bold text-emerald-600">무료</div>
                    ) : (
                      <>
                        <div className="text-h3 font-bold text-gray-900">
                          {formatNumber(course.price)}
                          <span className="text-base font-medium text-gray-500"> 원</span>
                        </div>
                        {course.originalPrice && (
                          <div className="text-sm text-gray-400 line-through">
                            {formatNumber(course.originalPrice)}원
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <Button size="lg" className="w-full gap-1">
                    <PlayCircle className="h-4 w-4" />
                    {isFree ? '바로 수강 시작' : '결제하고 수강 시작'}
                  </Button>
                  <Button size="lg" variant="outline" className="w-full">
                    찜하기
                  </Button>
                  <p className="text-center text-xs text-gray-500">
                    구매 후 무제한 시청 · 모바일 지원
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6 min-w-0">
            {/* Description */}
            <SectionCard title="강의 소개">
              <p className="text-base leading-relaxed text-gray-700">{course.description}</p>
            </SectionCard>

            {/* What you'll learn */}
            <SectionCard title="이 강의에서 배우는 것">
              <ul className="grid gap-2 sm:grid-cols-2">
                {course.takeaways.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </SectionCard>

            {/* Target audience */}
            <SectionCard title="이런 분께 추천합니다">
              <ul className="space-y-2 text-sm text-gray-700">
                {course.targetAudience.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </SectionCard>

            {/* Curriculum */}
            <SectionCard
              title="커리큘럼"
              subtitle={`${course.curriculum.length}개 섹션 · ${totalLessons}개 강의 · 총 ${Math.floor(totalDuration / 60)}시간 ${totalDuration % 60}분`}
            >
              <div className="space-y-3">
                {course.curriculum.map((section, i) => (
                  <details
                    key={section.id}
                    className="group rounded-xl border border-gray-200 bg-white open:shadow-sm"
                    open={i === 0}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700">
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">{section.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">{section.lessons.length}강</span>
                    </summary>
                    <div className="space-y-1 border-t border-gray-100 p-3">
                      {section.lessons.map((l) => (
                        <div
                          key={l.id}
                          className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2 text-gray-700">
                            <PlayCircle className="h-4 w-4 text-gray-400" />
                            {l.title}
                            {l.preview && (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                                미리보기
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{l.durationMin}분</span>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </SectionCard>

            {/* Instructors */}
            {instructors.length > 0 && (
              <SectionCard title={`강사 ${instructors.length}명`}>
                <div className="space-y-4">
                  {instructors.map((m) => (
                    <a
                      key={m.id}
                      href={`/mentors/${m.id}`}
                      className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-400"
                    >
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white"
                        style={{ background: m.avatarColor }}
                      >
                        {m.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-base font-bold text-gray-900">{m.name}</div>
                        <div className="text-sm text-gray-600">{m.role}</div>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{m.bio}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Related */}
            {related.length > 0 && (
              <SectionCard title={`다른 ${category?.label ?? ''} 강의`}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((c) => (
                    <CourseCard key={c.id} course={c} />
                  ))}
                </div>
              </SectionCard>
            )}
          </div>
          <div className="hidden lg:block" />
        </div>
      </div>
    </main>
  )
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-h4 font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {children}
      </CardContent>
    </Card>
  )
}
