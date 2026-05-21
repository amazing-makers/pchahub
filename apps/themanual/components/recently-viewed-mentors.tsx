'use client'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'themanual:recentMentors'

interface RecentMentorEntry {
  id: string
  name: string
  role: string
  avatarColor: string
}

export function RecentlyViewedMentors() {
  const [entries, setEntries] = useState<RecentMentorEntry[]>([])
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
          최근 본 멘토
        </p>
        <div className="flex flex-wrap gap-2">
          {entries.slice(0, 8).map((e) => (
            <a
              key={e.id}
              href={`/mentors/${e.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
            >
              <span
                className="h-5 w-5 shrink-0 rounded-full"
                style={{ backgroundColor: e.avatarColor }}
              />
              <span className="max-w-[120px] truncate">{e.name}</span>
              <span className="text-xs text-gray-400">{e.role}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
