'use client'
import { useEffect } from 'react'

const STORAGE_KEY = 'jangsanote:recentMeetings'
const MAX_RECENT = 30

interface RecentMeetingEntry {
  id: string
  title: string
  meetingType: string
  date: string
}

interface Props {
  meetingId: string
  meetingTitle: string
  meetingType: string
  meetingDate: string
}

export function MeetingViewTracker({
  meetingId,
  meetingTitle,
  meetingType,
  meetingDate,
}: Props) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const entries: RecentMeetingEntry[] = raw ? JSON.parse(raw) : []
      const entry: RecentMeetingEntry = {
        id: meetingId,
        title: meetingTitle,
        meetingType,
        date: meetingDate,
      }
      const next = [entry, ...entries.filter((e) => e.id !== meetingId)].slice(
        0,
        MAX_RECENT,
      )
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }, [meetingId, meetingTitle, meetingType, meetingDate])

  return null
}
