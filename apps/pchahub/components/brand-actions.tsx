'use client'

import { useEffect, useState } from 'react'
import { Check, Heart, Plus, Share2 } from 'lucide-react'

interface BrandActionsProps {
  brandId: string
  brandName: string
}

const SAVED_KEY = 'pchahub:savedBrands'
const COMPARE_KEY = 'pchahub:compareIds'

function readSet(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(arr)
  } catch {
    return new Set()
  }
}

function writeSet(key: string, set: Set<string>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(set)))
  } catch {
    // ignore
  }
}

export function BrandActions({ brandId, brandName }: BrandActionsProps) {
  const [saved, setSaved] = useState(false)
  const [compared, setCompared] = useState(false)
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSaved(readSet(SAVED_KEY).has(brandId))
    setCompared(readSet(COMPARE_KEY).has(brandId))
    setHydrated(true)
  }, [brandId])

  const toggleSave = () => {
    const set = readSet(SAVED_KEY)
    if (set.has(brandId)) set.delete(brandId)
    else set.add(brandId)
    writeSet(SAVED_KEY, set)
    setSaved(set.has(brandId))
  }

  const toggleCompare = () => {
    const set = readSet(COMPARE_KEY)
    if (set.has(brandId)) {
      set.delete(brandId)
    } else {
      if (set.size >= 3) {
        // Replace oldest
        const first = Array.from(set)[0]
        if (first) set.delete(first)
      }
      set.add(brandId)
    }
    writeSet(COMPARE_KEY, set)
    setCompared(set.has(brandId))
  }

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = `${brandName} - pchahub`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // user cancelled — fall through to copy
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        setShareState('copied')
        setTimeout(() => setShareState('idle'), 2000)
        return
      } catch {
        // ignore
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={toggleSave}
        aria-pressed={hydrated && saved}
        className={
          'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ' +
          (saved
            ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
        }
      >
        <Heart className={'h-3.5 w-3.5 ' + (saved ? 'fill-rose-500 text-rose-500' : '')} />
        {saved ? '찜 완료' : '찜하기'}
      </button>

      <button
        type="button"
        onClick={toggleCompare}
        aria-pressed={hydrated && compared}
        className={
          'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ' +
          (compared
            ? 'border-gray-900 bg-gray-900 text-white hover:bg-gray-800'
            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
        }
      >
        {compared ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        {compared ? '비교 추가됨' : '비교 추가'}
      </button>

      <button
        type="button"
        onClick={share}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        {shareState === 'copied' ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Share2 className="h-3.5 w-3.5" />
        )}
        {shareState === 'copied' ? '주소 복사됨' : '공유'}
      </button>

      {compared && (
        <a
          href="/brands/compare"
          className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900"
        >
          비교 페이지로 →
        </a>
      )}
    </div>
  )
}
