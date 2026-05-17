'use client'
import { useState, useEffect } from 'react'
import { GitCompare } from 'lucide-react'

const COMPARE_KEY = 'pchahub:compare'
const MAX_COMPARE = 3

export function CompareButton({ brandId, brandName }: { brandId: string; brandName: string }) {
  const [inCompare, setInCompare] = useState(false)
  const [full, setFull] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const ids = JSON.parse(window.localStorage.getItem(COMPARE_KEY) ?? '[]') as string[]
      setInCompare(ids.includes(brandId))
      setFull(ids.length >= MAX_COMPARE && !ids.includes(brandId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [brandId])

  const toggle = () => {
    try {
      const ids = JSON.parse(window.localStorage.getItem(COMPARE_KEY) ?? '[]') as string[]
      if (inCompare) {
        const updated = ids.filter((id) => id !== brandId)
        window.localStorage.setItem(COMPARE_KEY, JSON.stringify(updated))
        setInCompare(false)
        setFull(false)
      } else if (ids.length < MAX_COMPARE) {
        const updated = [...ids, brandId]
        window.localStorage.setItem(COMPARE_KEY, JSON.stringify(updated))
        setInCompare(true)
        setFull(updated.length >= MAX_COMPARE)
      }
    } catch { /* ignore */ }
  }

  if (!hydrated) return null

  if (full && !inCompare) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-400">
        최대 3개
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={
        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ' +
        (inCompare
          ? 'border-blue-200 bg-blue-50 text-blue-700'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400')
      }
      title={inCompare ? '비교에서 제거' : '비교에 추가 (최대 3개)'}
    >
      <GitCompare className="h-3.5 w-3.5" />
      {inCompare ? '비교 중' : '비교'}
    </button>
  )
}
