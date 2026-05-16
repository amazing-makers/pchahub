'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'changupdocu:recentEpisodes'
const MAX_RECENT = 30

export function EpisodeViewTracker({ episodeId }: { episodeId: string }) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = [episodeId, ...ids.filter((id) => id !== episodeId)].slice(0, MAX_RECENT)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* ignore */ }
  }, [episodeId])

  return null
}
