import { CheckCircle2, MapPin, Users } from 'lucide-react'
import { Card, CardContent, Badge } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import type { MockListing } from '@/lib/mock-listings'

interface ListingCardProps {
  listing: MockListing
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <a href={`/listings/${listing.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <Badge
            variant={listing.listingType === '양도' ? 'warning' : 'primary'}
            className="absolute left-2 top-2 shrink-0"
          >
            {listing.listingType}
          </Badge>
          {listing.verified && (
            <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-blue-500/95 px-2 py-0.5 text-xs font-medium text-white">
              <CheckCircle2 className="h-3 w-3" />
              실사 완료
            </span>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="line-clamp-1 text-base font-semibold text-gray-900">{listing.title}</h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            {listing.region} · {listing.district}
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-sm text-gray-500">보증금</span>
            <span className="text-base font-bold text-gray-900">
              {formatNumber(listing.deposit)}<span className="text-xs font-medium text-gray-500">만</span>
            </span>
            <span className="ml-auto text-xs text-gray-500">월세</span>
            <span className="text-sm font-semibold text-gray-900">
              {formatNumber(listing.monthlyRent)}<span className="text-xs font-medium text-gray-500">만</span>
            </span>
          </div>

          {listing.rightFee > 0 && (
            <div className="mt-1 text-xs text-gray-500">
              권리금 <span className="font-semibold text-gray-700">{formatNumber(listing.rightFee)}만</span>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-1">
            {listing.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
            <span>{listing.area}평 · {listing.availableFrom} 입점 가능</span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" />
              {listing.inquiryCount}건 문의
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
