'use client'

import { CheckCircle2, Eye, Heart, MapPin, TrendingUp, User } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import type { MockListing } from '@/lib/mock-data'
import { TYPE_LABEL } from '@/lib/mock-data'
import { useFavorites } from '@/hooks/use-favorites'

function formatManwon(manwon: number): string {
  if (manwon >= 10000) {
    const eok = manwon / 10000
    return eok % 1 === 0 ? `${eok}억` : `${Math.round(eok * 10) / 10}억`
  }
  return `${formatNumber(manwon)}만`
}

const TYPE_COLOR: Record<string, string> = {
  transfer: 'bg-rose-500',
  new:      'bg-blue-600',
  sale:     'bg-violet-600',
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
      <Card className="h-full overflow-hidden border-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-200/60">
        <CardContent className="p-0">

          {/* ── Hero image ────────────────────────────────────────────────── */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
            {listing.images[0] ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </>
            ) : (
              // 사진 없는 외부 매물 — 옅은 컬러 블록 + 카테고리 아이콘 자리
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                <span className="text-xs">사진 준비 중</span>
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Type + featured badge */}
            <div className="absolute left-3 top-3 flex flex-wrap gap-1">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white ${TYPE_COLOR[listing.type] ?? 'bg-gray-500'}`}>
                {TYPE_LABEL[listing.type]}
              </span>
              {featured && (
                <span className="inline-flex items-center rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  광고
                </span>
              )}
            </div>

            {/* Verified */}
            {listing.verified && (
              <span className="absolute right-3 top-3 inline-flex items-center gap-0.5 rounded-full bg-blue-500/95 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                <CheckCircle2 className="h-3 w-3" />
                실사 완료
              </span>
            )}

            {/* Direct owner / external source — bottom-left on image */}
            {listing.ownerType === 'direct' ? (
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-0.5 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
                <User className="h-2.5 w-2.5 text-emerald-500" />
                직거래
              </span>
            ) : listing.externalSource ? (
              <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
                {listing.externalSource.label} 제휴
              </span>
            ) : null}

            {/* Favorite */}
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

          {/* ── Card body ─────────────────────────────────────────────────── */}
          <div className="p-4">

            {/* Title */}
            <div className="text-[15px] font-bold leading-snug text-gray-900 line-clamp-1 transition-colors group-hover:text-gray-600">
              {listing.title}
            </div>

            {/* Location */}
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="line-clamp-1">
                {listing.region} {listing.district} · <strong className="text-gray-700">{listing.area}평</strong> · {listing.floor}
              </span>
            </div>

            {/* Price block */}
            <div className="mt-3 rounded-xl bg-gray-50 px-3 py-2.5">
              {listing.type === 'sale' ? (
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-500">매각가</span>
                  <span className="text-base font-black text-gray-900">
                    {formatManwon(listing.salePrice ?? 0)}
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <PriceCell
                    label="권리금"
                    value={
                      listing.rightFee === undefined
                        ? '-'
                        : listing.rightFee === 0
                          ? '없음'
                          : `${formatManwon(listing.rightFee)}`
                    }
                    highlight={listing.rightFee === 0}
                  />
                  <PriceCell label="보증금" value={listing.deposit > 0 ? formatManwon(listing.deposit) : '-'} />
                  <PriceCell label="월세" value={listing.monthlyRent > 0 ? `${formatNumber(listing.monthlyRent)}만` : '-'} emphasized />
                </div>
              )}
            </div>

            {/* Revenue + available date */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {listing.monthlyRevenue && (
                <div className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-medium">월매출</span>
                  <span className="font-bold">{formatNumber(listing.monthlyRevenue)}만</span>
                  {listing.revenueVerified && <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />}
                </div>
              )}
              {listing.availableFrom && (
                <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                  {listing.availableFrom} 입점 가능
                </span>
              )}
            </div>

            {/* Tags */}
            {listing.tags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {listing.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5 text-[11px] text-gray-400">
              <span>일 유동인구 {formatNumber(listing.footTraffic)}명</span>
              <span className="inline-flex items-center gap-0.5">
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

function PriceCell({
  label, value, highlight = false, emphasized = false,
}: {
  label: string; value: string; highlight?: boolean; emphasized?: boolean
}) {
  return (
    <div>
      <div className="text-[10px] text-gray-400">{label}</div>
      <div className={`mt-0.5 font-bold ${
        highlight    ? 'text-emerald-600' :
        emphasized   ? 'text-gray-900' :
        'text-gray-700'
      }`}>
        {value}
      </div>
    </div>
  )
}
