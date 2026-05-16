'use client'

import { useEffect, useState } from 'react'
import { PencilLine } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'

interface LocalPost {
  id: string
  category: string
  title: string
  content: string
  author: string
  anonymous: boolean
  createdAt: string
  views: number
  comments: number
  likes: number
}

const CATEGORY_LABELS: Record<string, string> = {
  experience: '창업 후기',
  question: '질문',
  tip: '팁·노하우',
  news: '시장 동향',
}

export function LocalCommunityPosts() {
  const [posts, setPosts] = useState<LocalPost[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('pchahub:community-posts')
      if (raw) setPosts(JSON.parse(raw) as LocalPost[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || posts.length === 0) return null

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
        <PencilLine className="h-3.5 w-3.5" />
        내가 쓴 글 ({posts.length}건) — 검수 후 전체 공개됩니다
      </div>
      <div className="space-y-2">
        {posts.map((p) => (
          <Card
            key={p.id}
            className="border-[var(--brand-primary)]/20 bg-indigo-50/30"
          >
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">{CATEGORY_LABELS[p.category] ?? p.category}</Badge>
                <Badge variant="warning">검수 중</Badge>
                <span className="text-xs text-gray-400">{p.createdAt}</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-gray-900">{p.title}</div>
              <p className="mt-1 line-clamp-2 text-xs text-gray-500">{p.content}</p>
              <div className="mt-2 text-xs text-gray-400">
                {p.anonymous ? '익명' : p.author}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
