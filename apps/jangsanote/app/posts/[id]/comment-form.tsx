'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, ThumbsUp } from 'lucide-react'
import { Button } from '@amakers/ui'
import { formatRelativeTime } from '@amakers/utils'

interface LocalComment {
  id: string
  content: string
  authorName: string
  createdAt: string
  likes: number
}

const STORAGE_KEY = (postId: string) => `jangsanote:comments:${postId}`

export function CommentForm({ postId }: { postId: string }) {
  const [comments, setComments] = useState<LocalComment[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [text, setText] = useState('')
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY(postId))
      if (raw) setComments(JSON.parse(raw) as LocalComment[])
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [postId])

  const save = (updated: LocalComment[]) => {
    setComments(updated)
    try {
      window.localStorage.setItem(STORAGE_KEY(postId), JSON.stringify(updated))
    } catch {
      // ignore
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const c: LocalComment = {
      id: `c-${Date.now()}`,
      content: text.trim(),
      authorName: '나',
      createdAt: new Date().toISOString(),
      likes: 0,
    }
    save([c, ...comments])
    setText('')
    textareaRef.current?.focus()
  }

  const toggleLike = (id: string) => {
    const liked = new Set(likedIds)
    const updated = comments.map((c) => {
      if (c.id !== id) return c
      if (liked.has(id)) {
        liked.delete(id)
        return { ...c, likes: c.likes - 1 }
      } else {
        liked.add(id)
        return { ...c, likes: c.likes + 1 }
      }
    })
    setLikedIds(liked)
    save(updated)
  }

  if (!hydrated) return null

  return (
    <div className="space-y-3">
      {/* 내가 단 댓글 (localStorage) */}
      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-[var(--brand-primary)]/20 bg-amber-50/30 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-gray-900">{c.authorName}</span>
                <span className="text-xs text-gray-400">{formatRelativeTime(c.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{c.content}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <button
                  type="button"
                  onClick={() => toggleLike(c.id)}
                  className={
                    'inline-flex items-center gap-1 ' +
                    (likedIds.has(c.id) ? 'font-semibold text-gray-900' : 'hover:text-gray-900')
                  }
                >
                  <ThumbsUp className="h-3 w-3" />
                  {c.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 댓글 입력 */}
      <form onSubmit={submit} className="rounded-xl border border-gray-200 bg-white p-4">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="댓글을 남겨보세요. 다른 점주에게 도움이 될 수 있습니다."
          rows={3}
          className="w-full resize-none rounded-lg bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">{text.length}자</span>
          <Button type="submit" size="sm" className="gap-1" disabled={!text.trim()}>
            <Send className="h-3.5 w-3.5" />
            등록
          </Button>
        </div>
      </form>
    </div>
  )
}
