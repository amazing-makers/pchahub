'use client'

import { useEffect, useState } from 'react'
import { ThumbsUp } from 'lucide-react'

const STORAGE_KEY = 'bestplace:votes'

interface AwardVoteButtonProps {
  awardId: string
}

export function AwardVoteButton({ awardId }: AwardVoteButtonProps) {
  const [voted, setVoted] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      setVoted(ids.includes(awardId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [awardId])

  function toggle() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = ids.includes(awardId)
        ? ids.filter((id) => id !== awardId)
        : [...ids, awardId]
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setVoted(!voted)
    } catch { /* ignore */ }
  }

  if (!hydrated) return null

  return (
    <button
      type="button"
      onClick={toggle}
      className={
        'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ' +
        (voted
          ? 'border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50')
      }
      aria-pressed={voted}
    >
      <ThumbsUp className={`h-3.5 w-3.5 ${voted ? 'fill-current' : ''}`} />
      {voted ? '투표 완료' : '이 수상 추천'}
    </button>
  )
}
