'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Megaphone } from 'lucide-react'
import { PORTFOLIO, SERVICE_LABEL } from '@/lib/mock-data'

const STORAGE_KEY = 'openrun:savedCases'

export function SavedCasesSection() {
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
    <section className="border-b border-gray-700 bg-gray-800">
      <div className="container mx-auto py-5">
        <div className="mb-3 flex items-center gap-2">
          <Bookmark className="h-4 w-4" style={{ color: 'var(--brand-primary)' }} />
          <h2 className="text-sm font-semibold text-gray-200">저장한 사례</h2>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
            style={{ background: 'var(--brand-primary)', opacity: 0.8 }}
          >
            {cases.length}
          </span>
          <a
            href="/portfolio"
            className="ml-auto text-xs text-gray-400 hover:text-gray-200"
          >
            전체 보기 →
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {cases.map((c) => (
            <a
              key={c.id}
              href={`/portfolio/${c.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-600 bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:border-gray-400 hover:bg-gray-600"
            >
              <Megaphone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="truncate max-w-[160px]">{c.client}</span>
              <span
                className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, ${c.brandColor}, ${c.brandColor}cc)`,
                }}
              >
                {SERVICE_LABEL[c.service]}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
