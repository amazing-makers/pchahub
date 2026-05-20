'use client'

import { useEffect, useState } from 'react'
import { Bookmark, MapPin, Star } from 'lucide-react'
import { CONTRACTORS } from '@/lib/mock-data'

const KEY = 'gongganhansu:savedContractors'

export function SavedContractorsSection() {
  const [ids, setIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      setIds(raw ? JSON.parse(raw) : [])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated) return null

  const saved = ids
    .map((id) => CONTRACTORS.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  if (saved.length === 0) return null

  return (
    <section className="container mx-auto pt-section">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
            <Bookmark className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
            저장한 시공사
          </h2>
          <p className="mt-1 text-sm text-gray-500">{saved.length}곳 저장됨</p>
        </div>
        <a
          href="/contractors"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          전체 시공사 보기 →
        </a>
      </div>
      <div className="flex flex-wrap gap-2">
        {saved.map((c) => (
          <a
            key={c.id}
            href={`/contractors/${c.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: c.brandColor }}
            >
              {c.name.charAt(0)}
            </span>
            <span className="font-medium">{c.name}</span>
            <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
              <MapPin className="h-3 w-3" />
              {c.region}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs text-amber-500">
              <Star className="h-3 w-3 fill-amber-400" />
              {c.rating}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
