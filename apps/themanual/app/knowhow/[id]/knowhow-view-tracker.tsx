'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'themanual:recentKnowhow'
const MAX_RECENT = 30

interface RecentKnowhowEntry {
  id: string
  title: string
  category: string
}

interface KnowhowViewTrackerProps {
  knowhowId: string
  knowhowTitle: string
  knowhowCategory: string
}

export function KnowhowViewTracker({ knowhowId, knowhowTitle, knowhowCategory }: KnowhowViewTrackerProps) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const entries: RecentKnowhowEntry[] = raw ? (JSON.parse(raw) as RecentKnowhowEntry[]) : []
      const entry: RecentKnowhowEntry = { id: knowhowId, title: knowhowTitle, category: knowhowCategory }
      const next = [entry, ...entries.filter((e) => e.id !== knowhowId)].slice(0, MAX_RECENT)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* ignore */ }
  }, [knowhowId, knowhowTitle, knowhowCategory])

  return null
}
