'use client'

import { useEffect, useState } from 'react'
import { Award, Bookmark, CheckCircle2, MapPin, Star, Users } from 'lucide-react'
import { Badge, BrandLogo, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { brandById, type MockStore } from '@/lib/mock-data'

const SAVE_KEY = 'bestplace:savedStores'

function useSaved(storeId: string) {
  const [saved, setSaved] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SAVE_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      setSaved(ids.includes(storeId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [storeId])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      const raw = window.localStorage.getItem(SAVE_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = ids.includes(storeId)
        ? ids.filter((id) => id !== storeId)
        : [storeId, ...ids]
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(next))
      setSaved(!saved)
    } catch { /* ignore */ }
  }

  return { saved, hydrated, toggle }
}

interface StoreCardProps {
  store: MockStore
}

export function StoreCard({ store }: StoreCardProps) {
  const brand = brandById(store.brandId)
  const { saved, hydrated, toggle } = useSaved(store.id)

  return (
    <a href={`/stores/${store.id}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={store.heroImage}
              alt={store.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
            {/* Save / bookmark overlay */}
            {hydrated && (
              <button
                type="button"
                onClick={toggle}
                aria-label={saved ? '찜 취소' : '찜하기'}
                aria-pressed={saved}
                className={
                  'absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full shadow transition-colors ' +
                  (saved
                    ? 'bg-rose-600 text-white'
                    : 'bg-white/90 text-gray-600 hover:bg-white hover:text-rose-600')
                }
              >
                <Bookmark className={`h-4 w-4 ${saved ? 'fill-white' : ''}`} />
              </button>
            )}
            <div className="absolute left-3 top-3 flex flex-wrap gap-1">
              {brand && (
                <Badge variant="default" className="bg-white/95 text-gray-900">
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
                <BrandLogo
                  brand={{ name: brand.name, logoColor: brand.logoColor, category: brand.category }}
                  size="sm"
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
