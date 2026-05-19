'use client'

import { useEffect, useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@amakers/ui'

const KEY = 'changupdocu:savedEpisodes'

export function SaveEpisodeButton({ episodeId }: { episodeId: string }) {
  const [saved, setSaved] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setSaved(ids.includes(episodeId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [episodeId])

  function toggle() {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      const next = saved ? ids.filter((id) => id !== episodeId) : [...ids, episodeId]
      window.localStorage.setItem(KEY, JSON.stringify(next))
      setSaved(!saved)
    } catch { /* ignore */ }
  }

  return (
    <Button
      size="sm"
      variant={hydrated && saved ? 'primary' : 'outline'}
      className="gap-1.5"
      onClick={toggle}
      disabled={!hydrated}
    >
      {hydrated && saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
      {hydrated && saved ? '저장됨' : '에피소드 저장'}
    </Button>
  )
}
