'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import type { MockListing } from '@/lib/mock-data'
import { TYPE_LABEL } from '@/lib/mock-data'

// ──────────────────────────────────────────────────────────────
// Leaflet must be loaded client-side only (no SSR).
// We use dynamic import with ssr: false for the inner component.
// ──────────────────────────────────────────────────────────────

interface Props {
  listings: MockListing[]
}

const MapInner = dynamic(() => import('./listings-map-inner'), { ssr: false })

export function ListingsMap({ listings }: Props) {
  const withCoords = useMemo(() => listings.filter((l) => l.lat != null && l.lng != null), [listings])

  if (withCoords.length === 0) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-500">
        지도에 표시할 매물이 없습니다.
      </div>
    )
  }

  return <MapInner listings={withCoords} />
}
