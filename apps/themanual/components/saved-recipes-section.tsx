'use client'

import { useEffect, useState } from 'react'
import { Bookmark, ChefHat, Clock } from 'lucide-react'
import { RECIPES, RECIPE_CATEGORY_LABEL } from '@/lib/recipes'

const KEY = 'themanual:savedRecipes'

export function SavedRecipesSection() {
  const [savedRecipes, setSavedRecipes] = useState<typeof RECIPES>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const matched = ids
        .map((id) => RECIPES.find((r) => r.id === id))
        .filter((r): r is (typeof RECIPES)[number] => Boolean(r))
      setSavedRecipes(matched)
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || savedRecipes.length === 0) return null

  return (
    <section className="border-t border-gray-100 py-10">
      <div className="container mx-auto">
        <div className="mb-4 flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-[var(--brand-primary)]" />
          <h2 className="text-h4 font-semibold text-gray-900">저장한 레시피</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {savedRecipes.map((r) => (
            <a
              key={r.id}
              href={`/recipes/${r.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-2 pr-3 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              <ChefHat className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
              <span className="font-medium">{r.title}</span>
              <span className="text-xs text-gray-400">
                {RECIPE_CATEGORY_LABEL[r.category]}
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                {r.cookingTime}분
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
