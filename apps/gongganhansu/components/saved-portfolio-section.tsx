'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Wrench } from 'lucide-react'
import { PORTFOLIO } from '@/lib/mock-data'

const KEY = 'gongganhansu:savedPortfolios'

export function SavedPortfolioSection() {
  const [savedItems, setSavedItems] = useState<typeof PORTFOLIO>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const matched = ids
        .map((id) => PORTFOLIO.find((p) => p.id === id))
        .filter((p): p is (typeof PORTFOLIO)[number] => Boolean(p))
      setSavedItems(matched)
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || savedItems.length === 0) return null

  return (
    <section className="border-t border-gray-100 py-10">
      <div className="container mx-auto">
        <div className="mb-4 flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-[var(--brand-primary)]" />
          <h2 className="text-h4 font-semibold text-gray-900">저장한 시공 사례</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {savedItems.map((item) => (
            <a
              key={item.id}
              href={`/gallery/${item.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-2 pr-3 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              <Wrench className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
              <span className="font-medium">{item.title}</span>
              <span className="text-xs text-gray-400">{item.category}</span>
              <span className="text-xs text-gray-400">{item.region}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
