'use client'

import { useEffect, useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { EpisodeCard } from './episode-card'
import type { MockEpisode } from '@/lib/mock-data'

const KEY = 'changupdocu:watchLater'

export function EpisodeCardWithSave({ episode, large }: { episode: MockEpisode; large?: boolean }) {
  const [saved, setSaved] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setSaved(ids.includes(episode.id))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [episode.id])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      const next = saved ? ids.filter((id) => id !== episode.id) : [...ids, episode.id]
      window.localStorage.setItem(KEY, JSON.stringify(next))
      setSaved(!saved)
    } catch { /* ignore */ }
  }

  return (
    <div className="relative">
      <EpisodeCard episode={episode} large={large} />
      {hydrated && (
        <button
          type="button"
          onClick={toggle}
          className={
            'absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-colors z-10 ' +
            (saved
              ? 'border-amber-300 bg-amber-500 text-white hover:bg-amber-600'
              : 'border-gray-200 bg-white/90 text-gray-500 hover:bg-white hover:text-gray-700')
          }
          aria-label={saved ? '나중에 보기 해제' : '나중에 보기'}
        >
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
}
