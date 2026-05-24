'use client'

import { useEffect, useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'

export type ScrapBucket = 'recipes' | 'festivals' | 'support'

function keyFor(bucket: ScrapBucket) {
  return `jangsanote:scrap:${bucket}`
}

export function readScrap(bucket: ScrapBucket): string[] {
  try {
    const raw = window.localStorage.getItem(keyFor(bucket))
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

interface ScrapButtonProps {
  bucket: ScrapBucket
  id: string
  /** 'corner' = 카드 위 둥근 아이콘 버튼, 'inline' = 라벨 포함 버튼 */
  variant?: 'corner' | 'inline'
}

export function ScrapButton({ bucket, id, variant = 'corner' }: ScrapButtonProps) {
  const [saved, setSaved] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSaved(readScrap(bucket).includes(id))
    setHydrated(true)
  }, [bucket, id])

  function toggle(e: React.MouseEvent) {
    // 카드 전체가 링크인 경우 네비게이션을 막고 토글만 수행
    e.preventDefault()
    e.stopPropagation()
    try {
      const ids = readScrap(bucket)
      const next = saved ? ids.filter((x) => x !== id) : [...ids, id]
      window.localStorage.setItem(keyFor(bucket), JSON.stringify(next))
      setSaved(!saved)
      window.dispatchEvent(new CustomEvent('jangsanote:scrap-changed', { detail: { bucket } }))
    } catch {
      /* ignore */
    }
  }

  const active = hydrated && saved

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={active}
        aria-label={active ? '스크랩 취소' : '스크랩'}
        className={
          'inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ' +
          (active
            ? 'border-transparent text-white'
            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
        }
        style={active ? { background: 'var(--brand-primary)' } : undefined}
      >
        {active ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        {active ? '스크랩됨' : '스크랩'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? '스크랩 취소' : '스크랩'}
      className={
        'flex h-8 w-8 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-colors ' +
        (active ? 'border-transparent text-white' : 'border-gray-200 bg-white/90 text-gray-600 hover:bg-white')
      }
      style={active ? { background: 'var(--brand-primary)' } : undefined}
    >
      {active ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </button>
  )
}
