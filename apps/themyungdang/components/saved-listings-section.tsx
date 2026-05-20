'use client'

import { useEffect, useState } from 'react'
import { Bookmark, MapPin, DollarSign } from 'lucide-react'
import { LISTINGS } from '@amakers/listings'
import type { MockListing } from '@amakers/listings'

const KEY = 'themyungdang:savedListings'

const TYPE_LABEL: Record<MockListing['type'], string> = {
  transfer: '양도',
  new: '신규임대',
  sale: '매각',
}

function formatPrice(listing: MockListing): string {
  if (listing.type === 'sale' && listing.salePrice) {
    return `${(listing.salePrice / 10000).toFixed(0)}억`
  }
  if (listing.monthlyRent > 0) return `월 ${listing.monthlyRent}만`
  if (listing.deposit > 0) return `보 ${listing.deposit}만`
  return '가격 문의'
}

export function SavedListingsSection() {
  const [ids, setIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      setIds(raw ? JSON.parse(raw) : [])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated) return null

  const saved = ids
    .map((id) => LISTINGS.find((l) => l.id === id))
    .filter((l): l is NonNullable<typeof l> => Boolean(l))

  if (saved.length === 0) return null

  return (
    <section className="container mx-auto pt-section">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
            <Bookmark className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
            저장한 매물
          </h2>
          <p className="mt-1 text-sm text-gray-500">{saved.length}건 저장됨</p>
        </div>
        <a href="/listings" className="text-sm text-gray-600 hover:text-gray-900">
          전체 매물 보기 →
        </a>
      </div>
      <div className="flex flex-wrap gap-2">
        {saved.map((listing) => (
          <a
            key={listing.id}
            href={`/listings/${listing.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">
              {TYPE_LABEL[listing.type]}
            </span>
            <span className="max-w-[160px] truncate font-medium">{listing.title}</span>
            <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
              <MapPin className="h-3 w-3" />
              {listing.district || listing.region}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-gray-700">
              <DollarSign className="h-3 w-3" />
              {formatPrice(listing)}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
