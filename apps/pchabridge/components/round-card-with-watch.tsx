'use client'

import { useEffect, useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { RoundCard } from './round-card'
import type { MockInvestmentRound } from '@/lib/mock-data'

const KEY = 'pchabridge:watchlist'

export function RoundCardWithWatch({ round }: { round: MockInvestmentRound }) {
  const [watched, setWatched] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setWatched(ids.includes(round.id))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [round.id])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      const next = watched ? ids.filter((id) => id !== round.id) : [...ids, round.id]
      window.localStorage.setItem(KEY, JSON.stringify(next))
      setWatched(!watched)
    } catch { /* ignore */ }
  }

  return (
    <div className="relative">
      <RoundCard round={round} />
      {hydrated && (
        <button
          type="button"
          onClick={toggle}
          className={
            'absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-colors z-10 ' +
            (watched
              ? 'border-amber-300 bg-amber-500 text-white hover:bg-amber-600'
              : 'border-gray-200 bg-white/90 text-gray-500 hover:bg-white hover:text-gray-700')
          }
          aria-label={watched ? '관심 해제' : '관심 추가'}
        >
          {watched ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
}
