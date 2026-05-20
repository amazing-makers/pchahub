'use client'

import { useEffect, useState } from 'react'
import { Bookmark, MessageSquare } from 'lucide-react'
import { POSTS, CATEGORY_LABEL } from '@/lib/mock-data'

const KEY = 'jangsanote:savedPosts'

export function SavedPostsSection() {
  const [savedPosts, setSavedPosts] = useState<typeof POSTS>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const matched = ids
        .map((id) => POSTS.find((p) => p.id === id))
        .filter((p): p is (typeof POSTS)[number] => Boolean(p))
      setSavedPosts(matched)
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || savedPosts.length === 0) return null

  return (
    <section className="border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto">
        <div className="mb-3 flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-[var(--brand-primary)]" />
          <h2 className="text-sm font-semibold text-gray-900">저장한 글</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {savedPosts.map((p) => (
            <a
              key={p.id}
              href={`/posts/${p.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white py-1 pl-2 pr-3 text-xs text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              <MessageSquare className="h-3 w-3 text-[var(--brand-primary)]" />
              <span className="max-w-[180px] truncate font-medium">{p.title}</span>
              <span className="text-gray-400">{CATEGORY_LABEL[p.category]}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
