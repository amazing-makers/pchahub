'use client'

import { useEffect, useState } from 'react'
import { Bookmark, BookOpen } from 'lucide-react'
import { COURSES, LEVEL_LABEL } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'

const STORAGE_KEY = 'themanual:savedCourses'

export function SavedCoursesSection() {
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
    <section className="border-b border-gray-100 bg-blue-50/40">
      <div className="container mx-auto py-5">
        <div className="mb-3 flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-900">저장한 강의</h2>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            {courses.length}
          </span>
          <a
            href="/courses"
            className="ml-auto text-xs text-gray-500 hover:text-gray-700"
          >
            전체 보기 →
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {courses.map((c) => (
            <a
              key={c.id}
              href={`/courses/${c.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
            >
              <BookOpen className="h-4 w-4 shrink-0 text-blue-400" />
              <span className="truncate max-w-[180px]">{c.title}</span>
              <span className="shrink-0 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                {LEVEL_LABEL[c.level]}
              </span>
              <span className="shrink-0 text-xs font-semibold" style={{ color: 'var(--brand-primary)' }}>
                {c.price === 0 ? '무료' : `${formatNumber(c.price)}원`}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
