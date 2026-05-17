'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'

const KEY = 'themanual:completedLessons'

interface LessonCompleteButtonProps {
  lessonId: string
  courseId: string
}

export function LessonCompleteButton({ lessonId, courseId }: LessonCompleteButtonProps) {
  const [completed, setCompleted] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setCompleted(ids.includes(lessonId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [lessonId])

  function toggle() {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      const next = completed ? ids.filter((id) => id !== lessonId) : [...ids, lessonId]
      window.localStorage.setItem(KEY, JSON.stringify(next))
      setCompleted(!completed)
    } catch { /* ignore */ }
  }

  if (!hydrated) return <div className="h-4 w-4 rounded-full bg-gray-100 animate-pulse" />

  return (
    <button
      type="button"
      onClick={toggle}
      className={completed ? 'text-emerald-500 hover:text-emerald-600' : 'text-gray-300 hover:text-gray-400'}
      aria-label={completed ? '완료 취소' : '완료 표시'}
    >
      {completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
    </button>
  )
}
