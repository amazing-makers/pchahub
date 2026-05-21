'use client'
import { useEffect } from 'react'

const STORAGE_KEY = 'themanual:recentRecipes'
const MAX_RECENT = 30

interface RecentRecipeEntry {
  id: string
  title: string
  category: string
}

interface Props {
  recipeId: string
  recipeTitle: string
  recipeCategory: string
}

export function RecipeViewTracker({ recipeId, recipeTitle, recipeCategory }: Props) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const entries: RecentRecipeEntry[] = raw ? JSON.parse(raw) : []
      const entry: RecentRecipeEntry = {
        id: recipeId,
        title: recipeTitle,
        category: recipeCategory,
      }
      const next = [entry, ...entries.filter((e) => e.id !== recipeId)].slice(0, MAX_RECENT)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }, [recipeId, recipeTitle, recipeCategory])

  return null
}
