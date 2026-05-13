'use client'

import { useEffect, useRef } from 'react'
import { formatNumber } from '@amakers/utils'
import type { MockArea, MockListing } from '@/lib/mock-data'

interface Props {
  area: MockArea
  listings: MockListing[]
}

/** 상권 반경 원 + 소속 매물 핀을 보여주는 Leaflet 지도 */
export default function AreaMiniMap({ area, listings }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<ReturnType<typeof import('leaflet')['map']> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return
    if (mapRef.current) return
    if (!area.lat || !area.lng) return

    let cancelled = false

    import('leaflet').then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id   = 'leaflet-css'
        link.rel  = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      const map = L.map(containerRef.current!, {
        center:          [area.lat!, area.lng!],
        zoom:            14,
        scrollWheelZoom: false,
        zoomControl:     true,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map)

      // ── 상권 반경 원 ─────────────────────────────────────────────
      L.circle([area.lat!, area.lng!], {
        radius:      area.radiusM ?? 500,
        color:       '#6366f1',
        fillColor:   '#818cf8',
        fillOpacity: 0.15,
        weight:      2.5,
        dashArray:   '6 4',
      }).addTo(map)

      // ── 상권 중심 마커 ────────────────────────────────────────────
      const centerIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:14px;height:14px;
          background:#6366f1;
          border:3px solid #fff;
          border-radius:50%;
          box-shadow:0 0 0 2px #6366f1;
        "></div>`,
        iconAnchor: [7, 7],
      })
      L.marker([area.lat!, area.lng!], { icon: centerIcon })
        .bindTooltip(area.name, { permanent: true, direction: 'top', offset: [0, -10], className: '' })
        .addTo(map)

      // ── 매물 핀 ──────────────────────────────────────────────────
      const TYPE_COLOR: Record<string, string> = {
        transfer: '#10b981',
        new:      '#3b82f6',
        sale:     '#f59e0b',
      }

      for (const l of listings) {
        if (!l.lat || !l.lng) continue

        const color = TYPE_COLOR[l.type] ?? '#6b7280'
        const pinIcon = L.divIcon({
          className: '',
          html: `<div style="
            width:10px;height:10px;
            background:${color};
            border:2px solid #fff;
            border-radius:50%;
            box-shadow:0 1px 4px rgba(0,0,0,0.25);
          "></div>`,
          iconAnchor: [5, 5],
        })

        const priceText =
          l.type === 'sale'
            ? `매각가 ${formatNumber(l.salePrice ?? 0)}만`
            : `보증 ${formatNumber(l.deposit)}만 / 월세 ${formatNumber(l.monthlyRent)}만`

        L.marker([l.lat, l.lng], { icon: pinIcon })
          .bindPopup(
            `<div style="font-family:system-ui,sans-serif;min-width:160px">
              <div style="font-size:12px;font-weight:700;color:#111;margin-bottom:4px">${l.title}</div>
              <div style="font-size:11px;color:#6b7280;margin-bottom:8px">${priceText}</div>
              <a href="/listings/${l.id}" style="display:block;text-align:center;background:#111;color:#fff;padding:5px 0;border-radius:7px;font-size:11px;font-weight:600;text-decoration:none">
                매물 보기 →
              </a>
            </div>`,
            { maxWidth: 220 },
          )
          .addTo(map)
      }

      mapRef.current = map
    })

    return () => {
      cancelled = true
    }
  }, [area, listings])

  if (!area.lat || !area.lng) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
      <div ref={containerRef} className="h-[300px] w-full" />
      {/* 핀 범례 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-100 bg-white px-4 py-2.5 text-xs text-gray-600">
        <span className="font-medium text-gray-500">매물 유형</span>
        {[
          { color: '#10b981', label: '양도' },
          { color: '#3b82f6', label: '신규 임대' },
          { color: '#f59e0b', label: '매각' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
            {label}
          </span>
        ))}
        <span className="ml-auto text-gray-400">
          핀을 클릭하면 매물 정보를 볼 수 있습니다
        </span>
      </div>
    </div>
  )
}
