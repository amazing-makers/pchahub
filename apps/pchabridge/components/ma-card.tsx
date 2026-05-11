import { Lock, MessageSquare } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { brandById, type MockMAListing } from '@/lib/mock-data'

interface MACardProps {
  listing: MockMAListing
}

const STATUS_LABEL: Record<MockMAListing['status'], string> = {
  open: '매물 공개',
  'under-negotiation': '협상 중',
  closed: '거래 완료',
}

const STATUS_VARIANT: Record<MockMAListing['status'], 'success' | 'warning' | 'default'> = {
  open: 'success',
  'under-negotiation': 'warning',
  closed: 'default',
}

export function MACard({ listing }: MACardProps) {
  const brand = brandById(listing.brandId)

  return (
    <a href={`/ma/${listing.id}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <Badge variant={STATUS_VARIANT[listing.status]}>{STATUS_LABEL[listing.status]}</Badge>
            {listing.ndaRequired && (
              <Badge variant="default" className="gap-0.5">
                <Lock className="h-3 w-3" />
                NDA 필요
              </Badge>
            )}
          </div>

          <div className="mt-4 flex items-start gap-3">
            {brand && (
              <span
                className="h-12 w-12 shrink-0 rounded-xl"
                style={{ background: brand.logoColor }}
                aria-hidden
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="text-base font-bold text-gray-900">{brand?.name ?? '본사'} 매각</div>
              <div className="mt-0.5 text-xs text-gray-500">
                {brand?.categoryLabel} · 매장 {listing.storeCount}개 · {listing.yearsOperating}년차
              </div>
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-gray-700">{listing.rationale}</p>

          <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-3 text-xs">
            <div>
              <div className="text-gray-500">매각 희망가</div>
              <div className="mt-0.5 text-base font-bold text-gray-900">
                {formatNumber(listing.askingPrice)}만
              </div>
            </div>
            <div>
              <div className="text-gray-500">연 매출 (본사)</div>
              <div className="mt-0.5 font-semibold text-gray-900">
                {formatNumber(listing.annualRevenue)}만
              </div>
            </div>
            <div>
              <div className="text-gray-500">연 영업이익</div>
              <div className="mt-0.5 font-semibold text-emerald-600">
                {formatNumber(listing.annualProfit)}만
              </div>
            </div>
            <div>
              <div className="text-gray-500">P/E</div>
              <div className="mt-0.5 font-semibold text-gray-900">
                {(listing.askingPrice / listing.annualProfit).toFixed(1)}배
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
            <span>등록 {listing.listedAt}</span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              문의 {listing.inquiryCount}건
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
