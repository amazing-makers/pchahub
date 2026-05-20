'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'pchabridge:recentRounds'
const MAX_RECENT = 30

export function RoundViewTracker({ roundId }: { roundId: string }) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = [roundId, ...ids.filter((id) => id !== roundId)].slice(0, MAX_RECENT)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* ignore */ }
  }, [roundId])

  return null
}
