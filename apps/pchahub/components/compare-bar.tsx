'use client'
import { useEffect, useState } from 'react'
import { GitCompare, X } from 'lucide-react'
import { BRANDS } from '@/lib/mock-data'

const COMPARE_KEY = 'pchahub:compare'

export function CompareBar() {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    const sync = () => {
      try {
        setIds(JSON.parse(window.localStorage.getItem(COMPARE_KEY) ?? '[]'))
      } catch { /* ignore */ }
    }
    sync()
    window.addEventListener('storage', sync)
    // Also poll since same-tab storage events don't fire
    const interval = setInterval(sync, 500)
    return () => { window.removeEventListener('storage', sync); clearInterval(interval) }
  }, [])

  if (ids.length < 2) return null

  const brands = ids.map(id => BRANDS.find(b => b.id === id)).filter(Boolean)

  const clear = () => {
    window.localStorage.removeItem(COMPARE_KEY)
    setIds([])
  }

  return (
    <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-blue-200 bg-white px-5 py-3 shadow-xl">
      <div className="flex items-center gap-3">
        <GitCompare className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-gray-900">
          {brands.map(b => b?.name).join(' vs ')} 비교 중
        </span>
        <a
          href={`/brands/compare?ids=${ids.join(',')}`}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          비교 보기
        </a>
        <button type="button" onClick={clear} className="text-gray-400 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
