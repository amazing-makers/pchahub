'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'bestplace:recentlyViewed'
const MAX_RECENT = 50

export function StoreViewTracker({ storeId }: { storeId: string }) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = [storeId, ...ids.filter((id) => id !== storeId)].slice(0, MAX_RECENT)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* ignore */ }
  }, [storeId])

  return null
}
