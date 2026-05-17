'use client'

import { useEffect, useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { PortfolioCard } from './portfolio-card'
import type { MockPortfolioItem } from '@/lib/mock-data'

const KEY = 'gongganhansu:savedPortfolios'

export function PortfolioCardWithSave({ item }: { item: MockPortfolioItem }) {
  const [saved, setSaved] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setSaved(ids.includes(item.id))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [item.id])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      const next = saved ? ids.filter((id) => id !== item.id) : [...ids, item.id]
      window.localStorage.setItem(KEY, JSON.stringify(next))
      setSaved(!saved)
    } catch { /* ignore */ }
  }

  return (
    <div className="relative">
      <PortfolioCard item={item} />
      {hydrated && (
        <button
          type="button"
          onClick={toggle}
          className={
            'absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-colors z-10 ' +
            (saved
              ? 'border-teal-300 bg-teal-500 text-white hover:bg-teal-600'
              : 'border-gray-200 bg-white/90 text-gray-500 hover:bg-white hover:text-gray-700')
          }
          aria-label={saved ? '저장 해제' : '사례 저장'}
        >
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
}
