'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'pchahub:recentBrands'
const MAX_RECENT = 30

interface RecentBrandEntry {
  id: string
  name: string
  category: string
  logoColor?: string
}

interface BrandViewTrackerProps {
  brandId: string
  brandName: string
  brandCategory: string
  brandLogoColor?: string
}

export function BrandViewTracker({ brandId, brandName, brandCategory, brandLogoColor }: BrandViewTrackerProps) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const entries: RecentBrandEntry[] = raw ? (JSON.parse(raw) as RecentBrandEntry[]) : []
      const entry: RecentBrandEntry = { id: brandId, name: brandName, category: brandCategory, logoColor: brandLogoColor }
      const next = [entry, ...entries.filter((e) => e.id !== brandId)].slice(0, MAX_RECENT)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* ignore */ }
  }, [brandId, brandName, brandCategory, brandLogoColor])

  return null
}
