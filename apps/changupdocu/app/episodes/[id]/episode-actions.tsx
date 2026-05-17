'use client'

import { useEffect, useState } from 'react'
import { Bookmark, BookmarkCheck, Share2, ThumbsUp } from 'lucide-react'
import { Button } from '@amakers/ui'

const LIKES_KEY = 'changupdocu:likes'
const WATCHED_KEY = 'changupdocu:watched'

interface EpisodeActionsProps {
  episodeId: string
  title: string
}

export function EpisodeActions({ episodeId, title }: EpisodeActionsProps) {
  const [liked, setLiked] = useState(false)
  const [watched, setWatched] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LIKES_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      setLiked(ids.includes(episodeId))
    } catch { /* ignore */ }
    try {
      const raw = window.localStorage.getItem(WATCHED_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      setWatched(ids.includes(episodeId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [episodeId])

  const toggleLike = () => {
    try {
      const raw = window.localStorage.getItem(LIKES_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = liked ? ids.filter((id) => id !== episodeId) : [...ids, episodeId]
      window.localStorage.setItem(LIKES_KEY, JSON.stringify(next))
      setLiked(!liked)
    } catch { /* ignore */ }
  }

  const toggleWatched = () => {
    try {
      const raw = window.localStorage.getItem(WATCHED_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = watched ? ids.filter((id) => id !== episodeId) : [...ids, episodeId]
      window.localStorage.setItem(WATCHED_KEY, JSON.stringify(next))
      setWatched(!watched)
    } catch { /* ignore */ }
  }

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title, url }) } catch { /* ignore */ }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch { /* ignore */ }
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={liked ? 'primary' : 'outline'}
        className={
          'gap-1 ' +
          (liked ? 'bg-indigo-600 hover:bg-indigo-700' : '')
        }
        onClick={hydrated ? toggleLike : undefined}
        disabled={!hydrated}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
        {liked ? '좋아요 취소' : '좋아요'}
      </Button>
      <Button size="sm" variant="ghost" className="gap-1 text-gray-600" onClick={share}>
        <Share2 className="h-3.5 w-3.5" />
        {copied ? '복사됨 ✓' : '공유'}
      </Button>
      <button
        type="button"
        onClick={hydrated ? toggleWatched : undefined}
        disabled={!hydrated}
        className={
          'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ' +
          (watched
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
        }
      >
        {watched ? (
          <BookmarkCheck className="h-4 w-4 text-emerald-600" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
        {watched ? '시청 완료 ✓' : '시청 완료로 표시'}
      </button>
    </div>
  )
}
