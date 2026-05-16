'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'changupdocu:recentArticles'
const MAX_RECENT = 30

export function ArticleViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = [articleId, ...ids.filter((id) => id !== articleId)].slice(0, MAX_RECENT)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* ignore */ }
  }, [articleId])

  return null
}
