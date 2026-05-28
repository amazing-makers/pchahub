'use client'
import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

const STORAGE_KEY = 'themyungdang-saved-listings'

function getSavedIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function SavedListingsWidget() {
  const [ids, setIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setIds(getSavedIds())
    setHydrated(true)

    function handleStorage() {
      setIds(getSavedIds())
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  if (!hydrated || ids.length === 0) return null

  return (
    <div className="border-b border-rose-100 bg-rose-50">
      <div className="container mx-auto flex items-center justify-between gap-3 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700">
          <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
          찜한 매물 {ids.length}개
        </span>
        <a
          href="/listings?saved=true"
          className="text-xs font-semibold text-rose-600 underline-offset-2 hover:underline"
        >
          목록 보기 →
        </a>
      </div>
    </div>
  )
}
