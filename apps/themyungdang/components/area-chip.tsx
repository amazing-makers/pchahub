'use client'

import { Building2, Check } from 'lucide-react'
import { formatNumber } from '@amakers/utils'
import type { MockArea } from '@/lib/mock-data'

interface AreaChipProps {
  area: MockArea
  listingCount: number
  /** If set, a compare-toggle checkbox is shown */
  selected?: boolean
  onToggleCompare?: () => void
  /** Disable compare toggle (e.g. max selected) */
  disableCompare?: boolean
}

export function AreaChip({
  area, listingCount,
  selected = false, onToggleCompare, disableCompare = false,
}: AreaChipProps) {
  const hasCompare = !!onToggleCompare

  return (
    <div className="relative">
      <a
        href={`/areas/${area.key}`}
        className={`flex items-start gap-3 rounded-xl border bg-white p-4 transition-colors ${
          selected
            ? 'border-indigo-400 ring-1 ring-indigo-200 shadow-sm'
            : 'border-gray-200 hover:border-[var(--brand-primary)]'
        }`}
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

      {/* Compare toggle button */}
      {hasCompare && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onToggleCompare() }}
          disabled={!selected && disableCompare}
          className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
            selected
              ? 'border-indigo-500 bg-indigo-500 text-white'
              : disableCompare
                ? 'border-gray-200 bg-gray-100 opacity-40 cursor-not-allowed'
                : 'border-gray-300 bg-white hover:border-indigo-400'
          }`}
          aria-label={selected ? '비교 제거' : '비교에 추가'}
          title={selected ? '비교 제거' : !selected && disableCompare ? '최대 3개까지 선택 가능' : '비교에 추가'}
        >
          {selected && <Check className="h-3 w-3" />}
        </button>
      )}
    </div>
  )
}
