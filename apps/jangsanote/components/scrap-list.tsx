'use client'

import { useEffect, useState } from 'react'
import { Bookmark, CalendarDays, ChefHat, HandCoins } from 'lucide-react'
import { FESTIVALS, RECIPES, SUPPORTS } from '@/lib/hub-data'
import { RecipeCard } from './recipe-card'
import { FestivalCard } from './festival-card'
import { SupportCard } from './support-card'
import { readScrap } from './scrap-button'

export function ScrapList() {
  const [ids, setIds] = useState<{ recipes: string[]; festivals: string[]; support: string[] }>({
    recipes: [],
    festivals: [],
    support: [],
  })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const load = () =>
      setIds({
        recipes: readScrap('recipes'),
        festivals: readScrap('festivals'),
        support: readScrap('support'),
      })
    load()
    setHydrated(true)
    const onChange = () => load()
    window.addEventListener('jangsanote:scrap-changed', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('jangsanote:scrap-changed', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  const recipes = RECIPES.filter((r) => ids.recipes.includes(r.id))
  const festivals = FESTIVALS.filter((f) => ids.festivals.includes(f.id))
  const supports = SUPPORTS.filter((s) => ids.support.includes(s.id))
  const total = recipes.length + festivals.length + supports.length

  if (!hydrated) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-56 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
        <Bookmark className="mx-auto h-8 w-8 text-gray-300" />
        <p className="mt-3 text-sm font-medium text-gray-700">아직 스크랩한 항목이 없습니다</p>
        <p className="mt-1 text-sm text-gray-500">관심 있는 레시피·축제·지원사업을 저장해 모아보세요.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <a href="/recipes" className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">레시피 보기</a>
          <a href="/festivals" className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">축제·박람회</a>
          <a href="/support" className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">지원·이벤트</a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {recipes.length > 0 && (
        <section>
          <h2 className="mb-4 inline-flex items-center gap-2 text-base font-bold text-gray-900">
            <ChefHat className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
            레시피 <span className="text-sm font-normal text-gray-400">{recipes.length}</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </section>
      )}
      {festivals.length > 0 && (
        <section>
          <h2 className="mb-4 inline-flex items-center gap-2 text-base font-bold text-gray-900">
            <CalendarDays className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
            축제·박람회 <span className="text-sm font-normal text-gray-400">{festivals.length}</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {festivals.map((f) => (
              <FestivalCard key={f.id} festival={f} />
            ))}
          </div>
        </section>
      )}
      {supports.length > 0 && (
        <section>
          <h2 className="mb-4 inline-flex items-center gap-2 text-base font-bold text-gray-900">
            <HandCoins className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
            지원·이벤트 <span className="text-sm font-normal text-gray-400">{supports.length}</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {supports.map((s) => (
              <SupportCard key={s.id} support={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
