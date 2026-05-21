'use client'
import { useEffect } from 'react'

const STORAGE_KEY = 'pchahub:recentDiscussions'
const MAX_RECENT = 30

interface RecentDiscussionEntry {
  id: string
  title: string
  category: string
}

interface Props {
  discussionId: string
  discussionTitle: string
  discussionCategory: string
}

export function DiscussionViewTracker({
  discussionId,
  discussionTitle,
  discussionCategory,
}: Props) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const entries: RecentDiscussionEntry[] = raw ? JSON.parse(raw) : []
      const entry: RecentDiscussionEntry = {
        id: discussionId,
        title: discussionTitle,
        category: discussionCategory,
      }
      const next = [entry, ...entries.filter((e) => e.id !== discussionId)].slice(
        0,
        MAX_RECENT,
      )
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }, [discussionId, discussionTitle, discussionCategory])

  return null
}
