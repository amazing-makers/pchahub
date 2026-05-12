'use client'

import { useEffect, useRef } from 'react'
import type { MockListing } from '@/lib/mock-data'
import { TYPE_LABEL } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'

interface Props {
  listings: MockListing[]
}

// Type-color map for pin dots
const TYPE_COLOR: Record<string, string> = {
  transfer: '#ef4444', // red — 양도
  new: '#3b82f6',       // blue — 신규 임대
  sale: '#8b5cf6',      // purple — 매각
}

export default function ListingsMapInner({ listings }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically import leaflet (client-only)
    import('leaflet').then((L) => {
      // Fix default icon paths broken by webpack/next bundler
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      // Compute bounding center from all pins
      const lats = listings.map((l) => l.lat!)
      const lngs = listings.map((l) => l.lng!)
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2

      const map = L.map(mapRef.current!, {
        center: [centerLat, centerLng],
        zoom: 7,
        scrollWheelZoom: true,
      })

      mapInstanceRef.current = map

      // OpenStreetMap tile layer — free, no API key
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Add a pin per listing
      listings.forEach((listing) => {
        const color = TYPE_COLOR[listing.type] ?? '#6b7280'
        const typeLabel = TYPE_LABEL[listing.type]

        // Circle marker (no image dependency)
        const marker = L.circleMarker([listing.lat!, listing.lng!], {
          radius: 10,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        })

        const rentLine =
          listing.type === 'sale'
            ? `매각가 ${formatNumber(listing.salePrice ?? 0)}만원`
            : `보증 ${formatNumber(listing.deposit)}만 / 월세 ${formatNumber(listing.monthlyRent)}만`

        const popup = L.popup({ maxWidth: 260, className: 'listings-map-popup' }).setContent(`
          <div style="font-family:sans-serif;font-size:13px;line-height:1.5;padding:2px 0">
            <div style="display:inline-block;background:${color};color:#fff;border-radius:4px;padding:1px 6px;font-size:11px;margin-bottom:4px">${typeLabel}</div>
            <div style="font-weight:700;margin-bottom:2px">${listing.title}</div>
            <div style="color:#6b7280;font-size:12px;margin-bottom:6px">${listing.region} ${listing.district} · ${listing.area}평 ${listing.floor}</div>
            <div style="font-weight:600;color:#111">${rentLine}</div>
            <a href="/listings/${listing.id}" style="display:inline-block;margin-top:8px;padding:4px 10px;background:#111;color:#fff;border-radius:6px;text-decoration:none;font-size:12px">상세 보기 →</a>
          </div>
        `)

        marker.bindPopup(popup).addTo(map)
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When listings change (filters applied), update map
  useEffect(() => {
    if (!mapInstanceRef.current) return

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current
      // Remove existing circle markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.CircleMarker) {
          map.removeLayer(layer)
        }
      })

      listings.forEach((listing) => {
        const color = TYPE_COLOR[listing.type] ?? '#6b7280'
        const typeLabel = TYPE_LABEL[listing.type]

        const marker = L.circleMarker([listing.lat!, listing.lng!], {
          radius: 10,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        })

        const rentLine =
          listing.type === 'sale'
            ? `매각가 ${formatNumber(listing.salePrice ?? 0)}만원`
            : `보증 ${formatNumber(listing.deposit)}만 / 월세 ${formatNumber(listing.monthlyRent)}만`

        const popup = L.popup({ maxWidth: 260 }).setContent(`
          <div style="font-family:sans-serif;font-size:13px;line-height:1.5;padding:2px 0">
            <div style="display:inline-block;background:${color};color:#fff;border-radius:4px;padding:1px 6px;font-size:11px;margin-bottom:4px">${typeLabel}</div>
            <div style="font-weight:700;margin-bottom:2px">${listing.title}</div>
            <div style="color:#6b7280;font-size:12px;margin-bottom:6px">${listing.region} ${listing.district} · ${listing.area}평 ${listing.floor}</div>
            <div style="font-weight:600;color:#111">${rentLine}</div>
            <a href="/listings/${listing.id}" style="display:inline-block;margin-top:8px;padding:4px 10px;background:#111;color:#fff;border-radius:6px;text-decoration:none;font-size:12px">상세 보기 →</a>
          </div>
        `)

        marker.bindPopup(popup).addTo(map)
      })
    })
  }, [listings])

  return (
    <>
      {/* Leaflet CSS injected via link tag (avoids CSS import issues in Next.js) */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <style>{`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        .leaflet-container { border-radius: 1rem; }
      `}</style>
      <div
        ref={mapRef}
        className="h-[600px] w-full overflow-hidden rounded-2xl border border-gray-200"
      />
      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
        {(Object.entries(TYPE_COLOR) as [keyof typeof TYPE_LABEL, string][]).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full border-2 border-white shadow-sm"
              style={{ background: color }}
            />
            {TYPE_LABEL[type]}
          </span>
        ))}
      </div>
    </>
  )
}
