'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, MapPin, RefreshCw } from 'lucide-react'
import type { MockListing, ListingType } from '@/lib/mock-data'
import { TYPE_LABEL } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Map constants
// ─────────────────────────────────────────────────────────────────────────────
const KOREA_CENTER: [number, number] = [36.5, 127.8]
const DEFAULT_ZOOM = 7

// CartoDB Voyager — clean, professional, renders Korean labels beautifully.
// No API key required. Attribution required per CartoDB ToS.
const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

const TYPE_COLOR: Record<ListingType, string> = {
  transfer: '#ef4444',
  new:      '#2563eb',
  sale:     '#7c3aed',
}

// ─────────────────────────────────────────────────────────────────────────────
// Badge HTML factory — called for each marker, pure function so no closure issues
// ─────────────────────────────────────────────────────────────────────────────
function badgeHtml(listing: MockListing, selected: boolean): string {
  const label =
    listing.type === 'sale'
      ? `${formatNumber(listing.salePrice ?? 0)}만`
      : `월 ${formatNumber(listing.monthlyRent)}만`

  const color = TYPE_COLOR[listing.type]

  // Unselected: white pill, thin border, subtle shadow
  // Selected: solid fill (brand color), scaled up, strong shadow
  const style = selected
    ? [
        `background:${color}`,
        'color:#fff',
        `border:2px solid ${color}`,
        'box-shadow:0 6px 24px rgba(0,0,0,0.25),0 2px 8px rgba(0,0,0,0.15)',
        'transform:translate(-50%,-50%) scale(1.18)',
      ].join(';')
    : [
        'background:#fff',
        'color:#111827',
        'border:1.5px solid #e5e7eb',
        'box-shadow:0 2px 8px rgba(0,0,0,0.1),0 0 0 0.5px rgba(0,0,0,0.04)',
        'transform:translate(-50%,-50%)',
      ].join(';')

  return `<div style="
    ${style};
    display:inline-flex;
    align-items:center;
    padding:5px 11px;
    border-radius:100px;
    font-size:12.5px;
    font-weight:700;
    white-space:nowrap;
    cursor:pointer;
    transition:transform 0.15s ease,box-shadow 0.15s ease;
    font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;
    letter-spacing:-0.5px;
    pointer-events:auto;
    user-select:none;
  ">${label}</div>`
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  allListings: MockListing[]
}

export default function MapSearchClient({ allListings }: Props) {
  const mapDivRef   = useRef<HTMLDivElement>(null)
  const mapRef      = useRef<any>(null)
  const markersRef  = useRef<Map<string, any>>(new Map())
  const sidebarRef  = useRef<HTMLDivElement>(null)

  const [visibleListings, setVisibleListings] = useState<MockListing[]>([])
  const [selectedId,      setSelectedId]      = useState<string | null>(null)
  const [typeFilter,      setTypeFilter]       = useState<string | null>(null)
  const [mapMoved,        setMapMoved]         = useState(false)   // "재검색" hint
  const [mapReady,        setMapReady]         = useState(false)

  // Stable refs — event handlers inside useEffect read these to avoid stale closures
  const typeFilterRef = useRef<string | null>(null)
  const selectedIdRef = useRef<string | null>(null)
  const withCoords    = allListings.filter((l) => l.lat != null && l.lng != null)

  useEffect(() => { typeFilterRef.current = typeFilter  }, [typeFilter])
  useEffect(() => { selectedIdRef.current = selectedId  }, [selectedId])

  // ── Initialize Leaflet (runs once) ─────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return

    // Inject Leaflet CSS from CDN (avoids Next.js CSS-import SSR issues)
    const link = document.createElement('link')
    link.rel  = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    import('leaflet').then((L) => {
      const map = L.map(mapDivRef.current!, {
        center: KOREA_CENTER,
        zoom:   DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: true,
      })
      mapRef.current = map

      // Zoom — bottom right, styled via CSS below
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // CartoDB Voyager tiles
      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTR,
        maxZoom:    19,
        subdomains: 'abcd',
      }).addTo(map)

      // ── Add all markers ─────────────────────────────────────────────────
      withCoords.forEach((listing) => {
        const icon = L.divIcon({
          html:       badgeHtml(listing, false),
          className:  '',
          iconSize:   [0, 0] as any,
          iconAnchor: [0, 0] as any,
        })

        const marker = L.marker([listing.lat!, listing.lng!], {
          icon,
          zIndexOffset: 0,
        })

        marker.on('click', (e: any) => {
          L.DomEvent.stopPropagation(e)
          const prev = selectedIdRef.current
          const next = prev === listing.id ? null : listing.id
          setSelectedId(next)
          if (next && sidebarRef.current) {
            setTimeout(() => {
              sidebarRef.current
                ?.querySelector(`[data-id="${next}"]`)
                ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }, 50)
          }
        })

        marker.addTo(map)
        markersRef.current.set(listing.id, marker)
      })

      // Deselect on map background click
      map.on('click', () => setSelectedId(null))

      // ── Bounds filter ───────────────────────────────────────────────────
      const updateVisible = () => {
        const bounds = map.getBounds()
        const type   = typeFilterRef.current
        const visible = withCoords.filter((l) => {
          if (type && l.type !== type) return false
          return bounds.contains(L.latLng(l.lat!, l.lng!))
        })
        setVisibleListings(visible)
        setMapMoved(false)
      }

      map.on('moveend zoomend', () => {
        setMapMoved(true)
        updateVisible()
      })

      // Initial filter after tiles load
      map.once('load', updateVisible)
      setTimeout(updateVisible, 500)
      setMapReady(true)
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current.clear()
      if (document.head.contains(link)) document.head.removeChild(link)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Update marker styles on selection change ────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then((L) => {
      markersRef.current.forEach((marker, id) => {
        const listing = withCoords.find((l) => l.id === id)
        if (!listing) return
        const selected = id === selectedId
        marker.setIcon(
          L.divIcon({
            html:       badgeHtml(listing, selected),
            className:  '',
            iconSize:   [0, 0] as any,
            iconAnchor: [0, 0] as any,
          }),
        )
        marker.setZIndexOffset(selected ? 1000 : 0)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  // ── Re-filter when typeFilter changes ──────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then((L) => {
      const bounds = mapRef.current!.getBounds()
      const visible = withCoords.filter((l) => {
        if (typeFilter && l.type !== typeFilter) return false
        return bounds.contains(L.latLng(l.lat!, l.lng!))
      })
      setVisibleListings(visible)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter])

  // ── Pan to listing ──────────────────────────────────────────────────────────
  const panTo = (listing: MockListing) => {
    if (!mapRef.current || !listing.lat) return
    mapRef.current.flyTo([listing.lat, listing.lng!], Math.max(mapRef.current.getZoom(), 14), {
      animate:  true,
      duration: 0.7,
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Leaflet + custom UI overrides ── */}
      <style>{`
        /* Zoom control */
        .leaflet-control-zoom {
          border: none !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06) !important;
        }
        .leaflet-control-zoom a {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
          color: #374151 !important;
          background: #fff !important;
          border-bottom: 1px solid #f3f4f6 !important;
          font-weight: 300 !important;
        }
        .leaflet-control-zoom a:hover { background: #f9fafb !important; color: #111827 !important; }
        .leaflet-control-zoom-in  { border-radius: 12px 12px 0 0 !important; }
        .leaflet-control-zoom-out { border-radius: 0 0 12px 12px !important; border-bottom: none !important; }
        /* Attribution — minimal */
        .leaflet-control-attribution {
          font-size: 10px !important;
          background: rgba(255,255,255,0.7) !important;
          backdrop-filter: blur(4px);
          border-radius: 6px 0 0 0 !important;
          padding: 2px 6px !important;
        }
        .leaflet-control-attribution a { color: #9ca3af !important; }
        /* Popup */
        .leaflet-popup-content-wrapper {
          border-radius: 14px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
          padding: 0 !important;
        }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip-container { display: none; }
      `}</style>

      <div
        className="flex overflow-hidden bg-white"
        style={{ height: 'calc(100svh - 65px)' }}
      >
        {/* ── Sidebar ── */}
        <aside
          ref={sidebarRef}
          className="flex w-[360px] shrink-0 flex-col border-r border-gray-100"
        >
          {/* Sidebar header */}
          <div className="flex shrink-0 flex-col gap-3 border-b border-gray-100 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <Link
                href="/listings"
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                목록으로
              </Link>
              <div className="ml-auto flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  <strong className="font-bold text-gray-900">{visibleListings.length}</strong>건
                </span>
              </div>
            </div>

            {/* Type filter chips */}
            <div className="flex flex-wrap gap-1.5">
              {([null, 'transfer', 'new', 'sale'] as const).map((t) => {
                const active = typeFilter === t
                const color  = t ? TYPE_COLOR[t] : '#111827'
                return (
                  <button
                    key={t ?? 'all'}
                    onClick={() => setTypeFilter(t)}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                    style={
                      active
                        ? { background: color, color: '#fff', boxShadow: `0 2px 8px ${color}55` }
                        : { background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb' }
                    }
                  >
                    {t ? TYPE_LABEL[t] : '전체'}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Listing cards */}
          <div className="flex-1 overflow-y-auto">
            {!mapReady ? (
              <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                지도 로딩 중…
              </div>
            ) : visibleListings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-8 py-16 text-center">
                <MapPin className="h-10 w-10 text-gray-200" />
                <p className="text-sm font-medium text-gray-500">이 지역에 매물이 없습니다</p>
                <p className="text-xs text-gray-400">지도를 이동하거나 확대해보세요.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {visibleListings.map((l) => (
                  <SidebarCard
                    key={l.id}
                    listing={l}
                    selected={l.id === selectedId}
                    onClick={() => {
                      setSelectedId((prev) => (prev === l.id ? null : l.id))
                      panTo(l)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ── Map ── */}
        <div className="relative flex-1">
          <div ref={mapDivRef} className="h-full w-full" />

          {/* 재검색 hint — appears briefly after map moves */}
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
// Sidebar card
// ─────────────────────────────────────────────────────────────────────────────
function SidebarCard({
  listing,
  selected,
  onClick,
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
      className={`w-full px-4 py-4 text-left transition-colors ${
        selected
          ? 'bg-gray-50 ring-inset ring-1 ring-gray-200'
          : 'hover:bg-gray-50/60'
      }`}
    >
      {/* Type badge + verified */}
      <div className="mb-2 flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide"
          style={{ background: `${color}18`, color }}
        >
          {typeLabel}
        </span>
        {listing.verified && (
          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-500">
            <CheckCircle className="h-3 w-3" />
            인증 매물
          </span>
        )}
        {listing.featured && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
            추천
          </span>
        )}
      </div>

      {/* Title */}
      <p className="truncate text-sm font-bold leading-snug text-gray-900">
        {listing.title}
      </p>

      {/* Meta */}
      <p className="mt-0.5 text-xs text-gray-400">
        {listing.district} · {listing.area}평 {listing.floor}
      </p>

      {/* Price */}
      <div className="mt-2.5 flex items-end justify-between">
        <div>
          {listing.type === 'sale' ? (
            <p className="text-base font-bold text-gray-900">
              {formatNumber(listing.salePrice ?? 0)}만
              <span className="ml-1 text-xs font-normal text-gray-400">매각가</span>
            </p>
          ) : (
            <p className="text-base font-bold text-gray-900">
              월 {formatNumber(listing.monthlyRent)}만
              <span className="ml-1 text-xs font-normal text-gray-400">
                / 보증 {formatNumber(listing.deposit)}만
              </span>
            </p>
          )}
        </div>
        <span className="text-xs text-gray-400">{listing.area}평</span>
      </div>

      {/* Detail link (shown when selected) */}
      {selected && (
        <div className="mt-3">
          <Link
            href={`/listings/${listing.id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
          >
            상세 정보 보기 →
          </Link>
        </div>
      )}
    </button>
  )
}
