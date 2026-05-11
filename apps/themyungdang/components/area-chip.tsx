import { Building2 } from 'lucide-react'
import { formatNumber } from '@amakers/utils'
import type { MockArea } from '@/lib/mock-data'

interface AreaChipProps {
  area: MockArea
  listingCount: number
}

export function AreaChip({ area, listingCount }: AreaChipProps) {
  return (
    <a
      href={`/areas/${area.key}`}
      className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[var(--brand-primary)]"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: 'var(--brand-primary)' }}
      >
        <Building2 className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-gray-900">{area.name}</div>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {listingCount}건
          </span>
        </div>
        <div className="mt-0.5 text-xs text-gray-500">
          {area.region} {area.district}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          일 유동 약 {formatNumber(area.footTraffic)}명 · 평당 월세 평균 {area.avgMonthlyRentPerPyeong}만
        </div>
      </div>
    </a>
  )
}
