import { Award, CheckCircle2, MapPin, Star, Users } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { brandById, type MockStore } from '@/lib/mock-data'

interface StoreCardProps {
  store: MockStore
}

export function StoreCard({ store }: StoreCardProps) {
  const brand = brandById(store.brandId)

  return (
    <a href={`/stores/${store.id}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div
            className="relative h-32 w-full overflow-hidden rounded-t-xl"
            style={{
              background: `linear-gradient(135deg, ${store.imageColor}, ${store.imageColor}AA)`,
            }}
            aria-hidden
          >
            <div className="absolute left-3 top-3 flex flex-wrap gap-1">
              {brand && (
                <Badge variant="default" className="bg-white/90 text-gray-900">
                  {brand.categoryLabel}
                </Badge>
              )}
              {store.verified && (
                <Badge variant="success" className="gap-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                  인증
                </Badge>
              )}
            </div>
            {store.awards.length > 0 && (
              <div className="absolute right-3 top-3">
                <Badge variant="warning" className="gap-0.5">
                  <Award className="h-3 w-3" />
                  {store.awards.length}회 수상
                </Badge>
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2">
              {brand && (
                <span
                  className="h-5 w-5 shrink-0 rounded-md"
                  style={{ background: brand.logoColor }}
                  aria-hidden
                />
              )}
              <span className="text-xs text-gray-500">{brand?.name}</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-gray-900 line-clamp-1">
              {store.name}
            </h3>
            <div className="mt-1.5 inline-flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              {store.region} {store.district} · {store.area}평
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs text-gray-700">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{store.rating}</span>
                <span className="text-gray-400">({formatNumber(store.reviewCount)})</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                월 {formatNumber(store.monthlyVisitors)}명
              </span>
            </div>

            {store.awards.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {store.awards.slice(0, 2).map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-800"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
