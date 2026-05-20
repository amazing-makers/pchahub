'use client'

import { useEffect, useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@amakers/ui'

const KEY = 'gongganhansu:savedInsights'

export function SaveInsightButton({ insightId }: { insightId: string }) {
  const [saved, setSaved] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setSaved(ids.includes(insightId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [insightId])

  function toggle() {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      const next = saved ? ids.filter((id) => id !== insightId) : [...ids, insightId]
      window.localStorage.setItem(KEY, JSON.stringify(next))
      setSaved(!saved)
    } catch { /* ignore */ }
  }

  if (!hydrated) return <div className="h-9 w-28 animate-pulse rounded-xl bg-gray-100" />

  return (
    <Button
      size="sm"
      variant={saved ? 'primary' : 'outline'}
      onClick={toggle}
      className="gap-1.5"
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {saved ? '저장됨' : '저장'}
    </Button>
  )
}
