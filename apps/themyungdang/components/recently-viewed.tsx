'use client'

import { useEffect } from 'react'
import { Clock, X } from 'lucide-react'
import { LISTINGS } from '@/lib/mock-data'
import { useRecentlyViewed } from '@/hooks/use-recently-viewed'
import { ListingCard } from '@/components/listing-card'
import { formatNumber } from '@amakers/utils'

// ── TrackView: lightweight component that records the current listing on mount ─
export function TrackView({ listingId }: { listingId: string }) {
  const { markViewed } = useRecentlyViewed()
  useEffect(() => {
    markViewed(listingId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId])
  return null
}

// ── RecentlyViewedSection: renders the grid (skip current listing) ─────────────
export function RecentlyViewedSection({ currentId }: { currentId?: string }) {
  const { recentIds, clearHistory } = useRecentlyViewed()

  const items = recentIds
    .filter(id => id !== currentId)
    .map(id => LISTINGS.find(l => l.id === id))
    .filter(Boolean)
    .slice(0, 4) as (typeof LISTINGS)[number][]

  if (items.length === 0) return null

  return (
    <section className="container mx-auto py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-h4 font-semibold text-gray-900">
          <Clock className="h-5 w-5 text-gray-400" />
          최근 본 매물
        </h2>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700"
        >
          <X className="h-3 w-3" />
          기록 삭제
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map(l => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </section>
  )
}

// ── Compact mini list for sidebars / small spaces ─────────────────────────────
export function RecentlyViewedMini({ currentId, limit = 4 }: { currentId?: string; limit?: number }) {
  const { recentIds } = useRecentlyViewed()

  const items = recentIds
    .filter(id => id !== currentId)
    .map(id => LISTINGS.find(l => l.id === id))
    .filter(Boolean)
    .slice(0, limit) as (typeof LISTINGS)[number][]

  if (items.length === 0) return null

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">최근 본 매물</p>
      <div className="space-y-2">
        {items.map(l => (
          <a
            key={l.id}
            href={`/listings/${l.id}`}
            className="flex items-center gap-2.5 rounded-xl border border-gray-100 p-2.5 text-sm hover:border-gray-300 hover:bg-gray-50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.images[0]} alt="" className="h-10 w-12 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-gray-900">{l.title}</p>
              <p className="mt-0.5 text-[10px] text-gray-500">
                {l.region} {l.district} · {l.area}평
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-gray-700">
                월세 {formatNumber(l.monthlyRent)}만
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
