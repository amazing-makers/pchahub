'use client'

import { useCallback, useEffect, useState } from 'react'

export const FAV_KEY   = 'tmyd-fav'
const FAV_EVENT = 'tmyd-fav-change'

// ── Storage helpers ───────────────────────────────────────────────────────────

function readFavorites(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(FAV_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function writeFavorites(favorites: Set<string>) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify([...favorites]))
    // Notify all other mounted useFavorites() instances on the same page
    window.dispatchEvent(new CustomEvent(FAV_EVENT))
  } catch {
    /* ignore quota errors */
  }
}

// ── Shared hook ───────────────────────────────────────────────────────────────

/**
 * Read/write favorites from localStorage.
 * Syncs in real-time across all mounted instances on the same page via
 * the `tmyd-fav-change` CustomEvent — no React context or Zustand required.
 *
 * Safe for SSR: initial state is always empty Set; localStorage is read
 * in useEffect (client-only), avoiding hydration mismatches.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [hydrated,  setHydrated]  = useState(false)

  useEffect(() => {
    // Load on mount (first render after SSR)
    setFavorites(readFavorites())
    setHydrated(true)

    // Stay in sync when any other component toggles a favorite
    const handler = () => setFavorites(readFavorites())
    window.addEventListener(FAV_EVENT, handler)
    return () => window.removeEventListener(FAV_EVENT, handler)
  }, [])

  const toggle = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      writeFavorites(next)
      return next
    })
  }, [])

  return { favorites, toggle, hydrated }
}
