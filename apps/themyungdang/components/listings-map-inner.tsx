'use client'

import { useEffect, useRef } from 'react'
import type { MockListing, ListingType } from '@/lib/mock-data'
import { TYPE_LABEL } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'

function formatManwon(manwon: number): string {
  if (manwon >= 10000) {
    const eok = manwon / 10000
    return eok % 1 === 0 ? `${eok}억` : `${Math.round(eok * 10) / 10}억`
  }
  return `${formatNumber(manwon)}만`
}

interface Props {
  listings: MockListing[]
}

const TYPE_COLOR: Record<ListingType, string> = {
  transfer: '#ef4444',
  new:      '#2563eb',
  sale:     '#7c3aed',
}

// CartoDB Voyager — clean, professional, free, no API key
const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

function badgeHtml(listing: MockListing): string {
  const color = TYPE_COLOR[listing.type]
  const label =
    listing.type === 'sale'
      ? `${formatManwon(listing.salePrice ?? 0)}`
      : `월 ${formatNumber(listing.monthlyRent)}만`

  return `<div style="
    display:inline-flex;align-items:center;
    padding:5px 11px;border-radius:100px;
    background:#fff;color:#111827;
    border:1.5px solid #e5e7eb;
    box-shadow:0 2px 8px rgba(0,0,0,0.1),0 0 0 0.5px rgba(0,0,0,0.04);
    font-size:12.5px;font-weight:700;white-space:nowrap;cursor:pointer;
    transform:translate(-50%,-50%);
    font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif;
    letter-spacing:-0.5px;
  ">${label}</div>`
}

export default function ListingsMapInner({ listings }: Props) {
  const mapRef         = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const link = document.createElement('link')
    link.rel  = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    import('leaflet').then((L) => {
      const lats = listings.map((l) => l.lat!)
      const lngs = listings.map((l) => l.lng!)
      const center: [number, number] = [
        (Math.min(...lats) + Math.max(...lats)) / 2,
        (Math.min(...lngs) + Math.max(...lngs)) / 2,
      ]

      const map = L.map(mapRef.current!, {
        center,
        zoom: 7,
        zoomControl: false,
      })
      mapInstanceRef.current = map

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTR,
        maxZoom:    19,
        subdomains: 'abcd',
      }).addTo(map)

      listings.forEach((listing) => {
        const color     = TYPE_COLOR[listing.type]
        const typeLabel = TYPE_LABEL[listing.type]

        const icon = L.divIcon({
          html:       badgeHtml(listing),
          className:  '',
          iconSize:   [0, 0] as any,
          iconAnchor: [0, 0] as any,
        })

        const rentLine =
          listing.type === 'sale'
            ? `매각가 ${formatManwon(listing.salePrice ?? 0)}`
            : `보증 ${formatNumber(listing.deposit)}만 / 월세 ${formatNumber(listing.monthlyRent)}만`

        const popup = L.popup({ maxWidth: 260 }).setContent(`
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif;font-size:13px;line-height:1.6;padding:12px 14px">
            <div style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:100px;background:${color}18;color:${color};font-size:11px;font-weight:700;margin-bottom:6px">${typeLabel}</div>
            <div style="font-weight:700;font-size:14px;margin-bottom:3px;color:#111827">${listing.title}</div>
            <div style="color:#9ca3af;font-size:12px;margin-bottom:8px">${listing.region} ${listing.district} · ${listing.area}평 ${listing.floor}</div>
            <div style="font-weight:700;color:#111827;font-size:14px">${rentLine}</div>
            <a href="/listings/${listing.id}" style="display:inline-flex;align-items:center;margin-top:10px;padding:6px 14px;background:#111827;color:#fff;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600">상세 보기 →</a>
          </div>
        `)

        L.marker([listing.lat!, listing.lng!], { icon })
          .bindPopup(popup)
          .addTo(map)
      })
    })

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
      if (document.head.contains(link)) document.head.removeChild(link)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-draw markers if listings change (filter applied)
  useEffect(() => {
    if (!mapInstanceRef.current) return
    import('leaflet').then((L) => {
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) mapInstanceRef.current.removeLayer(layer)
      })
      listings.forEach((listing) => {
        const color     = TYPE_COLOR[listing.type]
        const typeLabel = TYPE_LABEL[listing.type]
        const icon = L.divIcon({
          html:       badgeHtml(listing),
          className:  '',
          iconSize:   [0, 0] as any,
          iconAnchor: [0, 0] as any,
        })
        const rentLine =
          listing.type === 'sale'
            ? `매각가 ${formatManwon(listing.salePrice ?? 0)}`
            : `보증 ${formatNumber(listing.deposit)}만 / 월세 ${formatNumber(listing.monthlyRent)}만`
        const popup = L.popup({ maxWidth: 260 }).setContent(`
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif;font-size:13px;line-height:1.6;padding:12px 14px">
            <div style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:100px;background:${color}18;color:${color};font-size:11px;font-weight:700;margin-bottom:6px">${typeLabel}</div>
            <div style="font-weight:700;font-size:14px;margin-bottom:3px;color:#111827">${listing.title}</div>
            <div style="color:#9ca3af;font-size:12px;margin-bottom:8px">${listing.region} ${listing.district} · ${listing.area}평 ${listing.floor}</div>
            <div style="font-weight:700;color:#111827;font-size:14px">${rentLine}</div>
            <a href="/listings/${listing.id}" style="display:inline-flex;align-items:center;margin-top:10px;padding:6px 14px;background:#111827;color:#fff;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600">상세 보기 →</a>
          </div>
        `)
        L.marker([listing.lat!, listing.lng!], { icon })
          .bindPopup(popup)
          .addTo(mapInstanceRef.current)
      })
    })
  }, [listings])

  return (
    <>
      <style>{`
        .leaflet-control-zoom {
          border: none !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15) !important;
        }
        .leaflet-control-zoom a {
          width: 36px !important; height: 36px !important;
          line-height: 36px !important; font-size: 18px !important;
          color: #374151 !important; background: #fff !important;
          border-bottom: 1px solid #f3f4f6 !important; font-weight: 300 !important;
        }
        .leaflet-control-zoom a:hover { background: #f9fafb !important; }
        .leaflet-popup-content-wrapper {
          border-radius: 14px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
          padding: 0 !important;
        }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip { box-shadow: none !important; }
        .leaflet-control-attribution { font-size: 10px !important; }
      `}</style>
      <div ref={mapRef} className="h-[580px] w-full overflow-hidden rounded-2xl border border-gray-200" />
      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
        {(Object.entries(TYPE_COLOR) as [ListingType, string][]).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: color }}
            />
            {TYPE_LABEL[type]}
          </span>
        ))}
      </div>
    </>
  )
}
