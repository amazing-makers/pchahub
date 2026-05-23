import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  MessageSquare,
  PlayCircle,
  Star,
  Store,
  Users,
} from 'lucide-react'
import { Badge, Card, CardContent, MobileCTA, NewsletterForm } from '@amakers/ui'
import {
  buildBreadcrumbsJsonLd,
  buildCourseJsonLd,
  buildPageMetadata,
  JsonLd,
} from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import {
  COURSE_CATEGORIES,
  COURSES,
  LEVEL_LABEL,
  MENTORS,
  type MockCourse,
} from '@/lib/mock-data'
import { CourseCard } from '@/components/course-card'
import { SaveCourseButton } from './save-button'
import { EnrollButton } from './enroll-button'
import { CourseViewTracker } from './course-view-tracker'
import { LessonCompleteButton } from './lesson-complete-button'
import { CourseProgress } from './course-progress'
import { CertificateButton } from './certificate-button'
import { ShareCourseButton } from './share-course-button'

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
  const allLessonIds = course.curriculum.flatMap((sec) => sec.lessons.map((l) => l.id))
  const totalLessons = course.curriculum.reduce((s, sec) => s + sec.lessons.length, 0)
  const totalDuration = course.curriculum.reduce(
    (s, sec) => s + sec.lessons.reduce((ss, l) => ss + l.durationMin, 0),
    0,
  )

  const courseUrl = `https://themanual.amakers.co.kr/courses/${course.id}`
  const courseJsonLd = buildCourseJsonLd({
    name: course.title,
    description: course.description,
    url: courseUrl,
    image: course.thumbnailImage,
    provider: '더메뉴얼',
    instructors: instructors.map((i) => ({ name: i.name })),
    price: course.price,
    durationMin: course.durationMin,
    rating: course.rating,
    reviewCount: course.reviewCount,
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '강의', url: 'https://themanual.amakers.co.kr/courses' },
      ...(category
        ? [
            {
              name: category.label,
              url: `https://themanual.amakers.co.kr/courses?category=${category.key}`,
            },
          ]
        : []),
      { name: course.title, url: courseUrl },
    ],
  })

  return (
    <main className="bg-gray-50">
      <CourseViewTracker courseId={course.id} />
      <JsonLd data={courseJsonLd} />
      <JsonLd data={breadcrumbs} />
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
            <aside id="cta" className="lg:sticky lg:top-20 lg:self-start">
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
                  <EnrollButton
                    courseId={course.id}
                    courseTitle={course.title}
                    isFree={isFree}
                    price={course.price}
                  />
                  <SaveCourseButton courseId={course.id} />
                  <ShareCourseButton courseTitle={course.title} />
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
            <div className="flex items-center justify-between gap-4">
              <CourseProgress lessonIds={allLessonIds} />
              <CertificateButton
                courseId={course.id}
                courseTitle={course.title}
                lessonIds={allLessonIds}
              />
            </div>
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
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{l.durationMin}분</span>
                            <LessonCompleteButton lessonId={l.id} courseId={course.id} />
                          </div>
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

            {/* amakers 생태계 크로스링크 */}
            <SectionCard title="amakers에서 더 알아보기">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <a
                  href={`https://pchahub.amakers.co.kr/brands?category=${course.category}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5 text-indigo-500" />
                    {category?.label ?? ''} 브랜드 정보
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a
                  href={`https://bestplace.amakers.co.kr/stores`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    베스트 매장 어워드
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a
                  href="https://changupdocu.amakers.co.kr/episodes"
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <PlayCircle className="h-3.5 w-3.5 text-rose-500" />
                    창업 성공·실패 다큐
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a
                  href="https://jangsanote.amakers.co.kr"
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                    점주 커뮤니티 (장사노트)
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
              </div>
            </SectionCard>
          </div>
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* 뉴스레터 CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h4 font-bold text-gray-900">가맹 운영 강의 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 강의 오픈·멘토 강연·실전 운영 팁을 격주로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>

      <MobileCTA label="수강 신청하기" href="#cta" />
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
