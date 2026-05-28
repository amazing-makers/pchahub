import { CheckCircle2, TrendingUp } from 'lucide-react'
import { Card, CardContent, Badge } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import type { MockBrand } from '@/lib/mock-data'
import { BrandCardImage } from './brand-card-image'

interface BrandCardProps {
  brand: MockBrand
  /** When true, renders larger logo and "광고" badge for featured placements. */
  featured?: boolean
}

export function BrandCard({ brand, featured = false }: BrandCardProps) {
  return (
    <a href={`/brands/${brand.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {/* 이미지 + 플레이스홀더 — 로드 실패 시 자동 전환 (client component) */}
          <BrandCardImage brand={brand} featured={featured} />

          {/* Badges */}
          {featured && (
            <Badge variant="primary" className="absolute right-2 top-2 shrink-0 z-10">
              광고
            </Badge>
          )}
          {brand.recruiting && (
            <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
              가맹 모집중
            </span>
          )}
        </div>

        {/* 이미지 없는 카드는 본문 위쪽에 이름 표시 — BrandCardImage 내부에서 처리 */}
        {!brand.heroImage && (
          <div className="border-b border-gray-100 px-5 pt-4 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-base font-bold text-gray-900">{brand.name}</span>
              {brand.hqVerified && (
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0 text-blue-500"
                  aria-label="협회 등록 정보공개서 확인"
                />
              )}
            </div>
            <div className="text-xs text-gray-500">{brand.categoryLabel}</div>
          </div>
        )}

        <CardContent className="p-5">
          <p className="line-clamp-2 text-sm text-gray-600">{brand.description}</p>

          <div className={`mt-4 grid gap-2 border-t border-gray-100 pt-3 text-xs ${brand.avgAnnualSales ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <div>
              <div className="text-gray-500">매장</div>
              <div className="mt-0.5 font-semibold text-gray-900">
                {formatNumber(brand.storeCount)}개
              </div>
            </div>
            <div>
              <div className="text-gray-500">창업비</div>
              <div className="mt-0.5 font-semibold text-gray-900">
                {brand.startupCost > 0 ? `${formatNumber(brand.startupCost)}만` : '-'}
              </div>
            </div>
            {brand.avgAnnualSales != null && brand.avgAnnualSales > 0 && (
              <div>
                <div className="text-gray-500">평균매출</div>
                <div className="mt-0.5 font-semibold text-blue-700">
                  {formatNumber(Math.round(brand.avgAnnualSales / 12))}만/월
                </div>
              </div>
            )}
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
