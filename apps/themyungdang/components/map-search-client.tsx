'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BarChart2,
  CheckCircle,
  ChevronDown,
  Heart,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import type { MockListing, MockArea, ListingType } from '@/lib/mock-data'
import { TYPE_LABEL, AREAS, LISTING_CATEGORIES } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Price formatting
// ─────────────────────────────────────────────────────────────────────────────
function formatManwon(manwon: number): string {
  if (manwon >= 10000) {
    const eok = manwon / 10000
    return eok % 1 === 0 ? `${eok}억` : `${Math.round(eok * 10) / 10}억`
  }
  return `${formatNumber(manwon)}만`
}

// ─────────────────────────────────────────────────────────────────────────────
// Map config
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
// Filter presets
// ─────────────────────────────────────────────────────────────────────────────
const RENT_PRESETS = [
  { label: '전체',     min: 0,   max: Infinity },
  { label: '~50만',   min: 0,   max: 50 },
  { label: '~100만',  min: 0,   max: 100 },
  { label: '~200만',  min: 0,   max: 200 },
  { label: '~300만',  min: 0,   max: 300 },
  { label: '300만+',  min: 300, max: Infinity },
]

const AREA_PRESETS = [
  { label: '전체',     min: 0,  max: Infinity },
  { label: '~10평',   min: 0,  max: 10 },
  { label: '10~20평', min: 10, max: 20 },
  { label: '20~30평', min: 20, max: 30 },
  { label: '30평+',   min: 30, max: Infinity },
]

interface Filters {
  type:          string | null
  rentPreset:    number
  areaPreset:    number
  fitCategory:   string | null
  verifiedOnly:  boolean
  noRightFee:    boolean
  favoritesOnly: boolean
}

const DEFAULT_FILTERS: Filters = {
  type: null, rentPreset: 0, areaPreset: 0,
  fitCategory: null, verifiedOnly: false, noRightFee: false, favoritesOnly: false,
}

function matchesFilters(l: MockListing, f: Filters, favs?: Set<string>): boolean {
  if (f.favoritesOnly && favs && !favs.has(l.id)) return false
  if (f.type && l.type !== f.type) return false
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
  return (
    (f.type         ? 1 : 0) +
    (f.rentPreset   ? 1 : 0) +
    (f.areaPreset   ? 1 : 0) +
    (f.fitCategory  ? 1 : 0) +
    (f.verifiedOnly ? 1 : 0) +
    (f.noRightFee   ? 1 : 0) +
    (f.favoritesOnly ? 1 : 0)
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// URL sync helpers  (no useSearchParams → no Suspense boundary needed)
// ─────────────────────────────────────────────────────────────────────────────
function filtersToQS(f: Filters): string {
  const p = new URLSearchParams()
  if (f.type)          p.set('type', f.type)
  if (f.rentPreset)    p.set('rent', String(f.rentPreset))
  if (f.areaPreset)    p.set('area', String(f.areaPreset))
  if (f.fitCategory)   p.set('cat',  f.fitCategory)
  if (f.verifiedOnly)  p.set('v',    '1')
  if (f.noRightFee)    p.set('nr',   '1')
  if (f.favoritesOnly) p.set('fav',  '1')
  return p.toString()
}

function qsToFilters(): Filters {
  if (typeof window === 'undefined') return DEFAULT_FILTERS
  const p = new URLSearchParams(window.location.search)
  return {
    type:          p.get('type'),
    rentPreset:    Math.min(5, Math.max(0, Number(p.get('rent') || 0))),
    areaPreset:    Math.min(4, Math.max(0, Number(p.get('area') || 0))),
    fitCategory:   p.get('cat'),
    verifiedOnly:  p.get('v')   === '1',
    noRightFee:    p.get('nr')  === '1',
    favoritesOnly: p.get('fav') === '1',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sort
// ─────────────────────────────────────────────────────────────────────────────
type SortKey = 'recommended' | 'newest' | 'rent-asc' | 'rent-desc' | 'area-desc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recommended', label: '추천순' },
  { key: 'newest',      label: '최신순' },
  { key: 'rent-asc',    label: '월세 낮은순' },
  { key: 'rent-desc',   label: '월세 높은순' },
  { key: 'area-desc',   label: '면적 큰순' },
]

function sortListings(listings: MockListing[], sort: SortKey): MockListing[] {
  return [...listings].sort((a, b) => {
    switch (sort) {
      case 'newest':    return b.createdAt.localeCompare(a.createdAt)
      case 'rent-asc':  return a.monthlyRent - b.monthlyRent
      case 'rent-desc': return b.monthlyRent - a.monthlyRent
      case 'area-desc': return b.area - a.area
      default:          return b.viewCount - a.viewCount
    }
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Favorites (localStorage)
// ─────────────────────────────────────────────────────────────────────────────
const FAV_KEY = 'tmyd-fav'

function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const raw = localStorage.getItem(FAV_KEY)
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
    } catch { return new Set() }
  })

  const toggle = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      try { localStorage.setItem(FAV_KEY, JSON.stringify([...next])) } catch {}
      return next
    })
  }, [])

  return { favorites, toggle }
}

// ─────────────────────────────────────────────────────────────────────────────
// Area overlay helpers
// ─────────────────────────────────────────────────────────────────────────────
function areaCircleColor(footTraffic: number): string {
  if (footTraffic > 70000) return '#ef4444'
  if (footTraffic > 50000) return '#f97316'
  if (footTraffic > 35000) return '#eab308'
  return '#22c55e'
}

function areaPopupHtml(area: MockArea): string {
  const color    = areaCircleColor(area.footTraffic)
  const catChips = area.topCategories
    .map(c => `<span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:100px;background:${color}18;color:${color};font-size:11px;font-weight:600;margin:2px">${c.label} ${c.share}%</span>`)
    .join('')
  const hl = area.highlights.map(h => `<li style="margin-bottom:3px">${h}</li>`).join('')
  const ca = area.cautions.map(c   => `<li style="margin-bottom:3px">${c}</li>`).join('')

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;min-width:260px;max-width:300px;padding:16px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
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
        <ul style="margin:0;padding-left:14px;color:#374151;font-size:12px;line-height:1.6">${hl}</ul>
      </div>
      <div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:#dc2626;margin-bottom:4px">⚠ 주의</div>
        <ul style="margin:0;padding-left:14px;color:#374151;font-size:12px;line-height:1.6">${ca}</ul>
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
      ? `${formatManwon(listing.salePrice ?? 0)} 매각`
      : listing.monthlyRent > 0
        ? `월 ${formatNumber(listing.monthlyRent)}만`
        : `보증 ${formatManwon(listing.deposit)}`
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
  const mapDivRef     = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<any>(null)
  const markersRef    = useRef<Map<string, any>>(new Map())
  const areaLayersRef = useRef<Map<string, any>>(new Map())
  const sidebarRef    = useRef<HTMLDivElement>(null)
  // Stable refs for Leaflet event handlers (avoids stale closures)
  const filtersRef    = useRef<Filters>(DEFAULT_FILTERS)
  const selectedIdRef = useRef<string | null>(null)
  const favoritesRef  = useRef<Set<string>>(new Set())

  const [visibleListings, setVisibleListings] = useState<MockListing[]>([])
  const [selectedId,      setSelectedId]      = useState<string | null>(null)
  const [filters,         setFilters]         = useState<Filters>(() => qsToFilters())
  const [showAreas,       setShowAreas]       = useState(false)
  const [filtersOpen,     setFiltersOpen]     = useState(false)
  const [sort,            setSort]            = useState<SortKey>('recommended')
  const [mapMoved,        setMapMoved]        = useState(false)
  const [mapReady,        setMapReady]        = useState(false)

  const { favorites, toggle: toggleFavorite } = useFavorites()

  // Keep refs in sync with state
  useEffect(() => { filtersRef.current    = filters   }, [filters])
  useEffect(() => { selectedIdRef.current = selectedId }, [selectedId])
  useEffect(() => { favoritesRef.current  = favorites  }, [favorites])

  // Sync filters → URL (no page reload)
  useEffect(() => {
    const qs = filtersToQS(filters)
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
  }, [filters])

  const withCoords = useMemo(
    () => allListings.filter(l => l.lat != null && l.lng != null),
    [allListings],
  )

  const availableCategories = useMemo(() => {
    const cats = new Map<string, string>()
    withCoords.forEach(l => l.fitCategories.forEach(k => {
      const found = LISTING_CATEGORIES.find(c => c.key === k)
      if (found) cats.set(k, found.label)
    }))
    return [...cats.entries()].sort((a, b) => a[1].localeCompare(b[1]))
  }, [withCoords])

  const filterCount    = activeFilterCount(filters)
  const displayListings = useMemo(() => sortListings(visibleListings, sort), [visibleListings, sort])

  const setFilter = <K extends keyof Filters>(key: K, val: Filters[K]) =>
    setFilters(prev => ({ ...prev, [key]: val }))
  const resetFilters = () => setFilters(DEFAULT_FILTERS)

  // ── Initialize Leaflet map (runs once) ─────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return
    let cancelled = false

    const link = document.createElement('link')
    link.rel  = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    import('leaflet').then(L => {
      if (cancelled || mapRef.current) return

      const map = L.map(mapDivRef.current!, {
        center: KOREA_CENTER, zoom: DEFAULT_ZOOM, zoomControl: false,
      })
      mapRef.current = map
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map)

      // ── Listing markers ───────────────────────────────────────────────────
      withCoords.forEach(listing => {
        const icon = L.divIcon({
          html: badgeHtml(listing, false), className: '',
          iconSize: [0, 0] as any, iconAnchor: [0, 0] as any,
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

      // ── Area circles (hidden initially) ───────────────────────────────────
      AREAS.filter(a => a.lat != null).forEach(area => {
        const color  = areaCircleColor(area.footTraffic)
        const circle = L.circle([area.lat!, area.lng!], {
          radius: area.radiusM ?? 500, fillColor: color, fillOpacity: 0.12,
          color, weight: 2, opacity: 0.7, dashArray: '6 4', interactive: true,
        })
        const labelIcon = L.divIcon({
          html: `<div style="background:${color};color:#fff;padding:3px 8px;border-radius:100px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);transform:translate(-50%,-50%);font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif;">${area.name}</div>`,
          className: '', iconSize: [0, 0] as any, iconAnchor: [0, 0] as any,
        })
        const labelMarker = L.marker([area.lat!, area.lng!], {
          icon: labelIcon, zIndexOffset: -100, interactive: false,
        })
        circle.bindPopup(L.popup({ maxWidth: 320 }).setContent(areaPopupHtml(area)))
        areaLayersRef.current.set(`${area.key}-circle`, circle)
        areaLayersRef.current.set(`${area.key}-label`,  labelMarker)
      })

      map.on('click', () => setSelectedId(null))

      const updateVisible = () => {
        const bounds  = map.getBounds()
        const f       = filtersRef.current
        const favs    = favoritesRef.current
        const visible = withCoords.filter(l =>
          bounds.contains(L.latLng(l.lat!, l.lng!)) && matchesFilters(l, f, favs)
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
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current.clear()
      areaLayersRef.current.clear()
      if (document.head.contains(link)) document.head.removeChild(link)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Selection → update marker icon ────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then(L => {
      markersRef.current.forEach((marker, id) => {
        const listing = withCoords.find(l => l.id === id)
        if (!listing) return
        marker.setIcon(L.divIcon({
          html: badgeHtml(listing, id === selectedId),
          className: '', iconSize: [0, 0] as any, iconAnchor: [0, 0] as any,
        }))
        marker.setZIndexOffset(id === selectedId ? 1000 : 0)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  // ── Filters / favorites → update marker visibility + visible list ──────────
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then(L => {
      const map    = mapRef.current!
      const bounds = map.getBounds()
      markersRef.current.forEach((marker, id) => {
        const listing = withCoords.find(l => l.id === id)
        if (!listing) return
        const show = matchesFilters(listing, filters, favorites)
        if (show  && !map.hasLayer(marker)) marker.addTo(map)
        if (!show &&  map.hasLayer(marker)) map.removeLayer(marker)
      })
      const visible = withCoords.filter(l =>
        bounds.contains(L.latLng(l.lat!, l.lng!)) && matchesFilters(l, filters, favorites)
      )
      setVisibleListings(visible)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, favorites])

  // ── Area overlay show/hide ─────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current
    areaLayersRef.current.forEach(layer => {
      if (showAreas  && !map.hasLayer(layer)) layer.addTo(map)
      if (!showAreas &&  map.hasLayer(layer)) map.removeLayer(layer)
    })
  }, [showAreas])

  // ── Pan map to listing ─────────────────────────────────────────────────────
  const panTo = (listing: MockListing) => {
    if (!mapRef.current || !listing.lat) return
    mapRef.current.flyTo(
      [listing.lat, listing.lng!],
      Math.max(mapRef.current.getZoom(), 14),
      { animate: true, duration: 0.7 },
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .leaflet-control-zoom { border:none!important; border-radius:12px!important; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.15),0 0 0 1px rgba(0,0,0,0.06)!important; }
        .leaflet-control-zoom a { width:36px!important; height:36px!important; line-height:36px!important; font-size:18px!important; color:#374151!important; background:#fff!important; border-bottom:1px solid #f3f4f6!important; font-weight:300!important; }
        .leaflet-control-zoom a:hover { background:#f9fafb!important; color:#111827!important; }
        .leaflet-control-zoom-in  { border-radius:12px 12px 0 0!important; }
        .leaflet-control-zoom-out { border-radius:0 0 12px 12px!important; border-bottom:none!important; }
        .leaflet-popup-content-wrapper { border-radius:16px!important; box-shadow:0 8px 40px rgba(0,0,0,0.18)!important; padding:0!important; }
        .leaflet-popup-content { margin:0!important; }
        .leaflet-popup-tip-container { display:none; }
        .leaflet-control-attribution { font-size:10px!important; background:rgba(255,255,255,0.75)!important; backdrop-filter:blur(4px); border-radius:6px 0 0 0!important; padding:2px 6px!important; }
        .leaflet-control-attribution a { color:#9ca3af!important; }
      `}</style>

      <div className="flex overflow-hidden bg-white" style={{ height: 'calc(100svh - 65px)' }}>

        {/* ════════════════════════════════════════════════════════════════════
            LEFT — Listing panel
        ════════════════════════════════════════════════════════════════════ */}
        <aside
          ref={sidebarRef}
          className="flex w-[320px] shrink-0 flex-col border-r border-gray-100 bg-white"
        >
          {/* ── Sticky header ──────────────────────────────────────────────── */}
          <div className="sticky top-0 z-10 shrink-0 border-b border-gray-100 bg-white/95 backdrop-blur">
            <div className="flex items-center gap-2 px-4 py-3">
              <Link
                href="/listings"
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                목록
              </Link>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  <strong className="font-bold text-gray-900">{displayListings.length}</strong>건
                </span>
                {/* Sort select */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value as SortKey)}
                    className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-2.5 pr-6 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {filterCount > 0 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2.5">
                {filters.type && (
                  <ActiveChip onRemove={() => setFilter('type', null)}>
                    {TYPE_LABEL[filters.type as ListingType]}
                  </ActiveChip>
                )}
                {filters.rentPreset > 0 && (
                  <ActiveChip onRemove={() => setFilter('rentPreset', 0)}>
                    {RENT_PRESETS[filters.rentPreset]?.label}
                  </ActiveChip>
                )}
                {filters.areaPreset > 0 && (
                  <ActiveChip onRemove={() => setFilter('areaPreset', 0)}>
                    {AREA_PRESETS[filters.areaPreset]?.label}
                  </ActiveChip>
                )}
                {filters.fitCategory && (
                  <ActiveChip onRemove={() => setFilter('fitCategory', null)}>
                    {LISTING_CATEGORIES.find(c => c.key === filters.fitCategory)?.label ?? filters.fitCategory}
                  </ActiveChip>
                )}
                {filters.verifiedOnly  && <ActiveChip onRemove={() => setFilter('verifiedOnly', false)}>인증만</ActiveChip>}
                {filters.noRightFee    && <ActiveChip onRemove={() => setFilter('noRightFee', false)}>권리금 없음</ActiveChip>}
                {filters.favoritesOnly && <ActiveChip onRemove={() => setFilter('favoritesOnly', false)}>찜한 매물</ActiveChip>}
                <button
                  onClick={resetFilters}
                  className="rounded-full px-2.5 py-1 text-[11px] font-medium text-gray-400 hover:text-gray-700"
                >
                  전체 초기화
                </button>
              </div>
            )}

            {/* Favorites quick-filter */}
            <div className="flex items-center gap-2 border-t border-gray-50 px-4 py-2">
              <button
                onClick={() => setFilter('favoritesOnly', !filters.favoritesOnly)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  filters.favoritesOnly
                    ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Heart
                  className={`h-3.5 w-3.5 transition-all ${
                    filters.favoritesOnly ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
                찜한 매물
                {favorites.size > 0 && (
                  <span className={`text-[10px] ${filters.favoritesOnly ? 'text-rose-500' : 'text-gray-400'}`}>
                    {favorites.size}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ── Listing cards ──────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">
            {!mapReady ? (
              <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                지도 로딩 중…
              </div>
            ) : displayListings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-8 py-16 text-center">
                {filters.favoritesOnly
                  ? <Heart className="h-10 w-10 text-gray-200" />
                  : <MapPin className="h-10 w-10 text-gray-200" />
                }
                <p className="text-sm font-semibold text-gray-500">
                  {filters.favoritesOnly ? '찜한 매물이 없습니다' : '이 지역에 매물이 없습니다'}
                </p>
                <p className="text-xs text-gray-400">
                  {filters.favoritesOnly
                    ? '매물 카드의 ♥ 를 눌러 찜해보세요.'
                    : '지도를 이동하거나 필터를 조정해보세요.'}
                </p>
                {filterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="mt-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    필터 초기화
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {displayListings.map(l => (
                  <SidebarCard
                    key={l.id}
                    listing={l}
                    selected={l.id === selectedId}
                    isFavorite={favorites.has(l.id)}
                    onToggleFavorite={() => toggleFavorite(l.id)}
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

        {/* ════════════════════════════════════════════════════════════════════
            RIGHT — Map + floating controls + filter panel overlay
        ════════════════════════════════════════════════════════════════════ */}
        <div className="relative flex-1 overflow-hidden">
          {/* Leaflet map */}
          <div ref={mapDivRef} className="h-full w-full" />

          {/* ── Floating top-right controls ──────────────────────────────── */}
          <div className="absolute right-4 top-4 z-[500] flex items-center gap-2">
            {/* 상권 분석 toggle */}
            <button
              onClick={() => setShowAreas(v => !v)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold shadow-lg ring-1 transition-all ${
                showAreas
                  ? 'bg-gray-900 text-white ring-gray-900'
                  : 'bg-white text-gray-700 ring-black/10 hover:bg-gray-50'
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              상권 분석
              {showAreas && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold leading-none">
                  ON
                </span>
              )}
            </button>

            {/* Filter panel toggle */}
            <button
              onClick={() => setFiltersOpen(v => !v)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold shadow-lg ring-1 transition-all ${
                filtersOpen
                  ? 'bg-gray-900 text-white ring-gray-900'
                  : 'bg-white text-gray-700 ring-black/10 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              필터
              {filterCount > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                    filtersOpen ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
                  }`}
                >
                  {filterCount}
                </span>
              )}
            </button>
          </div>

          {/* ── "지역 업데이트 중" pill ───────────────────────────────────── */}
          {mapMoved && !filtersOpen && (
            <div className="pointer-events-none absolute left-1/2 top-4 z-[500] -translate-x-1/2">
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-lg ring-1 ring-black/5">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-gray-400" />
                이 지역 검색 중…
              </div>
            </div>
          )}

          {/* ── 상권 분석 color legend (bottom-right) ────────────────────── */}
          {showAreas && (
            <div className="absolute bottom-8 right-4 z-[500] rounded-xl bg-white/90 px-3 py-2.5 shadow-lg ring-1 ring-black/5 backdrop-blur">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">유동인구 기준</p>
              <div className="space-y-1.5">
                {[
                  { color: '#ef4444', label: '70,000명+' },
                  { color: '#f97316', label: '50,000명+' },
                  { color: '#eab308', label: '35,000명+' },
                  { color: '#22c55e', label: '35,000명↓' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              Filter panel — slides in from the right over the map
          ════════════════════════════════════════════════════════════════ */}
          {filtersOpen && (
            <>
              {/* Invisible backdrop — click to close */}
              <div
                className="absolute inset-0 z-[800]"
                onClick={() => setFiltersOpen(false)}
              />

              {/* Panel */}
              <div className="absolute right-0 top-0 z-[900] flex h-full w-[288px] flex-col bg-white shadow-2xl">
                {/* Panel header */}
                <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <SlidersHorizontal className="h-4 w-4" />
                    필터
                    {filterCount > 0 && (
                      <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[10px] text-white">
                        {filterCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {filterCount > 0 && (
                      <button
                        onClick={resetFilters}
                        className="text-xs text-gray-400 hover:text-gray-900"
                      >
                        초기화
                      </button>
                    )}
                    <button
                      onClick={() => setFiltersOpen(false)}
                      className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Panel body */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-5 p-4">

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

                    {/* 월세 범위 */}
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
                      <ChipBtn
                        active={!filters.fitCategory}
                        onClick={() => setFilter('fitCategory', null)}
                      >
                        전체
                      </ChipBtn>
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
                    <div className="space-y-0 divide-y divide-gray-50 overflow-hidden rounded-xl border border-gray-100 bg-white">
                      <label className="flex cursor-pointer items-center justify-between px-3 py-3 hover:bg-gray-50">
                        <span className="text-sm text-gray-700">인증 매물만</span>
                        <input
                          type="checkbox"
                          checked={filters.verifiedOnly}
                          onChange={e => setFilter('verifiedOnly', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                        />
                      </label>
                      <label className="flex cursor-pointer items-center justify-between px-3 py-3 hover:bg-gray-50">
                        <span className="text-sm text-gray-700">권리금 없음</span>
                        <input
                          type="checkbox"
                          checked={filters.noRightFee}
                          onChange={e => setFilter('noRightFee', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                        />
                      </label>
                    </div>

                    {/* 상권 분석 레이어 */}
                    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <BarChart2 className="h-4 w-4 text-gray-400" />
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

                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function ActiveChip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-0.5 rounded-full bg-gray-900 py-1 pl-2.5 pr-1.5 text-[11px] font-semibold text-white">
      {children}
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 hover:bg-white/20"
        aria-label="필터 제거"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  )
}

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
  active: boolean; color?: string; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-2.5 py-1 text-xs font-semibold transition-all"
      style={
        active
          ? { background: color ?? '#111827', color: '#fff', boxShadow: color ? `0 2px 8px ${color}55` : undefined }
          : { background: '#fff', color: '#374151', border: '1px solid #e5e7eb' }
      }
    >
      {children}
    </button>
  )
}

function SidebarCard({
  listing, selected, isFavorite, onToggleFavorite, onClick,
}: {
  listing: MockListing
  selected: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
  onClick: () => void
}) {
  const color     = TYPE_COLOR[listing.type]
  const typeLabel = TYPE_LABEL[listing.type]

  return (
    <button
      data-id={listing.id}
      onClick={onClick}
      className={`relative w-full px-4 py-4 text-left transition-colors ${
        selected ? 'bg-gray-50 ring-inset ring-1 ring-gray-200' : 'hover:bg-gray-50/60'
      }`}
    >
      {/* Heart / favorite button */}
      <button
        onClick={e => { e.stopPropagation(); onToggleFavorite() }}
        className={`absolute right-3 top-4 rounded-full p-1.5 transition-colors ${
          isFavorite
            ? 'text-rose-500 hover:bg-rose-50'
            : 'text-gray-300 hover:bg-rose-50 hover:text-rose-400'
        }`}
        aria-label={isFavorite ? '찜 해제' : '찜하기'}
      >
        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
      </button>

      <div className="mb-1.5 flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
          style={{ background: `${color}18`, color }}
        >
          {typeLabel}
        </span>
        {listing.verified && (
          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-500">
            <CheckCircle className="h-3 w-3" />인증
          </span>
        )}
        {listing.featured && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
            추천
          </span>
        )}
      </div>

      <p className="truncate pr-8 text-sm font-bold leading-snug text-gray-900">{listing.title}</p>
      <p className="mt-0.5 text-xs text-gray-400">
        {listing.district} · {listing.area}평 {listing.floor}
      </p>

      <div className="mt-2.5 flex items-end justify-between">
        <div>
          {listing.type === 'sale' ? (
            <p className="text-sm font-bold text-gray-900">
              {formatManwon(listing.salePrice ?? 0)}
              <span className="ml-1 text-[11px] font-normal text-gray-400">매각가</span>
            </p>
          ) : (
            <p className="text-sm font-bold text-gray-900">
              월 {formatNumber(listing.monthlyRent)}만
              <span className="ml-1 text-[11px] font-normal text-gray-400">
                / 보증 {formatNumber(listing.deposit)}만
              </span>
            </p>
          )}
        </div>
        {(listing.rightFee ?? 0) > 0 && (
          <span className="text-[11px] text-gray-400">
            권리금 {formatNumber(listing.rightFee!)}만
          </span>
        )}
      </div>

      {selected && (
        <div className="mt-3">
          <Link
            href={`/listings/${listing.id}`}
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
          >
            상세 정보 보기 →
          </Link>
        </div>
      )}
    </button>
  )
}
