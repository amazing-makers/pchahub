'use client'

import { useEffect, useState } from 'react'
import { Clock, MapPin } from 'lucide-react'

interface RecentListingEntry {
  id: string
  title: string
  region: string
  listingType: string
}

export function RecentlyViewedListings() {
  const [listings, setListings] = useState<RecentListingEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('pchahub:recentListings')
      if (raw) {
        const parsed = JSON.parse(raw) as unknown[]
        const entries: RecentListingEntry[] = parsed
          .filter((item): item is RecentListingEntry => typeof item === 'object' && item !== null && 'id' in item)
          .slice(0, 6)
        setListings(entries)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || listings.length === 0) return null

  return (
    <section className="container mx-auto pt-section">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-400" />
        <h2 className="text-h4 font-semibold text-gray-900">최근 본 매물</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {listings.map((l) => (
          <a
            key={l.id}
            href={`/listings/${l.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-400" />
            <span className="truncate max-w-[140px]">{l.title}</span>
            <span className="text-xs text-gray-400">{l.region}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
