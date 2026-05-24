'use client'

import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Badge } from '@amakers/ui'
import { FESTIVAL_TYPE_LABEL, type FestivalType, type ReviewStatus } from '@/lib/hub-data'

const FESTIVAL_KEY = 'jangsanote:community:festivals'
const RECIPE_KEY = 'jangsanote:community:recipes'

interface Stored {
  id: string
  title: string
  coverImage: string
  status?: ReviewStatus
  // festival
  type?: FestivalType
  region?: string
  startDate?: string
  venue?: string
  // recipe
  category?: string
  summary?: string
}

function read(key: string): Stored[] {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Stored[]) : []
  } catch {
    return []
  }
}

export function ReviewQueue() {
  const [festivals, setFestivals] = useState<Stored[]>([])
  const [recipes, setRecipes] = useState<Stored[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setFestivals(read(FESTIVAL_KEY))
    setRecipes(read(RECIPE_KEY))
    setHydrated(true)
  }, [])

  function approve(key: string, id: string, set: (v: Stored[]) => void) {
    const next = read(key).map((it) => (it.id === id ? { ...it, status: 'approved' as const } : it))
    window.localStorage.setItem(key, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('jangsanote:scrap-changed'))
    set(next)
  }
  function reject(key: string, id: string, set: (v: Stored[]) => void) {
    const next = read(key).filter((it) => it.id !== id)
    window.localStorage.setItem(key, JSON.stringify(next))
    set(next)
  }

  const pendingFestivals = festivals.filter((f) => f.status === 'pending')
  const pendingRecipes = recipes.filter((r) => r.status === 'pending')
  const total = pendingFestivals.length + pendingRecipes.length

  if (!hydrated) return <div className="h-40 animate-pulse rounded-xl bg-gray-100" />

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
        <Check className="mx-auto h-8 w-8 text-emerald-400" />
        <p className="mt-3 text-sm font-medium text-gray-700">검수 대기 중인 제보가 없습니다</p>
        <p className="mt-1 text-sm text-gray-500">새 제보가 등록되면 여기에서 승인·반려할 수 있습니다.</p>
      </div>
    )
  }

  function Row({
    it,
    metaText,
    onApprove,
    onReject,
  }: {
    it: Stored
    metaText: string
    onApprove: () => void
    onReject: () => void
  }) {
    return (
      <li className="flex items-center gap-3 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={it.coverImage} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-gray-900">{it.title}</div>
          <div className="mt-0.5 truncate text-xs text-gray-500">{metaText}</div>
        </div>
        <button
          type="button"
          onClick={onApprove}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
          style={{ background: 'var(--brand-primary)' }}
        >
          <Check className="h-3.5 w-3.5" /> 승인
        </button>
        <button
          type="button"
          onClick={onReject}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-rose-50 hover:text-rose-600"
        >
          <X className="h-3.5 w-3.5" /> 반려
        </button>
      </li>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Badge variant="warning">검수 대기 {total}</Badge>
        <span>승인하면 공개 목록에 ‘점주 제보’로 노출됩니다.</span>
      </div>

      {pendingFestivals.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-bold text-gray-900">행사·박람회 {pendingFestivals.length}</h2>
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white">
            {pendingFestivals.map((f) => (
              <Row
                key={f.id}
                it={f}
                metaText={`${f.type ? FESTIVAL_TYPE_LABEL[f.type] : '행사'} · ${f.region ?? ''} · ${f.venue ?? ''}`}
                onApprove={() => approve(FESTIVAL_KEY, f.id, setFestivals)}
                onReject={() => reject(FESTIVAL_KEY, f.id, setFestivals)}
              />
            ))}
          </ul>
        </section>
      )}

      {pendingRecipes.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-bold text-gray-900">레시피 {pendingRecipes.length}</h2>
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white">
            {pendingRecipes.map((r) => (
              <Row
                key={r.id}
                it={r}
                metaText={`${r.category ?? ''} · ${r.summary ?? ''}`}
                onApprove={() => approve(RECIPE_KEY, r.id, setRecipes)}
                onReject={() => reject(RECIPE_KEY, r.id, setRecipes)}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
