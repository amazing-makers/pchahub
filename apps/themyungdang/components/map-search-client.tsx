'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BarChart2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import type { MockListing, MockArea, ListingType } from '@/lib/mock-data'
import { TYPE_LABEL, AREAS, LISTING_CATEGORIES } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Map tile — OpenStreetMap Standard
// OSM은 한국 데이터가 풍부하여 한글 지명이 기본으로 표시됩니다.
// 향후 Kakao Map API / Naver Map API 연동 시 교체 예정.
// ─────────────────────────────────────────────────────────────────────────────
const TILE_URL  = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
const KOREA_CENTER: [number, number] = [36.5, 127.8]
const DEFAULT_ZOOM = 7

const TYPE_COLOR: Record<ListingType, string> = {
  transfer: '#ef4444',
  new:      '#2563eb',
  sale:     '#7c3aed',
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter state
// ─────────────────────────────────────────────────────────────────────────────
const RENT_PRESETS = [
  { label: '전체',    min: 0,   max: Infinity },
  { label: '~50만',  min: 0,   max: 50 },
  { label: '~100만', min: 0,   max: 100 },
  { label: '~200만', min: 0,   max: 200 },
  { label: '~300만', min: 0,   max: 300 },
  { label: '300만+', min: 300, max: Infinity },
]

const AREA_PRESETS = [
  { label: '전체',    min: 0,  max: Infinity },
  { label: '~10평',  min: 0,  max: 10 },
  { label: '10~20평', min: 10, max: 20 },
  { label: '20~30평', min: 20, max: 30 },
  { label: '30평+',  min: 30, max: Infinity },
]

interface Filters {
  type:         string | null
  rentPreset:   number   // index into RENT_PRESETS
  areaPreset:   number   // index into AREA_PRESETS
  fitCategory:  string | null
  verifiedOnly: boolean
  noRightFee:   boolean
}

const DEFAULT_FILTERS: Filters = {
  type:         null,
  rentPreset:   0,
  areaPreset:   0,
  fitCategory:  null,
  verifiedOnly: false,
  noRightFee:   false,
}

function matchesFilters(l: MockListing, f: Filters): boolean {
  if (f.type && l.type !== f.type) return false

  // Rent filter only applies to non-sale listings
  if (l.type !== 'sale') {
    const rp = RENT_PRESETS[f.rentPreset]
    if (rp && l.monthlyRent > rp.max) return false
    if (rp && l.monthlyRent < rp.min) return false
  }

  const ap = AREA_PRESETS[f.areaPreset]
  if (ap && l.area > ap.max) return false
  if (ap && l.area < ap.min) return false

  if (f.fitCategory && !l.fitCategories.includes(f.fitCategory)) return false
  if (f.verifiedOnly && !l.verified) return false
  if (f.noRightFee && (l.rightFee ?? 0) > 0) return false

  return true
}

function activeFilterCount(f: Filters): number {
  let n = 0
  if (f.type)         n++
  if (f.rentPreset)   n++
  if (f.areaPreset)   n++
  if (f.fitCategory)  n++
  if (f.verifiedOnly) n++
  if (f.noRightFee)   n++
  return n
}

// ─────────────────────────────────────────────────────────────────────────────
// Area overlay helpers
// ─────────────────────────────────────────────────────────────────────────────
function areaCircleColor(footTraffic: number): string {
  if (footTraffic > 70000) return '#ef4444'  // 매우 높음 — 빨강
  if (footTraffic > 50000) return '#f97316'  // 높음 — 주황
  if (footTraffic > 35000) return '#eab308'  // 보통 — 노랑
  return '#22c55e'                           // 낮음 — 초록
}

function areaPopupHtml(area: MockArea): string {
  const color     = areaCircleColor(area.footTraffic)
  const catChips  = area.topCategories
    .map(c => `<span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:100px;background:${color}18;color:${color};font-size:11px;font-weight:600;margin:2px">${c.label} ${c.share}%</span>`)
    .join('')
  const highlights = area.highlights.map(h => `<li style="margin-bottom:3px">${h}</li>`).join('')
  const cautions   = area.cautions.map(c => `<li style="margin-bottom:3px">${c}</li>`).join('')

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;min-width:260px;max-width:300px;padding:16px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0"></span>
        <span style="font-size:16px;font-weight:800;color:#111827;letter-spacing:-0.5px">${area.name}</span>
      </div>
      <div style="color:#6b7280;font-size:12px;margin-bottom:14px">${area.region} ${area.district}</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        <div style="background:#f9fafb;border-radius:10px;padding:10px">
          <div style="font-size:10px;color:#9ca3af;margin-bottom:3px">일 유동인구</div>
          <div style="font-size:17px;font-weight:800;color:#111827">${formatNumber(area.footTraffic)}명</div>
        </div>
        <div style="background:#f9fafb;border-radius:10px;padding:10px">
          <div style="font-size:10px;color:#9ca3af;margin-bottom:3px">평당 월세</div>
          <div style="font-size:17px;font-weight:800;color:#111827">${area.avgMonthlyRentPerPyeong}만원</div>
        </div>
        <div style="background:#f9fafb;border-radius:10px;padding:10px">
          <div style="font-size:10px;color:#9ca3af;margin-bottom:3px">평균 권리금</div>
          <div style="font-size:17px;font-weight:800;color:#111827">${formatNumber(area.avgRightFee)}만</div>
        </div>
        <div style="background:#f9fafb;border-radius:10px;padding:10px">
          <div style="font-size:10px;color:#9ca3af;margin-bottom:3px">평균 보증금</div>
          <div style="font-size:17px;font-weight:800;color:#111827">${formatNumber(area.avgDeposit)}만</div>
        </div>
      </div>

      <div style="margin-bottom:12px">
        <div style="font-size:11px;font-weight:700;color:#374151;margin-bottom:5px">주요 업종</div>
        <div style="display:flex;flex-wrap:wrap">${catChips}</div>
      </div>

      <div style="margin-bottom:10px">
        <div style="font-size:11px;font-weight:700;color:#16a34a;margin-bottom:4px">✓ 특징</div>
        <ul style="margin:0;padding-left:14px;color:#374151;font-size:12px;line-height:1.6">${highlights}</ul>
      </div>
      <div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:#dc2626;margin-bottom:4px">⚠ 주의</div>
        <ul style="margin:0;padding-left:14px;color:#374151;font-size:12px;line-height:1.6">${cautions}</ul>
      </div>

      <a href="/areas/${area.key}" style="display:inline-flex;align-items:center;padding:7px 14px;background:#111827;color:#fff;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600">
        상세 분석 보기 →
      </a>
    </div>`
}

// ─────────────────────────────────────────────────────────────────────────────
// Marker badge HTML
// ─────────────────────────────────────────────────────────────────────────────
function badgeHtml(listing: MockListing, selected: boolean): string {
  const label =
    listing.type === 'sale'
      ? `${formatNumber(listing.salePrice ?? 0)}만`
      : `월 ${formatNumber(listing.monthlyRent)}만`
  const color = TYPE_COLOR[listing.type]

  const style = selected
    ? `background:${color};color:#fff;border:2px solid ${color};box-shadow:0 6px 24px rgba(0,0,0,0.25);transform:translate(-50%,-50%) scale(1.18);`
    : `background:#fff;color:#111827;border:1.5px solid #e5e7eb;box-shadow:0 2px 8px rgba(0,0,0,0.1);transform:translate(-50%,-50%);`

  return `<div style="${style}display:inline-flex;align-items:center;padding:5px 11px;border-radius:100px;font-size:12.5px;font-weight:700;white-space:nowrap;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif;letter-spacing:-0.5px;pointer-events:auto;">${label}</div>`
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
interface Props { allListings: MockListing[] }

export default function MapSearchClient({ allListings }: Props) {
  const mapDivRef      = useRef<HTMLDivElement>(null)
  const mapRef         = useRef<any>(null)
  const markersRef     = useRef<Map<string, any>>(new Map())
  const areaLayersRef  = useRef<Map<string, any>>(new Map())
  const sidebarRef     = useRef<HTMLDivElement>(null)

  const [visibleListings, setVisibleListings] = useState<MockListing[]>([])
  const [selectedId,      setSelectedId]      = useState<string | null>(null)
  const [filters,         setFilters]         = useState<Filters>(DEFAULT_FILTERS)
  const [showAreas,       setShowAreas]       = useState(false)
  const [filtersOpen,     setFiltersOpen]     = useState(true)
  const [mapMoved,        setMapMoved]        = useState(false)
  const [mapReady,        setMapReady]        = useState(false)

  // Stable refs for use inside Leaflet event handlers (avoids stale closures)
  const filtersRef    = useRef<Filters>(DEFAULT_FILTERS)
  const selectedIdRef = useRef<string | null>(null)
  const withCoords    = useMemo(() => allListings.filter(l => l.lat != null && l.lng != null), [allListings])

  useEffect(() => { filtersRef.current  = filters  }, [filters])
  useEffect(() => { selectedIdRef.current = selectedId }, [selectedId])

  // Available fit categories across all coord-bearing listings
  const availableCategories = useMemo(() => {
    const cats = new Map<string, string>()
    withCoords.forEach(l => l.fitCategories.forEach(k => {
      const found = LISTING_CATEGORIES.find(c => c.key === k)
      if (found) cats.set(k, found.label)
    }))
    return [...cats.entries()].sort((a, b) => a[1].localeCompare(b[1]))
  }, [withCoords])

  const filterCount = activeFilterCount(filters)

  const setFilter = <K extends keyof Filters>(key: K, val: Filters[K]) =>
    setFilters(prev => ({ ...prev, [key]: val }))

  const resetFilters = () => setFilters(DEFAULT_FILTERS)

  // ── Initialize Leaflet (once) ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    import('leaflet').then(L => {
      const map = L.map(mapDivRef.current!, {
        center: KOREA_CENTER,
        zoom:   DEFAULT_ZOOM,
        zoomControl: false,
      })
      mapRef.current = map

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // OpenStreetMap — Korean labels natively supported
      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTR,
        maxZoom: 19,
      }).addTo(map)

      // ── Listing markers ───────────────────────────────────────────────────
      withCoords.forEach(listing => {
        const icon = L.divIcon({
          html:       badgeHtml(listing, false),
          className:  '',
          iconSize:   [0, 0] as any,
          iconAnchor: [0, 0] as any,
        })
        const marker = L.marker([listing.lat!, listing.lng!], { icon, zIndexOffset: 0 })

        marker.on('click', (e: any) => {
          L.DomEvent.stopPropagation(e)
          const next = selectedIdRef.current === listing.id ? null : listing.id
          setSelectedId(next)
          if (next && sidebarRef.current) {
            setTimeout(() => {
              sidebarRef.current?.querySelector(`[data-id="${next}"]`)
                ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }, 60)
          }
        })

        marker.addTo(map)
        markersRef.current.set(listing.id, marker)
      })

      // ── Area overlay circles (hidden initially) ───────────────────────────
      const areasWithCoords = AREAS.filter(a => a.lat != null)
      areasWithCoords.forEach(area => {
        const color = areaCircleColor(area.footTraffic)
        const circle = L.circle([area.lat!, area.lng!], {
          radius:      area.radiusM ?? 500,
          fillColor:   color,
          fillOpacity: 0.12,
          color,
          weight: 2,
          opacity: 0.7,
          dashArray: '6 4',
          interactive: true,
        })

        // Center label marker
        const labelIcon = L.divIcon({
          html: `<div style="background:${color};color:#fff;padding:3px 8px;border-radius:100px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);transform:translate(-50%,-50%);font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif;">${area.name}</div>`,
          className: '',
          iconSize:   [0, 0] as any,
          iconAnchor: [0, 0] as any,
        })
        const labelMarker = L.marker([area.lat!, area.lng!], { icon: labelIcon, zIndexOffset: -100, interactive: false })

        const popup = L.popup({ maxWidth: 320, className: 'area-popup' })
          .setContent(areaPopupHtml(area))

        circle.bindPopup(popup)

        // Store both circle and label
        areaLayersRef.current.set(area.key + '-circle', circle)
        areaLayersRef.current.set(area.key + '-label',  labelMarker)
      })

      // Deselect on map background click
      map.on('click', () => setSelectedId(null))

      // ── Bounds-based visible filter ───────────────────────────────────────
      const updateVisible = () => {
        const bounds = map.getBounds()
        const f      = filtersRef.current
        const visible = withCoords.filter(l =>
          bounds.contains(L.latLng(l.lat!, l.lng!)) && matchesFilters(l, f)
        )
        setVisibleListings(visible)
        setMapMoved(false)
      }

      map.on('moveend zoomend', () => { setMapMoved(true); updateVisible() })
      map.once('load', updateVisible)
      setTimeout(updateVisible, 500)
      setMapReady(true)
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current.clear()
      areaLayersRef.current.clear()
      if (document.head.contains(link)) document.head.removeChild(link)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Update marker icons on selection change ────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then(L => {
      markersRef.current.forEach((marker, id) => {
        const listing = withCoords.find(l => l.id === id)
        if (!listing) return
        const sel = id === selectedId
        marker.setIcon(L.divIcon({
          html:       badgeHtml(listing, sel),
          className:  '',
          iconSize:   [0, 0] as any,
          iconAnchor: [0, 0] as any,
        }))
        marker.setZIndexOffset(sel ? 1000 : 0)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  // ── Update marker visibility + visible list on filter change ──────────────
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then(L => {
      const map    = mapRef.current!
      const bounds = map.getBounds()

      markersRef.current.forEach((marker, id) => {
        const listing = withCoords.find(l => l.id === id)
        if (!listing) return
        const show = matchesFilters(listing, filters)
        if (show && !map.hasLayer(marker)) marker.addTo(map)
        else if (!show && map.hasLayer(marker)) map.removeLayer(marker)
      })

      const visible = withCoords.filter(l =>
        bounds.contains(L.latLng(l.lat!, l.lng!)) && matchesFilters(l, filters)
      )
      setVisibleListings(visible)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  // ── Show/hide area overlays ────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current
    areaLayersRef.current.forEach(layer => {
      if (showAreas && !map.hasLayer(layer)) layer.addTo(map)
      else if (!showAreas && map.hasLayer(layer)) map.removeLayer(layer)
    })
  }, [showAreas])

  // ── Pan to listing ─────────────────────────────────────────────────────────
  const panTo = (listing: MockListing) => {
    if (!mapRef.current || !listing.lat) return
    mapRef.current.flyTo([listing.lat, listing.lng!], Math.max(mapRef.current.getZoom(), 14), {
      animate: true, duration: 0.7,
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        /* Zoom control */
        .leaflet-control-zoom { border:none!important; border-radius:12px!important; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.15),0 0 0 1px rgba(0,0,0,0.06)!important; }
        .leaflet-control-zoom a { width:36px!important; height:36px!important; line-height:36px!important; font-size:18px!important; color:#374151!important; background:#fff!important; border-bottom:1px solid #f3f4f6!important; font-weight:300!important; }
        .leaflet-control-zoom a:hover { background:#f9fafb!important; color:#111827!important; }
        .leaflet-control-zoom-in  { border-radius:12px 12px 0 0!important; }
        .leaflet-control-zoom-out { border-radius:0 0 12px 12px!important; border-bottom:none!important; }
        /* Popup */
        .leaflet-popup-content-wrapper { border-radius:16px!important; box-shadow:0 8px 40px rgba(0,0,0,0.18)!important; padding:0!important; }
        .leaflet-popup-content { margin:0!important; }
        .leaflet-popup-tip-container { display:none; }
        .leaflet-control-attribution { font-size:10px!important; background:rgba(255,255,255,0.75)!important; backdrop-filter:blur(4px); border-radius:6px 0 0 0!important; padding:2px 6px!important; }
        .leaflet-control-attribution a { color:#9ca3af!important; }
      `}</style>

      <div className="flex overflow-hidden bg-white" style={{ height: 'calc(100svh - 65px)' }}>

        {/* ── Sidebar ────────────────────────────────────────────────────── */}
        <aside
          ref={sidebarRef}
          className="flex w-[360px] shrink-0 flex-col overflow-y-auto border-r border-gray-100"
        >
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur">
            <Link href="/listings" className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              목록
            </Link>
            <div className="ml-auto flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-sm text-gray-500">
                <strong className="font-bold text-gray-900">{visibleListings.length}</strong>건
              </span>
            </div>
          </div>

          {/* ── Filter panel ───────────────────────────────────────────── */}
          <div className="border-b border-gray-100 bg-gray-50/50">
            {/* Filter panel toggle */}
            <button
              onClick={() => setFiltersOpen(v => !v)}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100/70 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              필터
              {filterCount > 0 && (
                <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-bold text-white">
                  {filterCount}
                </span>
              )}
              <span className="ml-auto text-gray-400">
                {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </button>

            {filtersOpen && (
              <div className="space-y-4 px-4 pb-4">
                {/* 거래 유형 */}
                <FilterRow label="거래 유형">
                  {(['transfer', 'new', 'sale'] as ListingType[]).map(t => (
                    <ChipBtn
                      key={t}
                      active={filters.type === t}
                      color={TYPE_COLOR[t]}
                      onClick={() => setFilter('type', filters.type === t ? null : t)}
                    >
                      {TYPE_LABEL[t]}
                    </ChipBtn>
                  ))}
                </FilterRow>

                {/* 월세 범위 (sale 아닌 경우에만 의미 있음) */}
                <FilterRow label="월세 범위">
                  {RENT_PRESETS.map((p, i) => (
                    <ChipBtn
                      key={i}
                      active={filters.rentPreset === i}
                      onClick={() => setFilter('rentPreset', i)}
                    >
                      {p.label}
                    </ChipBtn>
                  ))}
                </FilterRow>

                {/* 면적 */}
                <FilterRow label="면적">
                  {AREA_PRESETS.map((p, i) => (
                    <ChipBtn
                      key={i}
                      active={filters.areaPreset === i}
                      onClick={() => setFilter('areaPreset', i)}
                    >
                      {p.label}
                    </ChipBtn>
                  ))}
                </FilterRow>

                {/* 업종 적합 */}
                <FilterRow label="업종 적합">
                  <ChipBtn active={filters.fitCategory === null} onClick={() => setFilter('fitCategory', null)}>전체</ChipBtn>
                  {availableCategories.map(([key, label]) => (
                    <ChipBtn
                      key={key}
                      active={filters.fitCategory === key}
                      onClick={() => setFilter('fitCategory', filters.fitCategory === key ? null : key)}
                    >
                      {label}
                    </ChipBtn>
                  ))}
                </FilterRow>

                {/* 토글 옵션 */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={e => setFilter('verifiedOnly', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                    />
                    인증 매물만
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={filters.noRightFee}
                      onChange={e => setFilter('noRightFee', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                    />
                    권리금 없음
                  </label>
                </div>

                {/* 상권 분석 레이어 토글 */}
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <BarChart2 className="h-4 w-4 text-gray-500" />
                    상권 분석 레이어
                  </div>
                  <button
                    onClick={() => setShowAreas(v => !v)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${showAreas ? 'bg-gray-900' : 'bg-gray-200'}`}
                    role="switch"
                    aria-checked={showAreas}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${showAreas ? 'translate-x-4' : 'translate-x-0'}`}
                    />
                  </button>
                </div>

                {showAreas && (
                  <div className="rounded-xl border border-gray-100 bg-white p-3">
                    <p className="mb-2 text-[11px] font-semibold text-gray-500">유동인구 기준 색상</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                      {[
                        { color: '#ef4444', label: '70,000명+' },
                        { color: '#f97316', label: '50,000명+' },
                        { color: '#eab308', label: '35,000명+' },
                        { color: '#22c55e', label: '35,000명↓' },
                      ].map(({ color, label }) => (
                        <span key={label} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 필터 초기화 */}
                {filterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900"
                  >
                    <X className="h-3.5 w-3.5" />
                    필터 초기화
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Listing results ─────────────────────────────────────────── */}
          <div className="flex-1">
            {!mapReady ? (
              <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                지도 로딩 중…
              </div>
            ) : visibleListings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-8 py-16 text-center">
                <MapPin className="h-10 w-10 text-gray-200" />
                <p className="text-sm font-semibold text-gray-500">이 지역에 매물이 없습니다</p>
                <p className="text-xs text-gray-400">지도를 이동하거나 필터를 조정해보세요.</p>
                {filterCount > 0 && (
                  <button onClick={resetFilters} className="mt-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                    필터 초기화
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {visibleListings.map(l => (
                  <SidebarCard
                    key={l.id}
                    listing={l}
                    selected={l.id === selectedId}
                    onClick={() => {
                      setSelectedId(prev => prev === l.id ? null : l.id)
                      panTo(l)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ── Map ─────────────────────────────────────────────────────────── */}
        <div className="relative flex-1">
          <div ref={mapDivRef} className="h-full w-full" />

          {mapMoved && (
            <div className="pointer-events-none absolute left-1/2 top-4 z-[500] -translate-x-1/2">
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-lg ring-1 ring-black/5">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-gray-400" />
                이 지역 검색 중…
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function ChipBtn({
  active, color, onClick, children,
}: {
  active: boolean
  color?: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-2.5 py-1 text-xs font-semibold transition-all"
      style={
        active
          ? { background: color ?? '#111827', color: '#fff', boxShadow: color ? `0 2px 8px ${color}66` : undefined }
          : { background: '#fff', color: '#374151', border: '1px solid #e5e7eb' }
      }
    >
      {children}
    </button>
  )
}

function SidebarCard({
  listing, selected, onClick,
}: {
  listing: MockListing
  selected: boolean
  onClick: () => void
}) {
  const color     = TYPE_COLOR[listing.type]
  const typeLabel = TYPE_LABEL[listing.type]

  return (
    <button
      data-id={listing.id}
      onClick={onClick}
      className={`w-full px-4 py-4 text-left transition-colors ${selected ? 'bg-gray-50 ring-inset ring-1 ring-gray-200' : 'hover:bg-gray-50/60'}`}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ background: `${color}18`, color }}>
          {typeLabel}
        </span>
        {listing.verified && (
          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-500">
            <CheckCircle className="h-3 w-3" />인증
          </span>
        )}
        {listing.featured && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">추천</span>
        )}
      </div>
      <p className="truncate text-sm font-bold leading-snug text-gray-900">{listing.title}</p>
      <p className="mt-0.5 text-xs text-gray-400">{listing.district} · {listing.area}평 {listing.floor}</p>
      <div className="mt-2.5 flex items-end justify-between">
        <div>
          {listing.type === 'sale' ? (
            <p className="text-sm font-bold text-gray-900">
              {formatNumber(listing.salePrice ?? 0)}만
              <span className="ml-1 text-[11px] font-normal text-gray-400">매각가</span>
            </p>
          ) : (
            <p className="text-sm font-bold text-gray-900">
              월 {formatNumber(listing.monthlyRent)}만
              <span className="ml-1 text-[11px] font-normal text-gray-400">/ 보증 {formatNumber(listing.deposit)}만</span>
            </p>
          )}
        </div>
        {(listing.rightFee ?? 0) > 0 && (
          <span className="text-[11px] text-gray-400">권리금 {formatNumber(listing.rightFee!)}만</span>
        )}
      </div>
      {selected && (
        <div className="mt-3">
          <Link
            href={`/listings/${listing.id}`}
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            상세 정보 보기 →
          </Link>
        </div>
      )}
    </button>
  )
}
