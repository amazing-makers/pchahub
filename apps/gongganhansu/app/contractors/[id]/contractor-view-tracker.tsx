'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'gongganhansu:recentlyViewed'
const MAX_RECENT = 30

export function ContractorViewTracker({ contractorId }: { contractorId: string }) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = [contractorId, ...ids.filter((id) => id !== contractorId)].slice(0, MAX_RECENT)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* ignore */ }
  }, [contractorId])

  return null
}
