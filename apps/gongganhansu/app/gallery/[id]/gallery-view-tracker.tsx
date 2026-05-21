'use client'
import { useEffect } from 'react'

const STORAGE_KEY = 'gongganhansu:recentPortfolio'
const MAX_RECENT = 30

interface RecentPortfolioEntry {
  id: string
  title: string
  category: string
  region: string
}

interface Props {
  portfolioId: string
  portfolioTitle: string
  portfolioCategory: string
  portfolioRegion: string
}

export function GalleryViewTracker({
  portfolioId,
  portfolioTitle,
  portfolioCategory,
  portfolioRegion,
}: Props) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const entries: RecentPortfolioEntry[] = raw ? JSON.parse(raw) : []
      const entry: RecentPortfolioEntry = {
        id: portfolioId,
        title: portfolioTitle,
        category: portfolioCategory,
        region: portfolioRegion,
      }
      const next = [entry, ...entries.filter((e) => e.id !== portfolioId)].slice(
        0,
        MAX_RECENT,
      )
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }, [portfolioId, portfolioTitle, portfolioCategory, portfolioRegion])

  return null
}
