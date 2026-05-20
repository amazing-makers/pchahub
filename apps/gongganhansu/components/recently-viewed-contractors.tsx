'use client'

import { useEffect, useState } from 'react'
import { Clock, MapPin, Star } from 'lucide-react'
import { CONTRACTORS } from '@/lib/mock-data'

const STORAGE_KEY = 'gongganhansu:recentlyViewed'

export function RecentlyViewedContractors() {
  const [contractors, setContractors] = useState<typeof CONTRACTORS>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const ids = JSON.parse(raw) as string[]
        const matched = ids
          .map((id) => CONTRACTORS.find((c) => c.id === id))
          .filter((c): c is (typeof CONTRACTORS)[number] => c !== undefined)
          .slice(0, 6)
        setContractors(matched)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || contractors.length === 0) return null

  return (
    <section className="container mx-auto pt-section">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-400" />
        <h2 className="text-h4 font-semibold text-gray-900">최근 본 시공사</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {contractors.map((c) => (
          <a
            key={c.id}
            href={`/contractors/${c.id}`}
            className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: c.brandColor }}
            >
              {c.name.charAt(0)}
            </span>
            <span className="max-w-[140px] truncate">{c.name}</span>
            <span className="inline-flex items-center gap-0.5 text-xs text-amber-500">
              <Star className="h-3 w-3 fill-amber-400" />
              {c.rating}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
              <MapPin className="h-3 w-3" />
              {c.region}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
