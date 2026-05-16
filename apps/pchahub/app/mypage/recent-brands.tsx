'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { BRANDS } from '@/lib/mock-data'

export function RecentBrands() {
  const [recentIds, setRecentIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('pchahub:recentBrands')
      if (raw) setRecentIds(JSON.parse(raw) as string[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated) return null

  const recentBrands = recentIds
    .slice(0, 6)
    .map((id) => BRANDS.find((b) => b.id === id))
    .filter(Boolean) as typeof BRANDS

  if (recentBrands.length === 0) return null

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-400" />
        <h2 className="text-h4 font-semibold text-gray-900">최근 본 브랜드</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recentBrands.map((b) => (
          <a
            key={b.id}
            href={`/brands/${b.id}`}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md"
          >
            <span
              className="h-10 w-10 shrink-0 rounded-lg"
              style={{ background: b.logoColor }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-gray-900">{b.name}</div>
              <div className="text-xs text-gray-500">{b.categoryLabel}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
