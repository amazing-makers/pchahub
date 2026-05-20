'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Star } from 'lucide-react'
import { MENTORS, type MockMentor } from '@/lib/mock-data'

const STORAGE_KEY = 'themanual:savedMentors'

export function SavedMentorsSection() {
  const [mentors, setMentors] = useState<MockMentor[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const ids = JSON.parse(raw) as string[]
        const matched = ids
          .map((id) => MENTORS.find((m) => m.id === id))
          .filter((m): m is MockMentor => m !== undefined)
          .slice(0, 6)
        setMentors(matched)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || mentors.length === 0) return null

  return (
    <section className="border-b border-gray-100 bg-indigo-50/30">
      <div className="container mx-auto py-5">
        <div className="mb-3 flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-indigo-500" />
          <h2 className="text-sm font-semibold text-gray-900">저장한 멘토</h2>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
            {mentors.length}
          </span>
          <a href="/mentors" className="ml-auto text-xs text-gray-500 hover:text-gray-700">
            전체 보기 →
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {mentors.map((m) => (
            <a
              key={m.id}
              href={`/mentors/${m.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:shadow"
            >
              <div
                className="h-5 w-5 shrink-0 rounded-full"
                style={{ background: m.avatarColor }}
                aria-hidden
              />
              <span className="max-w-[140px] truncate">{m.name}</span>
              <span className="shrink-0 text-xs text-gray-500">{m.role}</span>
              <span className="inline-flex shrink-0 items-center gap-0.5 text-xs text-amber-500">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {m.rating.toFixed(1)}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
