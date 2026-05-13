'use client'

import { useEffect, useRef, useState } from 'react'
import { formatNumber } from '@amakers/utils'
import { AREAS, type MockArea } from '@/lib/mock-data'

interface Props {
  /** Visible (filtered) areas — only these circles will be shown on the map */
  areas: MockArea[]
  /** 강조 표시할 상권 key */
  highlightKey?: string
  /** 지도 높이 — 기본 480px */
  height?: number
}

// ── footTraffic 기준 원 색상 ──────────────────────────────────────────────────
function circleStyle(footTraffic: number, highlighted: boolean) {
  let color: string
  if (footTraffic >= 80000)      color = '#ef4444'
  else if (footTraffic >= 60000) color = '#f97316'
  else if (footTraffic >= 40000) color = '#eab308'
  else                           color = '#22c55e'

  return {
    color:       highlighted ? '#1d4ed8' : color,
    fillColor:   highlighted ? '#3b82f6' : color,
    fillOpacity: highlighted ? 0.30 : 0.18,
    weight:      highlighted ? 3 : 2,
    opacity:     highlighted ? 1.0 : 0.75,
  }
}

export default function AreasMap({ areas, highlightKey, height = 480 }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<ReturnType<typeof import('leaflet')['map']> | null>(null)
  const circlesRef    = useRef<Map<string, any>>(new Map())   // key → circle layer
  const labelsRef     = useRef<Map<string, any>>(new Map())   // key → label marker
  const leafletRef    = useRef<any>(null)                     // L instance
  const [activeKey,   setActiveKey] = useState<string | null>(highlightKey ?? null)
  const [mapReady,    setMapReady]  = useState(false)

  // ── Init Leaflet once — uses ALL AREAS to create circles ──────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return
    if (mapRef.current) return

    let cancelled = false

    import('leaflet').then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'; link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      leafletRef.current = L

      const map = L.map(containerRef.current!, {
        center: [36.5, 127.8], zoom: 7,
        zoomControl: true, scrollWheelZoom: true, attributionControl: false,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map)

      // Build circles & labels for ALL areas (not just the visible subset)
      // We show/hide them separately via the `areas` prop effect below.
      for (const area of AREAS) {
        if (!area.lat || !area.lng || !area.radiusM) continue

        const style  = circleStyle(area.footTraffic, area.key === highlightKey)
        const circle = L.circle([area.lat, area.lng], {
          radius: area.radiusM, ...style,
          interactive: true, bubblingMouseEvents: false,
        })

        const popupHtml = `
          <div style="min-width:180px;font-family:system-ui,sans-serif;line-height:1.4">
            <div style="font-size:14px;font-weight:700;color:#111;margin-bottom:6px">${area.name}</div>
            <div style="font-size:11px;color:#6b7280;margin-bottom:8px">${area.region} ${area.district}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;font-size:12px">
              <span style="color:#9ca3af">일 유동인구</span>
              <span style="font-weight:600;color:#111">${formatNumber(area.footTraffic)}명</span>
              <span style="color:#9ca3af">평당 월세</span>
              <span style="font-weight:600;color:#111">${area.avgMonthlyRentPerPyeong}만원</span>
              <span style="color:#9ca3af">평균 권리금</span>
              <span style="font-weight:600;color:#111">${formatNumber(area.avgRightFee)}만</span>
            </div>
            <a href="/areas/${area.key}"
              style="display:block;margin-top:10px;padding:6px 0;background:#111;color:#fff;border-radius:8px;text-align:center;font-size:12px;font-weight:600;text-decoration:none"
            >상세 분석 보기 →</a>
          </div>`

        circle.bindPopup(popupHtml, { maxWidth: 240, offset: L.point(0, -6) })
        circle.on('click', () => setActiveKey(area.key))

        const labelIcon = L.divIcon({
          className: '',
          html: `<div style="background:rgba(255,255,255,0.88);border:1px solid rgba(0,0,0,0.12);border-radius:6px;padding:2px 6px;font-size:11px;font-weight:700;color:#111;white-space:nowrap;pointer-events:none;box-shadow:0 1px 3px rgba(0,0,0,0.12);">${area.name}</div>`,
          iconAnchor: [0, 0],
        })
        const label = L.marker([area.lat, area.lng], { icon: labelIcon, interactive: false })

        circlesRef.current.set(area.key, circle)
        labelsRef.current.set(area.key, label)
      }

      mapRef.current = map
      setMapReady(true)  // trigger show/hide effect now that map + circles exist
    })

    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Show/hide circles when visible `areas` prop changes ───────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const map    = mapRef.current
    const visible = new Set(areas.map(a => a.key))

    circlesRef.current.forEach((circle, key) => {
      if (visible.has(key)) {
        if (!map.hasLayer(circle)) circle.addTo(map)
      } else {
        if (map.hasLayer(circle))  map.removeLayer(circle)
      }
    })
    labelsRef.current.forEach((label, key) => {
      if (visible.has(key)) {
        if (!map.hasLayer(label)) label.addTo(map)
      } else {
        if (map.hasLayer(label))  map.removeLayer(label)
      }
    })
  }, [areas, mapReady])

  // ── Update highlight style when selection changes ─────────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    circlesRef.current.forEach((circle, key) => {
      const area = AREAS.find(a => a.key === key)
      if (!area) return
      circle.setStyle(circleStyle(area.footTraffic, key === (highlightKey ?? activeKey)))
    })
  }, [highlightKey, activeKey])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
      <div ref={containerRef} style={{ height }} className="w-full" />

      {/* 범례 */}
      <div className="absolute bottom-3 left-3 z-[1000] rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-xs shadow backdrop-blur-sm">
        <div className="mb-1.5 font-semibold text-gray-700">유동인구 규모</div>
        {[
          { color: '#ef4444', label: '최고급  80,000+' },
          { color: '#f97316', label: '대형  60,000+' },
          { color: '#eab308', label: '중형  40,000+' },
          { color: '#22c55e', label: '소형' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 leading-5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
            <span className="text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
