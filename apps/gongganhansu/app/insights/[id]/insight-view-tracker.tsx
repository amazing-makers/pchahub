'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'gongganhansu:recentInsights'
const MAX_RECENT = 30

interface RecentInsightEntry {
  id: string
  title: string
  category: string
  coverColors: string[]
}

interface InsightViewTrackerProps {
  insightId: string
  insightTitle: string
  insightCategory: string
  insightCoverColors: string[]
}

export function InsightViewTracker({ insightId, insightTitle, insightCategory, insightCoverColors }: InsightViewTrackerProps) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const entries: RecentInsightEntry[] = raw ? (JSON.parse(raw) as RecentInsightEntry[]) : []
      const entry: RecentInsightEntry = { id: insightId, title: insightTitle, category: insightCategory, coverColors: insightCoverColors }
      const next = [entry, ...entries.filter((e) => e.id !== insightId)].slice(0, MAX_RECENT)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* ignore */ }
  }, [insightId, insightTitle, insightCategory, insightCoverColors])

  return null
}
