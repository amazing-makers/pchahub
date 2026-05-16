'use client'

import { useEffect, useState } from 'react'
import { Share2, ThumbsUp } from 'lucide-react'
import { Button } from '@amakers/ui'

const LIKES_KEY = 'changupdocu:likes'

interface EpisodeActionsProps {
  episodeId: string
  title: string
}

export function EpisodeActions({ episodeId, title }: EpisodeActionsProps) {
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LIKES_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      setLiked(ids.includes(episodeId))
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
    </div>
  )
}
