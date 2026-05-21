'use client'
import { useEffect } from 'react'

const STORAGE_KEY = 'pchabridge:recentMA'
const MAX_RECENT = 30

interface RecentMAEntry {
  id: string
  brandName: string
  storeCount: number
  askingPrice: number
}

interface Props {
  maId: string
  brandName: string
  storeCount: number
  askingPrice: number
}

export function MAViewTracker({ maId, brandName, storeCount, askingPrice }: Props) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const entries: RecentMAEntry[] = raw ? JSON.parse(raw) : []
      const entry: RecentMAEntry = { id: maId, brandName, storeCount, askingPrice }
      const next = [entry, ...entries.filter((e) => e.id !== maId)].slice(0, MAX_RECENT)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }, [maId, brandName, storeCount, askingPrice])

  return null
}
