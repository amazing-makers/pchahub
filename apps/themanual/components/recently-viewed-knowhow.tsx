'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Clock } from 'lucide-react'
import { KNOWHOW_CATEGORY_LABEL, type KnowhowCategory } from '@/lib/knowhow'

interface RecentKnowhowEntry {
  id: string
  title: string
  category: string
}

export function RecentlyViewedKnowhow() {
  const [items, setItems] = useState<RecentKnowhowEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('themanual:recentKnowhow')
      if (raw) {
        const parsed = JSON.parse(raw) as unknown[]
        const entries: RecentKnowhowEntry[] = parsed
          .filter((item): item is RecentKnowhowEntry => typeof item === 'object' && item !== null && 'id' in item)
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
        <h2 className="text-h4 font-semibold text-gray-900">최근 본 노하우</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`/knowhow/${item.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
          >
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span className="truncate max-w-[140px]">{item.title}</span>
            {item.category && (
              <span className="text-xs text-gray-400">
                {KNOWHOW_CATEGORY_LABEL[item.category as KnowhowCategory] ?? item.category}
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  )
}
