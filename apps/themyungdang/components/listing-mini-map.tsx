'use client'

import { useEffect, useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import type { MockListing } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'

const TILE_URL  = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'

interface Props { listing: MockListing }

export default function ListingMiniMap({ listing }: Props) {
  const divRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!divRef.current || mapRef.current || !listing.lat) return
    let cancelled = false

    const link = document.createElement('link')
    link.rel  = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    import('leaflet').then(L => {
      if (cancelled || mapRef.current || !divRef.current) return

      const map = L.map(divRef.current, {
        center:      [listing.lat!, listing.lng!],
        zoom:        16,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging:    false,
        doubleClickZoom: false,
      })
      mapRef.current = map

      L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map)

      // Custom pin
      const icon = L.divIcon({
        html: `<div style="
          width:36px;height:36px;background:var(--brand-primary,#111827);
          border-radius:50% 50% 50% 0;transform:rotate(-45deg) translate(-50%,-50%);
          border:3px solid #fff;box-shadow:0 3px 12px rgba(0,0,0,0.3);
          display:flex;align-items:center;justify-content:center;
        "></div>`,
        className:  '',
        iconSize:   [0, 0] as any,
        iconAnchor: [0, 0] as any,
      })

      L.marker([listing.lat!, listing.lng!], { icon })
        .bindPopup(
          `<div style="font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif;padding:6px 2px;font-size:12px">
            <div style="font-weight:700;color:#111827">${listing.title}</div>
            <div style="color:#6b7280;margin-top:2px">${listing.fullAddress}</div>
            <div style="color:#6b7280;margin-top:2px">일 유동 ${formatNumber(listing.footTraffic)}명</div>
          </div>`,
          { maxWidth: 220 },
        )
        .addTo(map)
        .openPopup()
    })

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      if (document.head.contains(link)) document.head.removeChild(link)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!listing.lat) return null

  const osmUrl = `https://www.openstreetmap.org/?mlat=${listing.lat}&mlon=${listing.lng}#map=16/${listing.lat}/${listing.lng}`

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div ref={divRef} className="h-[240px] w-full" />
      <a
        href={osmUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 border-t border-gray-100 bg-gray-50 py-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        지도에서 더 크게 보기
      </a>
    </div>
  )
}
