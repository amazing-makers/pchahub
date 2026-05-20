'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Lock } from 'lucide-react'
import { KNOWHOW_ITEMS, KNOWHOW_CATEGORY_LABEL, type KnowhowItem } from '@/lib/knowhow'

const STORAGE_KEY = 'themanual:savedKnowhow'

export function SavedKnowhowSection() {
  const [items, setItems] = useState<KnowhowItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const ids = JSON.parse(raw) as string[]
        const matched = ids
          .map((id) => KNOWHOW_ITEMS.find((k) => k.id === id))
          .filter((k): k is KnowhowItem => k !== undefined)
          .slice(0, 6)
        setItems(matched)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || items.length === 0) return null

  return (
    <section className="border-b border-gray-100 bg-emerald-50/30">
      <div className="container mx-auto py-5">
        <div className="mb-3 flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-emerald-600" />
          <h2 className="text-sm font-semibold text-gray-900">저장한 노하우</h2>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {items.length}
          </span>
          <a href="/knowhow" className="ml-auto text-xs text-gray-500 hover:text-gray-700">
            전체 보기 →
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((k) => (
            <a
              key={k.id}
              href={`/knowhow/${k.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
            >
              <span className="max-w-[180px] truncate">{k.title}</span>
              <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                {KNOWHOW_CATEGORY_LABEL[k.category]}
              </span>
              {k.premium && (
                <Lock className="h-3 w-3 shrink-0 text-amber-500" />
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
