'use client'

import { useEffect, useState } from 'react'
import { Clock, FileText } from 'lucide-react'

interface RecentInsightEntry {
  id: string
  title: string
  category: string
  coverColors: string[]
}

export function RecentlyViewedInsights() {
  const [items, setItems] = useState<RecentInsightEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('gongganhansu:recentInsights')
      if (raw) {
        const parsed = JSON.parse(raw) as unknown[]
        const entries: RecentInsightEntry[] = parsed
          .filter((item): item is RecentInsightEntry => typeof item === 'object' && item !== null && 'id' in item)
          .slice(0, 6)
        setItems(entries)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || items.length === 0) return null

  return (
    <section className="container mx-auto pt-section">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-400" />
        <h2 className="text-h4 font-semibold text-gray-900">최근 본 인사이트</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`/insights/${item.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
          >
            <span
              className="h-3.5 w-3.5 shrink-0 rounded-full"
              style={{ background: item.coverColors[0] ?? '#64748B' }}
              aria-hidden
            />
            <span className="truncate max-w-[140px]">{item.title}</span>
            {item.category && (
              <span className="text-xs text-gray-400">{item.category}</span>
            )}
          </a>
        ))}
      </div>
    </section>
  )
}
