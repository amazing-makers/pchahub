import { Clock, PlayCircle, Star, Users } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { COURSE_CATEGORIES, LEVEL_LABEL, MENTORS, type MockCourse } from '@/lib/mock-data'

interface CourseCardProps {
  course: MockCourse
  featured?: boolean
}

export function CourseCard({ course, featured = false }: CourseCardProps) {
  const category = COURSE_CATEGORIES.find((c) => c.key === course.category)
  const firstInstructor = MENTORS.find((m) => m.id === course.instructorIds[0])
  const isFree = course.price === 0

  return (
    <a href={`/courses/${course.id}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          {/* Thumbnail */}
          <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.thumbnailImage}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/40" />
            <div className="absolute left-3 top-3 flex flex-wrap gap-1">
              <Badge variant="default" className="bg-white/90 text-gray-900">
                {category?.label ?? course.category}
              </Badge>
              <Badge variant="default" className="bg-white/90 text-gray-700">
                {LEVEL_LABEL[course.level]}
              </Badge>
            </div>
            {isFree && (
              <div className="absolute right-3 top-3">
                <Badge variant="success">무료</Badge>
              </div>
            )}
            {featured && !isFree && (
              <div className="absolute right-3 top-3">
                <Badge variant="warning">추천</Badge>
              </div>
            )}
            <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md">
              <PlayCircle className="h-5 w-5 text-gray-900" />
            </div>
          </div>

          <div className="p-5">
            <h3 className="line-clamp-2 text-base font-semibold text-gray-900">{course.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{course.subtitle}</p>

            {firstInstructor && (
              <div className="mt-3 flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={firstInstructor.avatarUrl}
                  alt={firstInstructor.name}
                  className="h-6 w-6 shrink-0 rounded-full object-cover"
                  loading="lazy"
                />
                <span className="text-xs text-gray-700">
                  {firstInstructor.name}
                  {course.instructorIds.length > 1 && ` 외 ${course.instructorIds.length - 1}명`}
                </span>
              </div>
            )}

            <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {course.rating}
                <span className="text-gray-400">({formatNumber(course.reviewCount)})</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                {formatNumber(course.enrollment)}명
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.floor(course.durationMin / 60)}시간 {course.durationMin % 60}분
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between border-t border-gray-100 pt-3">
              <div>
                {isFree ? (
                  <span className="text-base font-bold text-emerald-600">무료</span>
                ) : (
                  <>
                    <span className="text-base font-bold text-gray-900">
                      {formatNumber(course.price)}원
                    </span>
                    {course.originalPrice && (
                      <span className="ml-1.5 text-xs text-gray-400 line-through">
                        {formatNumber(course.originalPrice)}원
                      </span>
                    )}
                  </>
                )}
              </div>
              <span className="text-xs text-gray-500">{course.lessonCount}강</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
