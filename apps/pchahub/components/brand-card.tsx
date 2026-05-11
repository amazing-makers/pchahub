import { CheckCircle2, TrendingUp } from 'lucide-react'
import { Card, CardContent, Badge } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import type { MockBrand } from '@/lib/mock-data'

interface BrandCardProps {
  brand: MockBrand
  /** When true, renders larger logo and "광고" badge for featured placements. */
  featured?: boolean
}

export function BrandCard({ brand, featured = false }: BrandCardProps) {
  return (
    <a href={`/brands/${brand.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative h-36 w-full overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.heroImage}
            alt={`${brand.name} 매장 이미지`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
          {featured && (
            <Badge variant="primary" className="absolute right-2 top-2 shrink-0">
              광고
            </Badge>
          )}
          {brand.recruiting && (
            <Badge
              variant="success"
              className="absolute left-2 top-2 shrink-0 bg-emerald-500 text-white"
            >
              가맹 모집중
            </Badge>
          )}
        </div>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <span
              className={
                'shrink-0 -mt-10 rounded-xl border-2 border-white shadow-sm ' +
                (featured ? 'h-14 w-14' : 'h-12 w-12')
              }
              style={{ background: brand.logoColor }}
              aria-hidden
            />
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-base font-semibold text-gray-900">
                  {brand.name}
                </span>
                {brand.hqVerified && (
                  <CheckCircle2
                    className="h-3.5 w-3.5 shrink-0 text-blue-500"
                    aria-label="협회 등록 정보공개서 확인"
                  />
                )}
              </div>
              <div className="mt-0.5 text-xs text-gray-500">{brand.categoryLabel}</div>
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-gray-600">{brand.description}</p>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-xs">
            <div>
              <div className="text-gray-500">매장</div>
              <div className="mt-0.5 font-semibold text-gray-900">
                {formatNumber(brand.storeCount)}개
              </div>
            </div>
            <div>
              <div className="text-gray-500">창업비</div>
              <div className="mt-0.5 font-semibold text-gray-900">
                {formatNumber(brand.startupCost)}만
              </div>
            </div>
            <div>
              <div className="text-gray-500 inline-flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                성장
              </div>
              <div className="mt-0.5 font-semibold text-emerald-600">
                +{brand.growthRate}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
