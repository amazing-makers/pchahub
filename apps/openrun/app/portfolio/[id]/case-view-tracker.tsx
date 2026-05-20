'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'openrun:recentCases'
const MAX_RECENT = 30

export function CaseViewTracker({ caseId }: { caseId: string }) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = [caseId, ...ids.filter((id) => id !== caseId)].slice(0, MAX_RECENT)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* ignore */ }
  }, [caseId])

  return null
}
