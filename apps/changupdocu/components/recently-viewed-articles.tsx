'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { ARTICLES } from '@/lib/mock-data'

const STORAGE_KEY = 'changupdocu:recentArticles'

export function RecentlyViewedArticles() {
  const [articles, setArticles] = useState<typeof ARTICLES>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const ids = JSON.parse(raw) as string[]
        const matched = ids
          .map((id) => ARTICLES.find((a) => a.id === id))
          .filter((a): a is (typeof ARTICLES)[number] => a !== undefined)
          .slice(0, 6)
        setArticles(matched)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || articles.length === 0) return null

  return (
    <section className="border-b border-gray-100 bg-white py-4">
      <div className="container mx-auto">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">최근 본 매거진</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {articles.map((a) => (
            <a
              key={a.id}
              href={`/magazine/${a.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
            >
              <div
                className="h-5 w-5 shrink-0 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${a.coverColors[0]}, ${a.coverColors[1] ?? a.coverColors[0]})`,
                }}
                aria-hidden
              />
              <span className="max-w-[160px] truncate">{a.title}</span>
              <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                {a.category}
              </span>
              <span className="inline-flex shrink-0 items-center gap-0.5 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                {a.readTime}분
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
