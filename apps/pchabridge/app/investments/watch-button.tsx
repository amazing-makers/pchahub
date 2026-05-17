'use client'
import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'

const WATCHLIST_KEY = 'pchabridge:watchlist'

interface WatchButtonProps {
  roundId: string
}

export function WatchButton({ roundId }: WatchButtonProps) {
  const [watching, setWatching] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(WATCHLIST_KEY)
      const list = raw ? JSON.parse(raw) as { roundId: string }[] : []
      setWatching(list.some(r => r.roundId === roundId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [roundId])

  const toggle = () => {
    try {
      const raw = window.localStorage.getItem(WATCHLIST_KEY)
      const list = raw ? JSON.parse(raw) as { roundId: string; addedAt: string }[] : []
      if (watching) {
        window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list.filter(r => r.roundId !== roundId)))
        setWatching(false)
      } else {
        window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify([{ roundId, addedAt: new Date().toISOString().slice(0, 10) }, ...list]))
        setWatching(true)
      }
    } catch { /* ignore */ }
  }

  if (!hydrated) return <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-100" />

  return (
    <button
      type="button"
      onClick={toggle}
      className={
        'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ' +
        (watching ? 'border-amber-200 bg-amber-50 text-amber-600' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50')
      }
      aria-label={watching ? '관심 해제' : '관심 추가'}
    >
      {watching ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </button>
  )
}
