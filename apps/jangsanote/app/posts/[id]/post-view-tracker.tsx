'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'jangsanote:recentPosts'
const MAX_RECENT = 30

export function PostViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = [postId, ...ids.filter((id) => id !== postId)].slice(0, MAX_RECENT)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* ignore */ }
  }, [postId])

  return null
}
