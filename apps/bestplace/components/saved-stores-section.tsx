'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Star } from 'lucide-react'
import { STORES } from '@/lib/mock-data'

const KEY = 'bestplace:savedStores'

export function SavedStoresSection() {
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
    .map((id) => STORES.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

  if (saved.length === 0) return null

  return (
    <section className="container mx-auto pt-section">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
            <Bookmark className="h-5 w-5 text-amber-500" />
            저장한 매장
          </h2>
          <p className="mt-1 text-sm text-gray-500">{saved.length}개 저장됨</p>
        </div>
        <a
          href="/stores"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          전체 매장 보기 →
        </a>
      </div>
      <div className="flex flex-wrap gap-2">
        {saved.map((store) => (
          <a
            key={store.id}
            href={`/stores/${store.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50"
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              {store.name.charAt(0)}
            </span>
            <span className="font-medium">{store.name}</span>
            <span className="text-xs text-gray-400">{store.region}</span>
            <span className="inline-flex items-center gap-0.5 text-xs text-amber-500">
              <Star className="h-3 w-3 fill-amber-400" />
              {store.rating}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
