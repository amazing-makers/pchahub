'use client'

import { useEffect, useState } from 'react'
import { Clock, Star, MapPin } from 'lucide-react'
import { STORES } from '@/lib/mock-data'

const STORAGE_KEY = 'bestplace:recentlyViewed'

export function RecentlyViewedStores() {
  const [stores, setStores] = useState<typeof STORES>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const ids = JSON.parse(raw) as string[]
        const matched = ids
          .map((id) => STORES.find((s) => s.id === id))
          .filter((s): s is (typeof STORES)[number] => s !== undefined)
          .slice(0, 6)
        setStores(matched)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || stores.length === 0) return null

  return (
    <section className="container mx-auto pt-section">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-400" />
        <h2 className="text-h4 font-semibold text-gray-900">최근 본 매장</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {stores.map((s) => (
          <a
            key={s.id}
            href={`/stores/${s.id}`}
            className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
          >
            <span
              className="h-5 w-5 shrink-0 rounded-full bg-amber-400"
              aria-hidden
            />
            <span className="truncate max-w-[140px]">{s.name}</span>
            <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {s.rating}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
              <MapPin className="h-3 w-3" />
              {s.region}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
