'use client'

import { useEffect, useState } from 'react'
import { Clock, Star, BookOpen } from 'lucide-react'
import { COURSES } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'

const STORAGE_KEY = 'themanual:recentlyViewed'

const LEVEL_LABEL: Record<string, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
}

export function RecentlyViewedCourses() {
  const [courses, setCourses] = useState<typeof COURSES>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const ids = JSON.parse(raw) as string[]
        const matched = ids
          .map((id) => COURSES.find((c) => c.id === id))
          .filter((c): c is (typeof COURSES)[number] => c !== undefined)
          .slice(0, 6)
        setCourses(matched)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || courses.length === 0) return null

  return (
    <section className="container mx-auto pt-section">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-400" />
        <h2 className="text-h4 font-semibold text-gray-900">최근 본 강의</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {courses.map((course) => (
          <a
            key={course.id}
            href={`/courses/${course.id}`}
            className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              style={{ background: course.thumbnailColor }}
              aria-hidden
            >
              <BookOpen className="h-3 w-3 text-white" />
            </span>
            <span className="max-w-[160px] truncate">{course.title}</span>
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
              {LEVEL_LABEL[course.level] ?? course.level}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs text-amber-500">
              <Star className="h-3 w-3 fill-amber-400" />
              {course.rating}
            </span>
            <span className="text-xs text-gray-400">
              {course.price === 0 ? '무료' : `${formatNumber(course.price)}원`}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
