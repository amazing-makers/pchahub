import { CheckCircle2, TrendingUp } from 'lucide-react'
import { BrandLogo, Card, CardContent, Badge } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import type { MockBrand } from '@/lib/mock-data'

interface BrandCardProps {
  brand: MockBrand
  /** When true, renders larger logo and "광고" badge for featured placements. */
  featured?: boolean
}

export function BrandCard({ brand, featured = false }: BrandCardProps) {
  // 카테고리 대표 사진(Unsplash)도 포함 — heroImage가 있으면 표시
  const showPhoto = !!brand.heroImage
  return (
    <a href={`/brands/${brand.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div
          className="relative aspect-[4/3] w-full overflow-hidden"
          style={showPhoto ? undefined : { background: brand.logoColor }}
        >
          {showPhoto ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.heroImage}
                alt={`${brand.name} 매장 이미지`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Bottom shade for legibility */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
            </>
          ) : (
            // 진짜 매장 사진 없음 — 브랜드 컬러 + 모노그램만 표시 (잘못된 stock 사진 대신)
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/10 to-black/20">
              <BrandLogo brand={brand} size="xl" bordered />
            </div>
          )}

          {/* Badges */}
          {featured && (
            <Badge variant="primary" className="absolute right-2 top-2 shrink-0">
              광고
            </Badge>
          )}
          {brand.recruiting && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
              가맹 모집중
            </span>
          )}

          {/* Logo + name overlay — 사진 있을 때만 (placeholder에는 큰 모노그램이 이미 중앙에) */}
          {showPhoto && (
            <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
              <BrandLogo brand={brand} size={featured ? 'md' : 'sm'} bordered />
              <div className="min-w-0 text-white drop-shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="truncate text-sm font-bold">{brand.name}</span>
                  {brand.hqVerified && (
                    <CheckCircle2
                      className="h-3 w-3 shrink-0 text-blue-200"
                      aria-label="협회 등록 정보공개서 확인"
                    />
                  )}
                </div>
                <div className="text-[11px] text-white/80">{brand.categoryLabel}</div>
              </div>
            </div>
          )}
        </div>

        {/* placeholder 카드는 사진 위에 이름이 없으므로 본문 위쪽에 표시 */}
        {!showPhoto && (
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
