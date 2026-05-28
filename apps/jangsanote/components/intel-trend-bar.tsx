'use client'

import { Minus, TrendingDown, TrendingUp } from 'lucide-react'

interface Props {
  label: string
  value: number
  trend: 'UP' | 'STABLE' | 'DOWN'
  maxValue?: number
}

export function IntelTrendBar({ label, value, trend, maxValue = 100 }: Props) {
  const pct = Math.min(100, Math.round((value / Math.max(maxValue, 1)) * 100))

  const barColor =
    trend === 'UP'
      ? 'bg-green-500'
      : trend === 'DOWN'
        ? 'bg-red-400'
        : 'bg-gray-400'

  const textColor =
    trend === 'UP'
      ? 'text-green-600'
      : trend === 'DOWN'
        ? 'text-red-500'
        : 'text-gray-500'

  const TrendIcon =
    trend === 'UP' ? TrendingUp : trend === 'DOWN' ? TrendingDown : Minus

  return (
    <div className="flex items-center gap-3 py-1.5">
      {/* Label */}
      <span className="w-20 shrink-0 truncate text-sm font-medium text-gray-700" title={label}>
        {label}
      </span>

      {/* Bar */}
      <div className="flex-1 overflow-hidden rounded-full bg-gray-100" style={{ height: '8px' }}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Value */}
      <span className="w-6 shrink-0 text-right text-xs font-semibold text-gray-600">
        {value}
      </span>

      {/* Trend icon */}
      <TrendIcon className={`h-4 w-4 shrink-0 ${textColor}`} />
    </div>
  )
}
