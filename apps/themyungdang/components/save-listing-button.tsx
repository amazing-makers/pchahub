'use client'
import { Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'themyungdang-saved-listings'

interface Props {
  listingId: string
  size?: 'sm' | 'md'
  className?: string
}

function getSavedIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function setSavedIds(ids: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    window.dispatchEvent(new Event('storage'))
  } catch {
    /* ignore */
  }
}

export function SaveListingButton({ listingId, size = 'sm', className = '' }: Props) {
  const [isSaved, setIsSaved] = useState(false)

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    const ids = getSavedIds()
    setIsSaved(ids.includes(listingId))
  }, [listingId])

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const ids = getSavedIds()
    const next = ids.includes(listingId)
      ? ids.filter((id) => id !== listingId)
      : [...ids, listingId]
    setSavedIds(next)
    setIsSaved(!isSaved)
  }

  if (size === 'md') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={isSaved ? '찜 해제' : '찜하기'}
        className={[
          'inline-flex h-10 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-all',
          isSaved
            ? 'border-rose-300 bg-rose-500 text-white hover:bg-rose-600'
            : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300 hover:text-rose-500',
          className,
        ].join(' ')}
      >
        <Heart className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
        찜하기
      </button>
    )
  }

  // size === 'sm'
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isSaved ? '찜 해제' : '찜하기'}
      className={[
        'flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-all',
        isSaved
          ? 'border-rose-300 bg-rose-500 text-white hover:bg-rose-600'
          : 'border-gray-200 bg-white/90 text-gray-500 hover:bg-white hover:text-rose-500',
        className,
      ].join(' ')}
    >
      <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-white' : ''}`} />
    </button>
  )
}
