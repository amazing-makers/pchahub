'use client'

import { useEffect, useState } from 'react'
import { Clock, TrendingUp } from 'lucide-react'
import { BRANDS, ROUND_TYPE_LABEL, ROUNDS } from '@/lib/mock-data'

const STORAGE_KEY = 'pchabridge:recentRounds'

export function RecentlyViewedRounds() {
  const [rounds, setRounds] = useState<typeof ROUNDS>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const ids = JSON.parse(raw) as string[]
        const matched = ids
          .map((id) => ROUNDS.find((r) => r.id === id))
          .filter((r): r is (typeof ROUNDS)[number] => r !== undefined)
          .slice(0, 6)
        setRounds(matched)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || rounds.length === 0) return null

  return (
    <section className="border-b border-gray-100 bg-white py-4">
      <div className="container mx-auto">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">최근 본 투자 라운드</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {rounds.map((r) => {
            const brand = BRANDS.find((b) => b.id === r.brandId)
            return (
              <a
                key={r.id}
                href={`/investments/${r.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
              >
                <span
                  className="h-5 w-5 shrink-0 rounded-full"
                  style={{ background: brand?.logoColor ?? '#6B7280' }}
                  aria-hidden
                />
                <span className="max-w-[140px] truncate">{brand?.name ?? r.id}</span>
                <span className="shrink-0 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-800">
                  {ROUND_TYPE_LABEL[r.type]}
                </span>
                <span className="inline-flex shrink-0 items-center gap-0.5 text-xs text-gray-400">
                  <TrendingUp className="h-3 w-3" />
                  {r.expectedAnnualROI}%
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
