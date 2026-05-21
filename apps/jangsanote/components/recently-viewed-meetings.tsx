'use client'
import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'

const STORAGE_KEY = 'jangsanote:recentMeetings'

interface RecentMeetingEntry {
  id: string
  title: string
  meetingType: string
  date: string
}

export function RecentlyViewedMeetings() {
  const [entries, setEntries] = useState<RecentMeetingEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setEntries(JSON.parse(raw))
    } catch {}
    setHydrated(true)
  }, [])

  if (!hydrated || entries.length === 0) return null

  return (
    <section className="border-t border-gray-100 bg-gray-50 py-6">
      <div className="container mx-auto">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          최근 본 모임
        </p>
        <div className="flex flex-wrap gap-2">
          {entries.slice(0, 8).map((e) => (
            <a
              key={e.id}
              href={`/meetings/${e.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
            >
              <Users className="h-3.5 w-3.5 text-gray-400" />
              <span className="max-w-[160px] truncate">{e.title}</span>
              <span className="text-xs text-gray-400">{e.date?.slice(0, 10)}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
