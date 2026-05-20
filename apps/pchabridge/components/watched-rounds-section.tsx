'use client'

import { useEffect, useState } from 'react'
import { Bookmark, TrendingUp } from 'lucide-react'
import { ROUNDS, brandById, ROUND_TYPE_LABEL } from '@/lib/mock-data'

const STORAGE_KEY = 'pchabridge:watchlist'

interface WatchEntry { roundId: string; addedAt?: string }

export function WatchedRoundsSection() {
  const [rounds, setRounds] = useState<typeof ROUNDS>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const entries = JSON.parse(raw) as WatchEntry[]
        const matched = entries
          .map((e) => ROUNDS.find((r) => r.id === e.roundId))
          .filter((r): r is (typeof ROUNDS)[number] => r !== undefined)
          .slice(0, 8)
        setRounds(matched)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || rounds.length === 0) return null

  return (
    <section className="border-b border-gray-800 bg-gray-850" style={{ background: 'rgba(255,255,255,0.04)' }}>
      <div className="container mx-auto py-5">
        <div className="mb-3 flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-gray-200">관심 라운드</h2>
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
            {rounds.length}
          </span>
          <a
            href="/investments"
            className="ml-auto text-xs text-gray-400 hover:text-gray-200"
          >
            전체 보기 →
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {rounds.map((r) => {
            const brand = brandById(r.brandId)
            return (
              <a
                key={r.id}
                href={`/investments/${r.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700"
              >
                <div
                  className="h-4 w-4 shrink-0 rounded-full"
                  style={{ background: brand?.logoColor ?? '#6366f1' }}
                  aria-hidden
                />
                <span className="truncate max-w-[140px]">{brand?.name ?? '브랜드'}</span>
                <span className="shrink-0 rounded-full bg-gray-700 px-1.5 py-0.5 text-[10px] font-medium text-gray-300">
                  {ROUND_TYPE_LABEL[r.type]}
                </span>
                <span className="inline-flex shrink-0 items-center gap-0.5 text-xs text-emerald-400">
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
