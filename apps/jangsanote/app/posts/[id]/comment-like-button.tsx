'use client'

import { useEffect, useState } from 'react'
import { ThumbsUp } from 'lucide-react'

const STORAGE_KEY = 'jangsanote:commentLikes'

interface CommentLikeButtonProps {
  commentId: string
  baseLikes: number
}

export function CommentLikeButton({ commentId, baseLikes }: CommentLikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      setLiked(ids.includes(commentId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [commentId])

  function toggle() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = ids.includes(commentId)
        ? ids.filter((id) => id !== commentId)
        : [...ids, commentId]
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setLiked(!liked)
    } catch { /* ignore */ }
  }

  const count = baseLikes + (liked ? 1 : 0)

  return (
    <button
      type="button"
      onClick={toggle}
      className={
        'inline-flex items-center gap-1 hover:text-gray-900 ' +
        (hydrated && liked ? 'text-[var(--brand-primary)]' : '')
      }
    >
      <ThumbsUp className={`h-3 w-3 ${hydrated && liked ? 'fill-current' : ''}`} />
      {count}
    </button>
  )
}
