'use client'

import { useCallback, useEffect, useState } from 'react'
import { BarChart2, X } from 'lucide-react'
import { CONTRACTORS } from '@/lib/mock-data'

const STORAGE_KEY = 'gongganhansu:compare'

function getIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function CompareBar() {
  const [ids, setIds] = useState<string[]>([])

  const sync = useCallback(() => setIds(getIds()), [])

  useEffect(() => {
    sync()
    window.addEventListener('ggh-compare-update', sync)
    return () => window.removeEventListener('ggh-compare-update', sync)
  }, [sync])

  if (ids.length < 2) return null

  const selected = ids
    .map((id) => CONTRACTORS.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => !!c)

  function remove(id: string) {
    const next = ids.filter((x) => x !== id)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
    window.dispatchEvent(new Event('ggh-compare-update'))
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 flex justify-center px-4 md:bottom-6">
      <div className="flex w-full max-w-2xl items-center gap-3 rounded-2xl bg-gray-900 px-4 py-3 shadow-2xl">
        <BarChart2 className="h-4 w-4 shrink-0 text-gray-400" />
        <div className="flex flex-1 flex-wrap gap-1.5">
          {selected.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-1 rounded-full bg-gray-700 px-2.5 py-1 text-xs font-medium text-white"
            >
              {c.name}
              <button onClick={() => remove(c.id)} aria-label={`${c.name} 비교에서 제거`}>
                <X className="h-3 w-3 text-gray-400 hover:text-white" />
              </button>
            </span>
          ))}
          {ids.length < 3 && (
            <span className="rounded-full border border-dashed border-gray-600 px-2.5 py-1 text-xs text-gray-500">
              + 1곳 더 추가 가능
            </span>
          )}
        </div>
        <a
          href={`/compare?ids=${ids.join(',')}`}
          className="shrink-0 rounded-xl px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--brand-primary)' }}
        >
          비교하기 →
        </a>
      </div>
    </div>
  )
}
