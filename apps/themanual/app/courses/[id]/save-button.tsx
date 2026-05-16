'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@amakers/ui'

const STORAGE_KEY = 'themanual:savedCourses'

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function SaveCourseButton({ courseId }: { courseId: string }) {
  const [saved, setSaved] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSaved(readSaved().includes(courseId))
    setHydrated(true)
  }, [courseId])

  const toggle = () => {
    const ids = readSaved()
    const next = ids.includes(courseId)
      ? ids.filter((id) => id !== courseId)
      : [courseId, ...ids]
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
    setSaved(!ids.includes(courseId))
  }

  if (!hydrated) {
    return (
      <Button size="lg" variant="outline" className="w-full gap-1.5" disabled>
        <Heart className="h-4 w-4" />
        찜하기
      </Button>
    )
  }

  return (
    <Button
      size="lg"
      variant={saved ? 'primary' : 'outline'}
      className={'w-full gap-1.5 ' + (saved ? 'bg-rose-600 hover:bg-rose-700' : '')}
      onClick={toggle}
    >
      <Heart className={'h-4 w-4 ' + (saved ? 'fill-white' : '')} />
      {saved ? '찜 취소' : '찜하기'}
    </Button>
  )
}
