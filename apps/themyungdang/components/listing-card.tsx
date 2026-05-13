'use client'

import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Eye, Heart, MapPin } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import type { MockListing } from '@/lib/mock-data'
import { TYPE_LABEL } from '@/lib/mock-data'

// ── Shared localStorage key (same as map-search-client) ───────────────────────
const FAV_KEY = 'tmyd-fav'

function formatManwon(manwon: number): string {
  if (manwon >= 10000) {
    const eok = manwon / 10000
    return eok % 1 === 0 ? `${eok}억` : `${Math.round(eok * 10) / 10}억`
  }
  return `${formatNumber(manwon)}만`
}

// ── Favorites hook — useEffect pattern avoids SSR hydration mismatch ──────────
function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Load from localStorage after mount (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY)
      if (raw) setFavorites(new Set(JSON.parse(raw) as string[]))
    } catch { /* ignore */ }
  }, [])

  const toggle = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      try { localStorage.setItem(FAV_KEY, JSON.stringify([...next])) } catch { /* ignore */ }
      return next
    })
  }, [])

  return { favorites, toggle }
}

interface ListingCardProps {
  listing: MockListing
  featured?: boolean
}

export function ListingCard({ listing, featured = false }: ListingCardProps) {
  const { favorites, toggle } = useFavorites()
  const isFav = favorites.has(listing.id)

  return (
    <a href={`/listings/${listing.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          {/* Hero image */}
          <div className="relative h-44 w-full overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />

            {/* Type badge + featured badge */}
            <div className="absolute left-3 top-3 flex flex-wrap gap-1">
              <Badge variant={listing.type === 'transfer' ? 'primary' : listing.type === 'sale' ? 'warning' : 'default'}>
                {TYPE_LABEL[listing.type]}
              </Badge>
              {featured && <Badge variant="warning">광고</Badge>}
            </div>

            {/* Verified badge */}
            {listing.verified && (
              <span className="absolute right-3 top-3 inline-flex items-center gap-0.5 rounded-full bg-blue-500/95 px-2 py-0.5 text-xs font-medium text-white">
                <CheckCircle2 className="h-3 w-3" />
                실사 완료
              </span>
            )}

            {/* Favorite button */}
            <button
              type="button"
              onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(listing.id) }}
              className={`absolute bottom-3 right-3 rounded-full p-1.5 backdrop-blur-sm transition-all ${
                isFav
                  ? 'bg-rose-500 text-white shadow-lg'
                  : 'bg-black/30 text-white hover:bg-rose-500'
              }`}
              aria-label={isFav ? '찜 해제' : '찜하기'}
            >
              <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            <div className="text-base font-semibold text-gray-900 line-clamp-1">
              {listing.title}
            </div>
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              {listing.region} {listing.district} · {listing.area}평 · {listing.floor}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-lg bg-gray-50 px-3 py-2.5 text-xs">
              {listing.type === 'sale' ? (
                <div className="col-span-3 text-center">
                  <div className="text-gray-500">매각가</div>
                  <div className="mt-0.5 text-sm font-bold text-gray-900">
                    {formatManwon(listing.salePrice ?? 0)}
                  </div>
                </div>
              ) : (
                <>
                  <PriceCell
                    label="권리금"
                    value={
                      listing.rightFee === undefined
                        ? '-'
                        : listing.rightFee === 0
                          ? '없음'
                          : `${formatNumber(listing.rightFee)}만`
                    }
                  />
                  <PriceCell label="보증금" value={`${formatNumber(listing.deposit)}만`} />
                  <PriceCell label="월세" value={`${formatNumber(listing.monthlyRent)}만`} />
                </>
              )}
            </div>

            {listing.monthlyRevenue && (
              <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                <span className="font-medium">검증 월매출</span>
                <span className="font-semibold">{formatNumber(listing.monthlyRevenue)}만</span>
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-1">
              {listing.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
              <span>일 유동 {formatNumber(listing.footTraffic)}명</span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {formatNumber(listing.viewCount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}

function PriceCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div className="mt-0.5 font-semibold text-gray-900">{value}</div>
    </div>
  )
}
