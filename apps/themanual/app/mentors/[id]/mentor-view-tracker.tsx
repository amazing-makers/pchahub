'use client'
import { useEffect } from 'react'

const STORAGE_KEY = 'themanual:recentMentors'
const MAX_RECENT = 30

interface RecentMentorEntry {
  id: string
  name: string
  role: string
  avatarColor: string
}

interface Props {
  mentorId: string
  mentorName: string
  mentorRole: string
  mentorAvatarColor: string
}

export function MentorViewTracker({
  mentorId,
  mentorName,
  mentorRole,
  mentorAvatarColor,
}: Props) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const entries: RecentMentorEntry[] = raw ? JSON.parse(raw) : []
      const entry: RecentMentorEntry = {
        id: mentorId,
        name: mentorName,
        role: mentorRole,
        avatarColor: mentorAvatarColor,
      }
      const next = [entry, ...entries.filter((e) => e.id !== mentorId)].slice(
        0,
        MAX_RECENT,
      )
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }, [mentorId, mentorName, mentorRole, mentorAvatarColor])

  return null
}
