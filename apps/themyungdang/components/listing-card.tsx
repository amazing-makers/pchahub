import { CheckCircle2, Eye, MapPin } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import type { MockListing } from '@/lib/mock-data'
import { TYPE_LABEL } from '@/lib/mock-data'

interface ListingCardProps {
  listing: MockListing
  featured?: boolean
}

export function ListingCard({ listing, featured = false }: ListingCardProps) {
  return (
    <a href={`/listings/${listing.id}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          {/* Image */}
          <div
            className="relative h-36 w-full overflow-hidden rounded-t-xl"
            style={{
              background: `linear-gradient(135deg, ${listing.imageColors[0]}, ${listing.imageColors[1] ?? listing.imageColors[0]})`,
            }}
            aria-hidden
          >
            <div className="absolute left-3 top-3 flex flex-wrap gap-1">
              <Badge variant={listing.type === 'transfer' ? 'primary' : 'default'}>
                {TYPE_LABEL[listing.type]}
              </Badge>
              {listing.verified && (
                <Badge variant="success" className="gap-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                  검증
                </Badge>
              )}
              {featured && <Badge variant="warning">광고</Badge>}
            </div>
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
                    {formatNumber(listing.salePrice ?? 0)}만
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
