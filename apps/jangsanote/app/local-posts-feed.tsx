'use client'

import { useEffect, useState } from 'react'
import { PencilLine } from 'lucide-react'
import { formatRelativeTime } from '@amakers/utils'
import { CATEGORY_LABEL, CHANNELS, type PostCategory } from '@/lib/mock-data'

interface LocalPost {
  id: string
  title: string
  excerpt: string
  channelType: string
  channelKey: string
  category: string
  tags: string[]
  anonymous: boolean
  authorName: string
  createdAt: string
  views: number
  likes: number
  commentCount: number
}

function channelLabel(type: string, key: string): string {
  const ch = CHANNELS.find((c) => c.type === type && c.key === key)
  return ch?.label ?? key
}

export function LocalPostsFeed() {
  const [posts, setPosts] = useState<LocalPost[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('jangsanote:posts')
      if (raw) setPosts(JSON.parse(raw) as LocalPost[])
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  if (!hydrated || posts.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-primary)]">
        <PencilLine className="h-3.5 w-3.5" />
        내가 쓴 글 ({posts.length}개)
      </div>
      {posts.map((p) => (
        <a
          key={p.id}
          href={`/posts/${p.id}`}
          className="block rounded-xl border border-[var(--brand-primary)]/20 bg-amber-50/40 p-4 hover:border-[var(--brand-primary)]/40 hover:bg-amber-50/70"
        >
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
            <span className="rounded-full bg-[var(--brand-primary)]/10 px-2 py-0.5 font-medium text-[var(--brand-primary)]">
              {channelLabel(p.channelType, p.channelKey)}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
              {CATEGORY_LABEL[p.category as PostCategory] ?? p.category}
            </span>
            {p.anonymous && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-500">익명</span>
            )}
          </div>
          <div className="mt-2 line-clamp-1 text-sm font-semibold text-gray-900">{p.title}</div>
          {p.excerpt && (
            <div className="mt-0.5 line-clamp-2 text-xs text-gray-500">{p.excerpt}</div>
          )}
          <div className="mt-2 text-xs text-gray-400">{formatRelativeTime(p.createdAt)}</div>
        </a>
      ))}
    </div>
  )
}
