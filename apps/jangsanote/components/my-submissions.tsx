'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, ChefHat, PencilLine, Trash2 } from 'lucide-react'
import { formatNumber } from '@amakers/utils'
import { FESTIVAL_TYPE_LABEL, type FestivalType } from '@/lib/hub-data'

const FESTIVAL_KEY = 'jangsanote:community:festivals'
const RECIPE_KEY = 'jangsanote:community:recipes'

interface LocalFestival {
  id: string
  title: string
  type: FestivalType
  venue: string
  region: string
  startDate: string
  coverImage: string
}
interface LocalRecipe {
  id: string
  title: string
  category: string
  costPerWon: number
  coverImage: string
}

function read<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

export function MySubmissions() {
  const [festivals, setFestivals] = useState<LocalFestival[]>([])
  const [recipes, setRecipes] = useState<LocalRecipe[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setFestivals(read<LocalFestival>(FESTIVAL_KEY))
    setRecipes(read<LocalRecipe>(RECIPE_KEY))
    setHydrated(true)
  }, [])

  function removeFestival(id: string) {
    const next = read<LocalFestival>(FESTIVAL_KEY).filter((f) => f.id !== id)
    window.localStorage.setItem(FESTIVAL_KEY, JSON.stringify(next))
    setFestivals(next)
  }
  function removeRecipe(id: string) {
    const next = read<LocalRecipe>(RECIPE_KEY).filter((r) => r.id !== id)
    window.localStorage.setItem(RECIPE_KEY, JSON.stringify(next))
    setRecipes(next)
  }

  const total = festivals.length + recipes.length

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
  }

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
        <PencilLine className="mx-auto h-8 w-8 text-gray-300" />
        <p className="mt-3 text-sm font-medium text-gray-700">아직 등록한 제보가 없습니다</p>
        <p className="mt-1 text-sm text-gray-500">행사·박람회나 매장 레시피를 공유해보세요.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <a href="/festivals/new" className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">행사 제보</a>
          <a href="/recipes/new" className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">레시피 작성</a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <p className="rounded-lg bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
        등록한 제보는 목록에 ‘점주 제보’로 표시됩니다. 실제 운영 시에는 관리자 검수 후 공개됩니다.
      </p>

      {festivals.length > 0 && (
        <section>
          <h2 className="mb-3 inline-flex items-center gap-2 text-base font-bold text-gray-900">
            <CalendarDays className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
            행사·박람회 제보 <span className="text-sm font-normal text-gray-400">{festivals.length}</span>
          </h2>
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white">
            {festivals.map((f) => (
              <li key={f.id} className="flex items-center gap-3 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.coverImage} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-gray-900">{f.title}</div>
                  <div className="mt-0.5 truncate text-xs text-gray-500">
                    {FESTIVAL_TYPE_LABEL[f.type]} · {f.region} · {f.startDate}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFestival(f.id)}
                  aria-label="삭제"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {recipes.length > 0 && (
        <section>
          <h2 className="mb-3 inline-flex items-center gap-2 text-base font-bold text-gray-900">
            <ChefHat className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
            레시피 <span className="text-sm font-normal text-gray-400">{recipes.length}</span>
          </h2>
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white">
            {recipes.map((r) => (
              <li key={r.id} className="flex items-center gap-3 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.coverImage} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-gray-900">{r.title}</div>
                  <div className="mt-0.5 truncate text-xs text-gray-500">
                    {r.category} · 원가 {r.costPerWon === 0 ? '0원' : `${formatNumber(r.costPerWon)}원`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeRecipe(r.id)}
                  aria-label="삭제"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
