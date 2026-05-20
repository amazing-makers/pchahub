'use client'

import { useEffect, useState } from 'react'
import { Clock, Megaphone } from 'lucide-react'
import { PORTFOLIO } from '@/lib/mock-data'

const STORAGE_KEY = 'openrun:recentCases'

export function RecentlyViewedCases() {
  const [cases, setCases] = useState<typeof PORTFOLIO>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const ids = JSON.parse(raw) as string[]
        const matched = ids
          .map((id) => PORTFOLIO.find((c) => c.id === id))
          .filter((c): c is (typeof PORTFOLIO)[number] => c !== undefined)
          .slice(0, 6)
        setCases(matched)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || cases.length === 0) return null

  return (
    <section className="border-b border-gray-100 bg-white py-4">
      <div className="container mx-auto">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">최근 본 캠페인 사례</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {cases.map((c) => (
            <a
              key={c.id}
              href={`/portfolio/${c.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
            >
              <div
                className="h-5 w-5 shrink-0 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${c.imageColors[0]}, ${c.imageColors[1] ?? c.imageColors[0]})`,
                }}
                aria-hidden
              />
              <span className="max-w-[160px] truncate">{c.client}</span>
              <span className="shrink-0 rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-800">
                {c.serviceLabel}
              </span>
              <span className="inline-flex shrink-0 items-center gap-0.5 text-xs text-gray-400">
                <Megaphone className="h-3 w-3" />
                {c.industry}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
