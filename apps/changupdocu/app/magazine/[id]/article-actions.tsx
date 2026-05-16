'use client'

import { useEffect, useState } from 'react'
import { Share2, ThumbsUp } from 'lucide-react'
import { Button } from '@amakers/ui'

const LIKES_KEY = 'changupdocu:likes'

interface ArticleActionsProps {
  articleId: string
  title: string
}

export function ArticleActions({ articleId, title }: ArticleActionsProps) {
  const [liked, setLiked] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LIKES_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      setLiked(ids.includes(articleId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [articleId])

  const toggleLike = () => {
    try {
      const raw = window.localStorage.getItem(LIKES_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = liked ? ids.filter((id) => id !== articleId) : [...ids, articleId]
      window.localStorage.setItem(LIKES_KEY, JSON.stringify(next))
      setLiked(!liked)
    } catch { /* ignore */ }
  }

  const share = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).then(
        () => alert('링크가 복사되었습니다.'),
        () => alert('복사 실패. 주소창에서 직접 복사해 주세요.'),
      )
    }
  }

  return (
    <div className="flex items-center gap-2">
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
        <Share2 className="h-3.5 w-3.5" /> 공유
      </Button>
    </div>
  )
}
