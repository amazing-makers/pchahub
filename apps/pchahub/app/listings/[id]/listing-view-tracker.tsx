'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'pchahub:recentListings'
const MAX_RECENT = 30

interface RecentListingEntry {
  id: string
  title: string
  region: string
  listingType: string
}

interface ListingViewTrackerProps {
  listingId: string
  listingTitle: string
  listingRegion: string
  listingType: string
}

export function ListingViewTracker({ listingId, listingTitle, listingRegion, listingType }: ListingViewTrackerProps) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const entries: RecentListingEntry[] = raw ? (JSON.parse(raw) as RecentListingEntry[]) : []
      const entry: RecentListingEntry = { id: listingId, title: listingTitle, region: listingRegion, listingType }
      const next = [entry, ...entries.filter((e) => e.id !== listingId)].slice(0, MAX_RECENT)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* ignore */ }
  }, [listingId, listingTitle, listingRegion, listingType])

  return null
}
