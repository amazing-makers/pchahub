'use client'

import { useEffect, useState } from 'react'

const KEY = 'themanual:completedLessons'

interface CourseProgressProps {
  lessonIds: string[]
}

export function CourseProgress({ lessonIds }: CourseProgressProps) {
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) setCompletedIds(JSON.parse(raw) as string[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated) return null

  const completed = lessonIds.filter((id) => completedIds.includes(id)).length
  const total = lessonIds.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  if (total === 0) return null

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900">수강 진도</span>
        <span className="text-gray-500">
          {completed}/{total}강 완료 ({pct}%)
        </span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
