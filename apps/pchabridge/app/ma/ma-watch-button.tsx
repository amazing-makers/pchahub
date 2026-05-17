'use client'

import { useEffect, useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'

const KEY = 'pchabridge:ma-watchlist'

export function MaWatchButton({ listingId }: { listingId: string }) {
  const [watched, setWatched] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setWatched(ids.includes(listingId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [listingId])

  function toggle() {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      const next = watched ? ids.filter((id) => id !== listingId) : [...ids, listingId]
      window.localStorage.setItem(KEY, JSON.stringify(next))
      setWatched(!watched)
    } catch { /* ignore */ }
  }

  if (!hydrated) return null

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); toggle() }}
      className={
        'flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-colors ' +
        (watched
          ? 'border-amber-300 bg-amber-50 text-amber-600 hover:bg-amber-100'
          : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600')
      }
      aria-label={watched ? '관심 해제' : '관심 추가'}
    >
      {watched ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </button>
  )
}
