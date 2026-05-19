'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface RecentBrandEntry {
  id: string
  name: string
  category: string
  logoColor?: string
}

export function RecentlyViewedBrands() {
  const [brands, setBrands] = useState<RecentBrandEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('pchahub:recentBrands')
      if (raw) {
        const parsed = JSON.parse(raw) as unknown[]
        // 구버전 (string[]) 호환
        const entries: RecentBrandEntry[] = parsed.map((item) =>
          typeof item === 'string'
            ? { id: item, name: item, category: '' }
            : (item as RecentBrandEntry),
        )
        setBrands(entries.slice(0, 6))
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || brands.length === 0) return null

  return (
    <section className="container mx-auto pt-section">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-400" />
        <h2 className="text-h4 font-semibold text-gray-900">최근 본 브랜드</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {brands.map((b) => (
          <a
            key={b.id}
            href={`/brands/${b.id}`}
            className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
          >
            <span
              className="h-5 w-5 shrink-0 rounded-full"
              style={{ background: b.logoColor ?? '#6366F1' }}
              aria-hidden
            />
            <span className="truncate max-w-[120px]">{b.name}</span>
            {b.category && (
              <span className="text-xs text-gray-400">{b.category}</span>
            )}
          </a>
        ))}
      </div>
    </section>
  )
}
