'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

const KEY = 'pchahub:savedBrands'

export function BrandSaveButton({ brandId }: { brandId: string }) {
  const [saved, setSaved] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setSaved(ids.includes(brandId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [brandId])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      const next = saved ? ids.filter((id) => id !== brandId) : [...ids, brandId]
      window.localStorage.setItem(KEY, JSON.stringify(next))
      setSaved(!saved)
    } catch { /* ignore */ }
  }

  if (!hydrated) return null

  return (
    <button
      type="button"
      onClick={toggle}
      className={
        'flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-colors ' +
        (saved
          ? 'border-rose-300 bg-rose-500 text-white hover:bg-rose-600'
          : 'border-gray-200 bg-white/90 text-gray-600 hover:bg-white hover:text-rose-500')
      }
      aria-label={saved ? '찜 해제' : '찜하기'}
    >
      <Heart className={'h-4 w-4 ' + (saved ? 'fill-white' : '')} />
    </button>
  )
}
