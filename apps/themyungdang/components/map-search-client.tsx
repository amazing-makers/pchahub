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
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import type { MockListing, MockArea, ListingType } from '@/lib/mock-data'
import { TYPE_LABEL, AREAS, LISTING_CATEGORIES } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'
import { useFavorites } from '@/hooks/use-favorites'

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

const DEPOSIT_PRESETS = [
  { label: '전체',      min: 0,    max: Infinity },
  { label: '~500만',   min: 0,    max: 500 },
  { label: '~1,000만', min: 0,    max: 1000 },
  { label: '~3,000만', min: 0,    max: 3000 },
  { label: '3,000만+', min: 3000, max: Infinity },
]

// index 1 = "없음" means rightFee === 0; min/max applied to actual fee
const RIGHT_FEE_PRESETS = [
  { label: '전체',      min: -1,   max: Infinity }, // -1 = no lower bound applied
  { label: '없음',      min: -1,   max: 0 },
  { label: '~1,000만', min: 1,    max: 1000 },
  { label: '~3,000만', min: 1,    max: 3000 },
  { label: '3,000만+', min: 3000, max: Infinity },
]

// match values: null=all, '1'=1층, '2+'=2층 이상, 'B'=지하
const FLOOR_PRESETS = [
  { label: '전체', match: null  },
  { label: '1층',  match: '1'   },
  { label: '2층+', match: '2+'  },
  { label: '지하', match: 'B'   },
]

const FOOT_TRAFFIC_PRESETS = [
  { label: '전체',    min: 0 },
  { label: '1만명+',  min: 10000 },
  { label: '3만명+',  min: 30000 },
  { label: '5만명+',  min: 50000 },
  { label: '10만명+', min: 100000 },
]

const LOCATION_TAGS = ['역세권', '코너', '대로변', '신축', '주차 가능', '주거지 인근', '오피스 상권']

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전']

const REGION_CENTERS: Record<string, [number, number]> = {
  '서울': [37.5665, 126.9780],
  '경기': [37.4138, 127.5183],
  '인천': [37.4563, 126.7052],
  '부산': [35.1796, 129.0756],
  '대구': [35.8714, 128.6014],
  '광주': [35.1595, 126.8526],
  '대전': [36.3504, 127.3845],
}
const REGION_ZOOM = 11

// ─────────────────────────────────────────────────────────────────────────────
// Area-overlay filter presets  (상권 분석 패널용)
// ─────────────────────────────────────────────────────────────────────────────
const AREA_FT_TIERS = [
  { label: '전체',   desc: '',         min: 0,     max: Infinity },
  { label: '소형',   desc: '~4만명',   min: 0,     max: 40000 },
  { label: '중형',   desc: '4~6만명',  min: 40000, max: 60000 },
  { label: '대형',   desc: '6~8만명',  min: 60000, max: 80000 },
  { label: '최고급', desc: '8만명+',   min: 80000, max: Infinity },
]

const AREA_RENT_TIERS = [
  { label: '전체',  min: 0,  max: Infinity },
  { label: '~10만', min: 0,  max: 10 },
  { label: '~15만', min: 0,  max: 15 },
  { label: '~20만', min: 0,  max: 20 },
  { label: '20만+', min: 20, max: Infinity },
]

const AREA_RF_TIERS = [
  { label: '전체',      min: 0,    max: Infinity },
  { label: '~3,000만', min: 0,    max: 3000 },
  { label: '~5,000만', min: 0,    max: 5000 },
  { label: '5,000만+', min: 5000, max: Infinity },
]

const AREA_CATS = [
  { key: 'cafe',     label: '카페'   },
  { key: 'korean',   label: '한식'   },
  { key: 'bar',      label: '주점'   },
  { key: 'snack',    label: '분식'   },
  { key: 'dessert',  label: '디저트' },
  { key: 'beverage', label: '음료'   },
  { key: 'chicken',  label: '치킨'   },
  { key: 'japanese', label: '일식'   },
]

interface AreaOverlayFilters {
  region:          string | null
  ftTier:          number   // index into AREA_FT_TIERS
  rentTier:        number   // index into AREA_RENT_TIERS
  rfTier:          number   // index into AREA_RF_TIERS
  category:        string | null
  colorBy:         ColorBy  // how circles are coloured
  sortBy:          SortBy   // how the ranked list inside the panel is sorted
}
const DEFAULT_AREA_FILTERS: AreaOverlayFilters = {
  region: null, ftTier: 0, rentTier: 0, rfTier: 0, category: null,
  colorBy: 'footTraffic', sortBy: 'footTraffic',
}

function matchesAreaOverlay(area: MockArea, f: AreaOverlayFilters): boolean {
  if (f.region && area.region !== f.region) return false
  const ft = AREA_FT_TIERS[f.ftTier]
  if (ft && area.footTraffic < ft.min) return false
  if (ft && ft.max !== Infinity && area.footTraffic > ft.max) return false
  const rt = AREA_RENT_TIERS[f.rentTier]
  if (rt && area.avgMonthlyRentPerPyeong > rt.max) return false
  if (rt && area.avgMonthlyRentPerPyeong < rt.min) return false
  const rf = AREA_RF_TIERS[f.rfTier]
  if (rf && area.avgRightFee > rf.max) return false
  if (rf && area.avgRightFee < rf.min) return false
  if (f.category && !area.topCategories.some(c => c.key === f.category)) return false
  return true
}

function activeAreaFilterCount(f: AreaOverlayFilters): number {
  return (
    (f.region   ? 1 : 0) +
    (f.ftTier   ? 1 : 0) +
    (f.category ? 1 : 0)
    // 평당 월세 / 권리금은 결과 표시용 — 필터 카운트에서 제외
  )
}

interface Filters {
  type:              string | null
  rentPreset:        number
  depositPreset:     number
  rightFeePreset:    number   // index into RIGHT_FEE_PRESETS
  areaPreset:        number
  floorPreset:       number   // index into FLOOR_PRESETS
  fitCategory:       string | null
  footTrafficPreset: number
  region:            string | null
  commercialArea:    string | null  // AREAS[n].key
  tag:               string | null
  verifiedOnly:      boolean
  noRightFee:        boolean  // kept for URL compat (rightFeePreset=1 supersedes)
  favoritesOnly:     boolean
}

const DEFAULT_FILTERS: Filters = {
  type: null, rentPreset: 0, depositPreset: 0, rightFeePreset: 0,
  areaPreset: 0, floorPreset: 0, fitCategory: null, footTrafficPreset: 0,
  region: null, commercialArea: null, tag: null,
  verifiedOnly: false, noRightFee: false, favoritesOnly: false,
}

function floorMatchesPreset(floor: string, match: string | null): boolean {
  if (!match) return true
  if (match === '1')  return /^1층/.test(floor) || floor === '1층'
  if (match === 'B')  return floor.includes('지하')
  if (match === '2+') {
    if (floor.includes('지하')) return false
    const n = parseInt(floor)
    // handles '2층', '3층', '2개층', '1-3층' (range starting point ≥2), etc.
    if (!isNaN(n) && n >= 2) return true
    // '1-3층' → split on '-', take last number
    const parts = floor.match(/\d+/g)
    if (parts && parts.length > 1 && Number(parts[parts.length - 1]) >= 2) return true
    return false
  }
  return true
}

function matchesFilters(l: MockListing, f: Filters, favs?: Set<string>): boolean {
  if (f.favoritesOnly && favs && !favs.has(l.id)) return false
  if (f.type && l.type !== f.type) return false
  if (f.region && l.region !== f.region) return false
  if (f.commercialArea && l.areaKey !== f.commercialArea) return false
  // Monthly rent (only for non-sale)
  if (l.type !== 'sale') {
    const rp = RENT_PRESETS[f.rentPreset]
    if (rp && l.monthlyRent > rp.max) return false
    if (rp && l.monthlyRent < rp.min) return false
  }
  // Deposit
  const dp = DEPOSIT_PRESETS[f.depositPreset]
  if (dp) {
    if (l.deposit > dp.max) return false
    if (l.deposit < dp.min) return false
  }
  // Right fee
  const rfp = RIGHT_FEE_PRESETS[f.rightFeePreset]
  if (rfp) {
    const rf = l.rightFee ?? 0
    if (rfp.max !== Infinity && rf > rfp.max) return false
    if (rfp.min > 0 && rf < rfp.min) return false
    if (rfp.max === 0 && rf > 0) return false  // "없음" means strictly 0
  }
  // Area (평)
  const ap = AREA_PRESETS[f.areaPreset]
  if (ap && l.area > ap.max) return false
  if (ap && l.area < ap.min) return false
  // Floor
  if (f.floorPreset > 0) {
    if (!floorMatchesPreset(l.floor, FLOOR_PRESETS[f.floorPreset]?.match ?? null)) return false
  }
  // Foot traffic (listing-level)
  const ftp = FOOT_TRAFFIC_PRESETS[f.footTrafficPreset]
  if (ftp && l.footTraffic < ftp.min) return false
  // Category & location tag
  if (f.fitCategory && !l.fitCategories.includes(f.fitCategory)) return false
  if (f.tag && !l.tags.includes(f.tag)) return false
  if (f.verifiedOnly && !l.verified) return false
  if (f.noRightFee && (l.rightFee ?? 0) > 0) return false
  return true
}

function activeFilterCount(f: Filters): number {
  return (
    (f.type              ? 1 : 0) +
    (f.rentPreset        ? 1 : 0) +
    (f.depositPreset     ? 1 : 0) +
    (f.rightFeePreset    ? 1 : 0) +
    (f.areaPreset        ? 1 : 0) +
    (f.floorPreset       ? 1 : 0) +
    (f.fitCategory       ? 1 : 0) +
    (f.footTrafficPreset ? 1 : 0) +
    (f.region            ? 1 : 0) +
    (f.commercialArea    ? 1 : 0) +
    (f.tag               ? 1 : 0) +
    (f.verifiedOnly      ? 1 : 0) +
    (f.noRightFee        ? 1 : 0) +
    (f.favoritesOnly     ? 1 : 0)
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// URL sync helpers  (no useSearchParams → no Suspense boundary needed)
// ─────────────────────────────────────────────────────────────────────────────
function filtersToQS(f: Filters): string {
  const p = new URLSearchParams()
  if (f.type)              p.set('type', f.type)
  if (f.rentPreset)        p.set('rent', String(f.rentPreset))
  if (f.depositPreset)     p.set('dep',  String(f.depositPreset))
  if (f.rightFeePreset)    p.set('rf',   String(f.rightFeePreset))
  if (f.areaPreset)        p.set('area', String(f.areaPreset))
  if (f.floorPreset)       p.set('fl',   String(f.floorPreset))
  if (f.fitCategory)       p.set('cat',  f.fitCategory)
  if (f.footTrafficPreset) p.set('ft',   String(f.footTrafficPreset))
  if (f.region)            p.set('rgn',  f.region)
  if (f.commercialArea)    p.set('ca',   f.commercialArea)
  if (f.tag)               p.set('tag',  f.tag)
  if (f.verifiedOnly)      p.set('v',    '1')
  if (f.noRightFee)        p.set('nr',   '1')
  if (f.favoritesOnly)     p.set('fav',  '1')
  return p.toString()
}

/** Read initial map view (lat/lng/zoom) from URL — used when linking from area detail pages */
function getInitialView(): { center: [number, number]; zoom: number } | null {
  if (typeof window === 'undefined') return null
  const p = new URLSearchParams(window.location.search)
  const lat  = parseFloat(p.get('lat')  ?? '')
  const lng  = parseFloat(p.get('lng')  ?? '')
  const zoom = parseInt  (p.get('zoom') ?? '')
  if (!isNaN(lat) && !isNaN(lng)) {
    return { center: [lat, lng], zoom: isNaN(zoom) ? 14 : zoom }
  }
  return null
}

function qsToFilters(): Filters {
  if (typeof window === 'undefined') return DEFAULT_FILTERS
  const p = new URLSearchParams(window.location.search)
  return {
    type:              p.get('type'),
    rentPreset:        Math.min(5, Math.max(0, Number(p.get('rent') || 0))),
    depositPreset:     Math.min(4, Math.max(0, Number(p.get('dep')  || 0))),
    rightFeePreset:    Math.min(4, Math.max(0, Number(p.get('rf')   || 0))),
    areaPreset:        Math.min(4, Math.max(0, Number(p.get('area') || 0))),
    floorPreset:       Math.min(3, Math.max(0, Number(p.get('fl')   || 0))),
    fitCategory:       p.get('cat') ?? p.get('fitCategory'),
    footTrafficPreset: Math.min(4, Math.max(0, Number(p.get('ft')   || 0))),
    region:            p.get('rgn'),
    commercialArea:    p.get('ca'),
    tag:               p.get('tag'),
    verifiedOnly:      p.get('v')   === '1',
    noRightFee:        p.get('nr')  === '1',
    favoritesOnly:     p.get('fav') === '1',
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
// Area overlay helpers
// ─────────────────────────────────────────────────────────────────────────────
type ColorBy = 'footTraffic' | 'rent' | 'rightFee'
type SortBy  = 'footTraffic' | 'rent' | 'rightFee' | 'name'

function areaCircleColor(area: MockArea, colorBy: ColorBy = 'footTraffic'): string {
  if (colorBy === 'rent') {
    if (area.avgMonthlyRentPerPyeong >= 20) return '#ef4444'
    if (area.avgMonthlyRentPerPyeong >= 15) return '#f97316'
    if (area.avgMonthlyRentPerPyeong >= 10) return '#eab308'
    return '#22c55e'
  }
  if (colorBy === 'rightFee') {
    if (area.avgRightFee >= 5000) return '#ef4444'
    if (area.avgRightFee >= 3000) return '#f97316'
    if (area.avgRightFee >= 1000) return '#eab308'
    return '#22c55e'
  }
  // footTraffic (default)
  if (area.footTraffic > 70000) return '#ef4444'
  if (area.footTraffic > 50000) return '#f97316'
  if (area.footTraffic > 35000) return '#eab308'
  return '#22c55e'
}

const COLOR_BY_OPTIONS: { key: ColorBy; label: string; legends: { color: string; label: string }[] }[] = [
  {
    key: 'footTraffic', label: '유동인구',
    legends: [
      { color: '#ef4444', label: '70,000명+' },
      { color: '#f97316', label: '50,000명+' },
      { color: '#eab308', label: '35,000명+' },
      { color: '#22c55e', label: '35,000명↓' },
    ],
  },
  {
    key: 'rent', label: '평당 월세',
    legends: [
      { color: '#ef4444', label: '20만원+' },
      { color: '#f97316', label: '15만원+' },
      { color: '#eab308', label: '10만원+' },
      { color: '#22c55e', label: '10만원↓' },
    ],
  },
  {
    key: 'rightFee', label: '권리금',
    legends: [
      { color: '#ef4444', label: '5,000만+' },
      { color: '#f97316', label: '3,000만+' },
      { color: '#eab308', label: '1,000만+' },
      { color: '#22c55e', label: '없음/저비용' },
    ],
  },
]

const AREA_SORT_OPTIONS: { key: SortBy; label: string }[] = [
  { key: 'footTraffic', label: '유동인구 높은순' },
  { key: 'rent',        label: '월세 낮은순' },
  { key: 'rightFee',    label: '권리금 낮은순' },
  { key: 'name',        label: '이름순' },
]

/** 원 표시 반경 프리셋 (null = 데이터 기본값 사용) */
const CIRCLE_RADIUS_OPTS: { label: string; value: number | null }[] = [
  { label: '기본값', value: null  },
  { label: '300m',   value: 300   },
  { label: '500m',   value: 500   },
  { label: '1km',    value: 1000  },
  { label: '2km',    value: 2000  },
]

/** 반경 분석 프리셋 */
const ANALYZE_RADIUS_OPTS: { label: string; value: number }[] = [
  { label: '500m', value: 500  },
  { label: '1km',  value: 1000 },
  { label: '2km',  value: 2000 },
  { label: '3km',  value: 3000 },
  { label: '5km',  value: 5000 },
]

/** Haversine distance in metres */
function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R    = 6_371_000
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function areaPopupHtml(area: MockArea): string {
  const color    = areaCircleColor(area, 'footTraffic')
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
// Cluster icon HTML
// ─────────────────────────────────────────────────────────────────────────────
function clusterIconHtml(count: number): string {
  // Size and colour scale based on cluster count
  const size  = count >= 50 ? 52 : count >= 20 ? 46 : count >= 10 ? 42 : 38
  const fs    = count >= 50 ? 11 : count >= 10 ? 12 : 13
  // 소 (<10): cool blue-gray  |  중 (10-19): amber  |  대 (20-49): orange  |  최대 (50+): red
  const bg    =
    count >= 50 ? '#ef4444' :
    count >= 20 ? '#f97316' :
    count >= 10 ? '#f59e0b' :
    '#3b82f6'
  const ring  =
    count >= 50 ? 'rgba(239,68,68,0.25)' :
    count >= 20 ? 'rgba(249,115,22,0.25)' :
    count >= 10 ? 'rgba(245,158,11,0.25)' :
    'rgba(59,130,246,0.25)'
  return `<div style="
    width:${size}px;height:${size}px;
    background:${bg};color:#fff;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:${fs}px;font-weight:800;letter-spacing:-0.5px;
    box-shadow:0 0 0 4px ${ring},0 2px 14px rgba(0,0,0,0.22);
    transform:translate(-50%,-50%);
    border:2.5px solid #fff;cursor:pointer;
    font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif;
  ">${count}</div>`
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
  const mapDivRef        = useRef<HTMLDivElement>(null)
  const mapRef           = useRef<any>(null)
  const clusterGroupRef  = useRef<any>(null)
  const markersRef       = useRef<Map<string, any>>(new Map())
  const areaLayersRef    = useRef<Map<string, any>>(new Map())
  const analyzeLayerRef  = useRef<any>(null)  // the dashed analysis-radius circle
  const sidebarRef       = useRef<HTMLDivElement>(null)
  // Stable refs for Leaflet event handlers (avoids stale closures)
  const filtersRef    = useRef<Filters>(DEFAULT_FILTERS)
  const selectedIdRef = useRef<string | null>(null)
  const favoritesRef  = useRef<Set<string>>(new Set())

  // ── Address / area search state ──────────────────────────────────────────
  const [addrQuery,    setAddrQuery]    = useState('')   // listing filter address search
  const [addrOpen,     setAddrOpen]     = useState(false)
  const [areaQuery,    setAreaQuery]    = useState('')   // area panel search

  const [visibleListings,     setVisibleListings]     = useState<MockListing[]>([])
  const [selectedId,          setSelectedId]          = useState<string | null>(null)
  const [filters,             setFilters]             = useState<Filters>(() => qsToFilters())
  const [showAreas,           setShowAreas]           = useState(false)
  const [areaFilters,         setAreaFilters]         = useState<AreaOverlayFilters>(DEFAULT_AREA_FILTERS)
  const [areaFiltersOpen,     setAreaFiltersOpen]     = useState(false)
  const [filtersOpen,         setFiltersOpen]         = useState(false)
  const [sort,                setSort]                = useState<SortKey>('recommended')
  const [mapMoved,            setMapMoved]            = useState(false)
  const [mapReady,            setMapReady]            = useState(false)
  // ── 반경 관련 상태 ─────────────────────────────────────────────────────────
  const [circleRadiusOverride, setCircleRadiusOverride] = useState<number | null>(null) // metres; null = default
  const [analyzeRadius,        setAnalyzeRadius]        = useState(2000)                 // metres
  const [analyzeCenter,        setAnalyzeCenter]        = useState<{lat: number; lng: number} | null>(null)
  const [analyzeMode,          setAnalyzeMode]          = useState<'idle' | 'picking'>('idle')
  const [sheetOpen,            setSheetOpen]            = useState(false)

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

  /** Currently-selected listing object (for map mini-card) */
  const selectedListing = useMemo(
    () => selectedId ? (withCoords.find(l => l.id === selectedId) ?? null) : null,
    [selectedId, withCoords],
  )

  /** Address autocomplete: searches AREAS (name / district) + city-level REGIONS */
  type AddrSuggestion =
    | { kind: 'area';   key: string; name: string; sub: string; lat: number; lng: number }
    | { kind: 'region'; key: string; name: string; sub: string; lat: number; lng: number }

  const addrSuggestions = useMemo((): AddrSuggestion[] => {
    const q = addrQuery.trim().toLowerCase()
    if (!q) return []
    const out: AddrSuggestion[] = []
    // city-level
    REGIONS.forEach(r => {
      if (r.includes(q)) {
        const [lat, lng] = REGION_CENTERS[r] ?? [0, 0]
        out.push({ kind: 'region', key: `region:${r}`, name: r, sub: '시/도 전체', lat, lng })
      }
    })
    // commercial areas
    AREAS.filter(a => a.lat != null).forEach(a => {
      if (
        a.name.toLowerCase().includes(q) ||
        a.district.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q)
      ) {
        out.push({ kind: 'area', key: a.key, name: a.name, sub: `${a.region} ${a.district}`, lat: a.lat!, lng: a.lng! })
      }
    })
    return out.slice(0, 8)
  }, [addrQuery])

  const setFilter = <K extends keyof Filters>(key: K, val: Filters[K]) =>
    setFilters(prev => ({ ...prev, [key]: val }))
  const resetFilters = () => setFilters(DEFAULT_FILTERS)

  // ── Initialize Leaflet map (runs once) ─────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return
    let cancelled = false

    // Ensure container is clean (React Strict Mode double-mount guard)
    const container = mapDivRef.current
    if ((container as any)._leaflet_id) {
      // A previous (cancelled) init already ran — fully reset the container
      ;(container as any)._leaflet_id = undefined
      ;(container as any)._leaflet    = undefined
      container.innerHTML = ''
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id   = 'leaflet-css'
      link.rel  = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    import('leaflet').then(async L => {
      if (cancelled || mapRef.current) return

      // ── Extend L with markerClusterGroup ─────────────────────────────────
      // leaflet.markercluster is a UMD plugin that patches window.L.
      // We must expose our L as window.L BEFORE importing the plugin so the
      // UMD wrapper finds and patches the correct Leaflet instance.
      ;(window as any).L = L
      await import('leaflet.markercluster')
      // After the import, markerClusterGroup lives on window.L (= L).

      const initView = getInitialView()
      const map = L.map(container, {
        center: initView?.center ?? KOREA_CENTER,
        zoom:   initView?.zoom   ?? DEFAULT_ZOOM,
        zoomControl: false,
      })
      mapRef.current = map
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map)

      // ── Marker cluster group ──────────────────────────────────────────────
      const mcGroup = (window as any).L?.markerClusterGroup ?? (L as any).markerClusterGroup
      const cluster = mcGroup({
        maxClusterRadius:        80,
        disableClusteringAtZoom: 15,
        spiderfyOnMaxZoom:       true,
        zoomToBoundsOnClick:     true,
        iconCreateFunction: (c: any) => L.divIcon({
          html:       clusterIconHtml(c.getChildCount()),
          className:  '',
          iconSize:   [0, 0] as any,
          iconAnchor: [0, 0] as any,
        }),
      })
      clusterGroupRef.current = cluster

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
        markersRef.current.set(listing.id, marker)
        // Only add to cluster if it passes current filters (e.g. URL-loaded)
        if (matchesFilters(listing, filtersRef.current, favoritesRef.current)) {
          cluster.addLayer(marker)
        }
      })

      cluster.addTo(map)

      // ── Area circles (hidden initially) ───────────────────────────────────
      AREAS.filter(a => a.lat != null).forEach(area => {
        const color  = areaCircleColor(area, 'footTraffic')
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
      if (mapRef.current) {
        mapRef.current.remove()         // removes all layers + cleans container
        mapRef.current = null
      }
      // Belt-and-suspenders: also wipe the Leaflet DOM metadata so a
      // re-mount (React Strict Mode) can re-initialise the same container.
      if (container) {
        ;(container as any)._leaflet_id = undefined
        ;(container as any)._leaflet    = undefined
      }
      clusterGroupRef.current = null
      markersRef.current.clear()
      areaLayersRef.current.clear()
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

  // ── Filters / favorites → update cluster layers + visible list ──────────────
  useEffect(() => {
    if (!mapRef.current || !clusterGroupRef.current) return
    import('leaflet').then(L => {
      const bounds  = mapRef.current!.getBounds()
      const cluster = clusterGroupRef.current!
      const visible: MockListing[] = []

      // Swap all cluster layers in one shot (clearLayers + add) to avoid flash
      cluster.clearLayers()
      withCoords.forEach(listing => {
        if (matchesFilters(listing, filters, favorites)) {
          cluster.addLayer(markersRef.current.get(listing.id)!)
          if (bounds.contains(L.latLng(listing.lat!, listing.lng!))) {
            visible.push(listing)
          }
        }
      })
      setVisibleListings(visible)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, favorites])

  // ── Area overlay show/hide + per-area filter + analyzeCenter ─────────────
  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current
    areaLayersRef.current.forEach((layer, key) => {
      // keys are "{areaKey}-circle" or "{areaKey}-label"
      const areaKey = key.replace(/-circle$|-label$/, '')
      const area    = AREAS.find(a => a.key === areaKey)
      let visible   = showAreas && (!area || matchesAreaOverlay(area, areaFilters))
      // also filter by analyzeCenter if a centre is picked
      if (visible && analyzeCenter && area?.lat != null) {
        const dist = haversineM(area.lat!, area.lng!, analyzeCenter.lat, analyzeCenter.lng)
        if (dist > analyzeRadius) visible = false
      }
      if (visible  && !map.hasLayer(layer)) layer.addTo(map)
      if (!visible &&  map.hasLayer(layer)) map.removeLayer(layer)
    })
  }, [showAreas, areaFilters, analyzeCenter, analyzeRadius])

  // ── colorBy → recolour all circles + labels ───────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then(L => {
      AREAS.filter(a => a.lat != null).forEach(area => {
        const newColor = areaCircleColor(area, areaFilters.colorBy)
        const circle   = areaLayersRef.current.get(`${area.key}-circle`) as any
        const label    = areaLayersRef.current.get(`${area.key}-label`)  as any
        if (circle) circle.setStyle({ color: newColor, fillColor: newColor })
        if (label)  label.setIcon(L.divIcon({
          html: `<div style="background:${newColor};color:#fff;padding:3px 8px;border-radius:100px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);transform:translate(-50%,-50%);font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif;">${area.name}</div>`,
          className: '', iconSize: [0, 0] as any, iconAnchor: [0, 0] as any,
        }))
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaFilters.colorBy])

  // ── Circle radius override ─────────────────────────────────────────────────
  useEffect(() => {
    AREAS.filter(a => a.lat != null).forEach(area => {
      const circle = areaLayersRef.current.get(`${area.key}-circle`) as any
      if (circle) circle.setRadius(circleRadiusOverride ?? (area.radiusM ?? 500))
    })
  }, [circleRadiusOverride])

  // ── Draw / update the analysis-radius circle on the map ───────────────────
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then(L => {
      // Remove old layer
      if (analyzeLayerRef.current) {
        if (mapRef.current!.hasLayer(analyzeLayerRef.current))
          mapRef.current!.removeLayer(analyzeLayerRef.current)
        analyzeLayerRef.current = null
      }
      if (!analyzeCenter) return
      analyzeLayerRef.current = L.circle(
        [analyzeCenter.lat, analyzeCenter.lng],
        {
          radius: analyzeRadius,
          color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.06,
          weight: 2.5, dashArray: '8 5', interactive: false,
        },
      ).addTo(mapRef.current!)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyzeCenter, analyzeRadius])

  // ── Map cursor + one-shot click → pick analyzeCenter ─────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current
    if (analyzeMode !== 'picking') {
      map.getContainer().style.cursor = ''
      return
    }
    map.getContainer().style.cursor = 'crosshair'
    const handler = (e: any) => {
      setAnalyzeCenter({ lat: e.latlng.lat, lng: e.latlng.lng })
      setShowAreas(true)  // 중심점이 찍히면 상권 원도 자동 표시
      setAnalyzeMode('idle')
    }
    map.once('click', handler)
    return () => { map.off('click', handler); map.getContainer().style.cursor = '' }
  }, [analyzeMode])

  // ── Region selected → fly to region center ─────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !filters.region) return
    const center = REGION_CENTERS[filters.region]
    if (center) mapRef.current.flyTo(center, REGION_ZOOM, { animate: true, duration: 0.8 })
  }, [filters.region])

  // ── Commercial area selected → fly to area + auto-show overlay ─────────────
  useEffect(() => {
    if (!mapRef.current || !filters.commercialArea) return
    const area = AREAS.find(a => a.key === filters.commercialArea)
    if (area?.lat && area?.lng) {
      mapRef.current.flyTo([area.lat, area.lng], 15, { animate: true, duration: 0.8 })
      if (!showAreas) setShowAreas(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.commercialArea])

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
          className="hidden lg:flex w-[320px] shrink-0 flex-col border-r border-gray-100 bg-white"
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
                {filters.region && (
                  <ActiveChip onRemove={() => setFilter('region', null)}>{filters.region}</ActiveChip>
                )}
                {filters.commercialArea && (
                  <ActiveChip onRemove={() => setFilter('commercialArea', null)}>
                    {AREAS.find(a => a.key === filters.commercialArea)?.name ?? filters.commercialArea}
                  </ActiveChip>
                )}
                {filters.type && (
                  <ActiveChip onRemove={() => setFilter('type', null)}>
                    {TYPE_LABEL[filters.type as ListingType]}
                  </ActiveChip>
                )}
                {filters.footTrafficPreset > 0 && (
                  <ActiveChip onRemove={() => setFilter('footTrafficPreset', 0)}>
                    유동 {FOOT_TRAFFIC_PRESETS[filters.footTrafficPreset]?.label}
                  </ActiveChip>
                )}
                {filters.rentPreset > 0 && (
                  <ActiveChip onRemove={() => setFilter('rentPreset', 0)}>
                    월세 {RENT_PRESETS[filters.rentPreset]?.label}
                  </ActiveChip>
                )}
                {filters.depositPreset > 0 && (
                  <ActiveChip onRemove={() => setFilter('depositPreset', 0)}>
                    보증 {DEPOSIT_PRESETS[filters.depositPreset]?.label}
                  </ActiveChip>
                )}
                {filters.rightFeePreset > 0 && (
                  <ActiveChip onRemove={() => setFilter('rightFeePreset', 0)}>
                    권리금 {RIGHT_FEE_PRESETS[filters.rightFeePreset]?.label}
                  </ActiveChip>
                )}
                {filters.areaPreset > 0 && (
                  <ActiveChip onRemove={() => setFilter('areaPreset', 0)}>
                    {AREA_PRESETS[filters.areaPreset]?.label}
                  </ActiveChip>
                )}
                {filters.floorPreset > 0 && (
                  <ActiveChip onRemove={() => setFilter('floorPreset', 0)}>
                    {FLOOR_PRESETS[filters.floorPreset]?.label}
                  </ActiveChip>
                )}
                {filters.fitCategory && (
                  <ActiveChip onRemove={() => setFilter('fitCategory', null)}>
                    {LISTING_CATEGORIES.find(c => c.key === filters.fitCategory)?.label ?? filters.fitCategory}
                  </ActiveChip>
                )}
                {filters.tag && (
                  <ActiveChip onRemove={() => setFilter('tag', null)}>{filters.tag}</ActiveChip>
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
            {/* 상권 분석 — opens area-overlay filter panel */}
            <button
              onClick={() => {
                const opening = !areaFiltersOpen
                setAreaFiltersOpen(opening)
                if (opening) setFiltersOpen(false)
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold shadow-lg ring-1 transition-all ${
                areaFiltersOpen
                  ? 'bg-gray-900 text-white ring-gray-900'
                  : showAreas
                    ? 'bg-indigo-600 text-white ring-indigo-600'
                    : 'bg-white text-gray-700 ring-black/10 hover:bg-gray-50'
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              상권 분석
              {showAreas && !areaFiltersOpen && activeAreaFilterCount(areaFilters) === 0 && (
                <span className="rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-bold leading-none">
                  ON
                </span>
              )}
              {activeAreaFilterCount(areaFilters) > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                    areaFiltersOpen ? 'bg-white text-gray-900' : 'bg-white text-indigo-600'
                  }`}
                >
                  {activeAreaFilterCount(areaFilters)}
                </span>
              )}
            </button>

            {/* Filter panel toggle */}
            <button
              onClick={() => {
                const opening = !filtersOpen
                setFiltersOpen(opening)
                if (opening) setAreaFiltersOpen(false)
              }}
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

          {/* ── 반경 분석 결과 카드 (지도 좌하단 플로팅) ─────────────────── */}
          {analyzeCenter && (() => {
            const radius = analyzeRadius >= 1000
              ? `${analyzeRadius / 1000}km`
              : `${analyzeRadius}m`
            const inRange = AREAS.filter(a =>
              a.lat != null &&
              haversineM(a.lat!, a.lng!, analyzeCenter.lat, analyzeCenter.lng) <= analyzeRadius
            )
            // aggregate stats
            const count  = inRange.length
            const avgFT  = count
              ? Math.round(inRange.reduce((s, a) => s + a.footTraffic, 0) / count)
              : 0
            const avgRent = count
              ? Math.round(inRange.reduce((s, a) => s + a.avgMonthlyRentPerPyeong, 0) / count * 10) / 10
              : 0
            const avgRF  = count
              ? Math.round(inRange.reduce((s, a) => s + a.avgRightFee, 0) / count)
              : 0
            // most common category
            const catMap = new Map<string, number>()
            inRange.forEach(a => a.topCategories.forEach(c => catMap.set(c.key, (catMap.get(c.key) ?? 0) + 1)))
            const topCatKey = [...catMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
            const topCatLabel = topCatKey ? (AREA_CATS.find(c => c.key === topCatKey)?.label ?? topCatKey) : '-'
            // sorted by foot traffic (top 3)
            const topAreas = [...inRange].sort((a, b) => b.footTraffic - a.footTraffic).slice(0, 3)

            return (
              <div className="absolute bottom-8 left-4 z-[500] w-[220px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                {/* 헤더 */}
                <div className="flex items-center justify-between bg-indigo-600 px-3.5 py-2.5">
                  <div>
                    <p className="text-xs font-black text-white">반경 {radius} 상권 분석</p>
                    <p className="text-[10px] text-indigo-200">
                      {count > 0 ? `${count}개 상권 포함` : '해당 반경에 상권 없음'}
                    </p>
                  </div>
                  <button
                    onClick={() => { setAnalyzeCenter(null); setAnalyzeMode('idle') }}
                    className="rounded-full p-1 text-indigo-300 hover:bg-indigo-500 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {count === 0 ? (
                  <p className="px-4 py-5 text-center text-xs text-gray-400">
                    반경을 늘리거나 다른 위치를 선택해보세요
                  </p>
                ) : (
                  <>
                    {/* 지표 그리드 */}
                    <div className="grid grid-cols-2 gap-px bg-gray-100">
                      {[
                        { label: '평균 유동인구', value: `${formatNumber(avgFT)}명` },
                        { label: '주요 업종',     value: topCatLabel },
                        { label: '평당 월세',     value: `${avgRent}만원` },
                        { label: '평균 권리금',   value: `${formatNumber(avgRF)}만` },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-white px-3 py-2.5">
                          <p className="text-[10px] text-gray-400">{label}</p>
                          <p className="mt-0.5 text-xs font-bold text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* 상위 상권 목록 */}
                    <div className="border-t border-gray-100 px-3.5 py-2.5">
                      <p className="mb-1.5 text-[10px] font-semibold text-gray-400">유동인구 상위 상권</p>
                      <div className="space-y-1.5">
                        {topAreas.map((a, i) => {
                          const dist = haversineM(a.lat!, a.lng!, analyzeCenter.lat, analyzeCenter.lng)
                          const distLabel = dist >= 1000
                            ? `${(dist / 1000).toFixed(1)}km`
                            : `${Math.round(dist)}m`
                          return (
                            <div key={a.key} className="flex items-center gap-2">
                              <span
                                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white"
                                style={{ background: areaCircleColor(a, areaFilters.colorBy) }}
                              >
                                {i + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[11px] font-bold text-gray-800">{a.name}</p>
                              </div>
                              <span className="shrink-0 text-[10px] text-indigo-400">{distLabel}</span>
                            </div>
                          )
                        })}
                        {inRange.length > 3 && (
                          <p className="text-[10px] text-gray-400">외 {inRange.length - 3}개 상권</p>
                        )}
                      </div>
                    </div>

                    {/* 상권 레이어 퀵 토글 */}
                    {!showAreas && (
                      <button
                        onClick={() => setShowAreas(true)}
                        className="flex w-full items-center justify-center gap-1.5 border-t border-gray-100 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                      >
                        <BarChart2 className="h-3.5 w-3.5" />
                        지도에 상권 원 표시하기
                      </button>
                    )}
                  </>
                )}
              </div>
            )
          })()}

          {/* ── "지역 업데이트 중" pill ───────────────────────────────────── */}
          {mapMoved && !filtersOpen && (
            <div className="pointer-events-none absolute left-1/2 top-4 z-[500] -translate-x-1/2">
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-lg ring-1 ring-black/5">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-gray-400" />
                이 지역 검색 중…
              </div>
            </div>
          )}

          {/* ── 상권 분석 color legend (bottom-right, dynamic) ──────────── */}
          {showAreas && (() => {
            const scheme = COLOR_BY_OPTIONS.find(o => o.key === areaFilters.colorBy) ?? COLOR_BY_OPTIONS[0]!
            return (
              <div className="absolute bottom-8 right-4 z-[500] rounded-xl bg-white/90 px-3 py-2.5 shadow-lg ring-1 ring-black/5 backdrop-blur">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">{scheme.label} 기준</p>
                <div className="space-y-1.5">
                  {scheme.legends.map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* ── 매물 선택 미니 카드 (지도 하단 중앙 플로팅) ────────────── */}
          {selectedListing && (
            <div className="pointer-events-none absolute bottom-12 left-0 right-0 z-[499] flex justify-center px-4">
              <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/8">
                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  {selectedListing.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedListing.images[0]}
                      alt=""
                      className="h-16 w-20 shrink-0 rounded-xl object-cover"
                    />
                  )}
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-bold text-gray-900">{selectedListing.title}</p>
                      <button
                        onClick={() => setSelectedId(null)}
                        className="shrink-0 rounded-full p-0.5 text-gray-400 hover:bg-gray-100"
                        aria-label="닫기"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
                      <MapPin className="h-2.5 w-2.5 shrink-0" />
                      {selectedListing.region} {selectedListing.district} · {selectedListing.area}평
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      {selectedListing.type === 'sale' ? (
                        <span className="text-sm font-black text-gray-900">{formatManwon(selectedListing.salePrice ?? 0)}</span>
                      ) : (
                        <>
                          {selectedListing.rightFee !== undefined && selectedListing.rightFee > 0 && (
                            <span className="text-[11px] text-gray-500">권리금 <strong className="text-gray-900">{formatManwon(selectedListing.rightFee)}</strong></span>
                          )}
                          {selectedListing.rightFee === 0 && (
                            <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">권리금 없음</span>
                          )}
                          <span className="text-[11px] text-gray-500">월세 <strong className="text-gray-900">{formatNumber(selectedListing.monthlyRent)}만</strong></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <a
                  href={`/listings/${selectedListing.id}`}
                  className="flex items-center justify-center gap-1 border-t border-gray-100 py-2.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-50"
                >
                  상세 보기 →
                </a>
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
              <div className="absolute right-0 top-0 z-[900] flex h-full w-[300px] flex-col bg-white shadow-2xl">
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

                    {/* ── 지역 ──────────────────────────────────────────── */}
                    <FilterRow label="지역">
                      <ChipBtn active={!filters.region} onClick={() => setFilter('region', null)}>전체</ChipBtn>
                      {REGIONS.map(r => (
                        <ChipBtn
                          key={r}
                          active={filters.region === r}
                          onClick={() => setFilter('region', filters.region === r ? null : r)}
                        >
                          {r}
                        </ChipBtn>
                      ))}
                    </FilterRow>

                    {/* ── 주소 / 상권 검색 ──────────────────────────────── */}
                    <div className="relative">
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">주소 검색</p>

                      {/* 현재 선택된 상권 칩 */}
                      {filters.commercialArea && (() => {
                        const a = AREAS.find(x => x.key === filters.commercialArea)
                        return a ? (
                          <div className="mb-2 flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-2.5 py-2">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-bold text-indigo-700">{a.name}</p>
                              <p className="text-[10px] text-indigo-400">{a.region} {a.district}</p>
                            </div>
                            <button
                              onClick={() => setFilter('commercialArea', null)}
                              className="shrink-0 rounded-full p-0.5 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : null
                      })()}

                      {/* 검색 입력 */}
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={addrQuery}
                          placeholder="동·구·상권명 입력…"
                          onChange={e => { setAddrQuery(e.target.value); setAddrOpen(true) }}
                          onFocus={() => setAddrOpen(true)}
                          onBlur={() => setTimeout(() => setAddrOpen(false), 160)}
                          className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-300 focus:border-gray-400 focus:outline-none"
                        />
                        {addrQuery && (
                          <button
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => { setAddrQuery(''); setAddrOpen(false) }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-700"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* 자동완성 드롭다운 */}
                      {addrOpen && addrQuery.trim() && (
                        <div className="absolute left-0 right-0 top-full z-[1000] mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                          {addrSuggestions.length === 0 ? (
                            <p className="px-3 py-3 text-center text-xs text-gray-400">검색 결과 없음</p>
                          ) : addrSuggestions.map(s => (
                            <button
                              key={s.key}
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => {
                                if (s.kind === 'area') {
                                  setFilter('commercialArea', s.key)
                                } else {
                                  setFilter('region', s.name)
                                  setFilter('commercialArea', null)
                                }
                                mapRef.current?.flyTo(
                                  [s.lat, s.lng],
                                  s.kind === 'region' ? REGION_ZOOM : 15,
                                  { animate: true, duration: 0.8 },
                                )
                                setAddrQuery('')
                                setAddrOpen(false)
                              }}
                              className="flex w-full items-center gap-2 border-b border-gray-50 px-3 py-2.5 text-left last:border-0 hover:bg-gray-50"
                            >
                              {s.kind === 'region'
                                ? <MapPin className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                                : <span className="h-2 w-2 shrink-0 rounded-full bg-gray-400" />
                              }
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-bold text-gray-900">{s.name}</p>
                                <p className="text-[10px] text-gray-400">{s.sub}</p>
                              </div>
                              {s.kind === 'area' && (
                                <span className="shrink-0 rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-semibold text-gray-500">상권</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ── 거래 유형 ───────────────────────────────────────── */}
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

                    {/* ── 월세 범위 ───────────────────────────────────────── */}
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

                    {/* ── 보증금 ──────────────────────────────────────────── */}
                    <FilterRow label="보증금">
                      {DEPOSIT_PRESETS.map((p, i) => (
                        <ChipBtn
                          key={i}
                          active={filters.depositPreset === i}
                          onClick={() => setFilter('depositPreset', i)}
                        >
                          {p.label}
                        </ChipBtn>
                      ))}
                    </FilterRow>

                    {/* ── 권리금 ──────────────────────────────────────────── */}
                    <FilterRow label="권리금">
                      {RIGHT_FEE_PRESETS.map((p, i) => (
                        <ChipBtn
                          key={i}
                          active={filters.rightFeePreset === i}
                          onClick={() => setFilter('rightFeePreset', i)}
                        >
                          {p.label}
                        </ChipBtn>
                      ))}
                    </FilterRow>

                    {/* ── 면적 ────────────────────────────────────────────── */}
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

                    {/* ── 층수 ────────────────────────────────────────────── */}
                    <FilterRow label="층수">
                      {FLOOR_PRESETS.map((p, i) => (
                        <ChipBtn
                          key={i}
                          active={filters.floorPreset === i}
                          onClick={() => setFilter('floorPreset', i)}
                        >
                          {p.label}
                        </ChipBtn>
                      ))}
                    </FilterRow>

                    {/* ── 업종 적합 ───────────────────────────────────────── */}
                    <FilterRow label="업종 적합">
                      <ChipBtn active={!filters.fitCategory} onClick={() => setFilter('fitCategory', null)}>전체</ChipBtn>
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

                    {/* ── 입지 특성 ───────────────────────────────────────── */}
                    <FilterRow label="입지 특성">
                      <ChipBtn active={!filters.tag} onClick={() => setFilter('tag', null)}>전체</ChipBtn>
                      {LOCATION_TAGS.map(tag => (
                        <ChipBtn
                          key={tag}
                          active={filters.tag === tag}
                          onClick={() => setFilter('tag', filters.tag === tag ? null : tag)}
                        >
                          {tag}
                        </ChipBtn>
                      ))}
                    </FilterRow>

                    {/* ── 기타 옵션 ───────────────────────────────────────── */}
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
                    </div>

                  </div>
                </div>
              </div>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
              Area analysis panel — slides in from the right
          ════════════════════════════════════════════════════════════════ */}
          {areaFiltersOpen && (() => {
            // Derived list used in both the ranked list and footer count
            const matchingAreas = AREAS.filter(a => {
              if (!a.lat) return false
              if (!matchesAreaOverlay(a, areaFilters)) return false
              if (analyzeCenter) {
                const d = haversineM(a.lat!, a.lng!, analyzeCenter.lat, analyzeCenter.lng)
                if (d > analyzeRadius) return false
              }
              return true
            })
            const sortedAreas   = [...matchingAreas].sort((a, b) => {
              switch (areaFilters.sortBy) {
                case 'rent':      return a.avgMonthlyRentPerPyeong - b.avgMonthlyRentPerPyeong
                case 'rightFee':  return a.avgRightFee - b.avgRightFee
                case 'name':      return a.name.localeCompare(b.name, 'ko')
                default:          return b.footTraffic - a.footTraffic
              }
            })

            return (
              <>
                {/* Invisible backdrop — click to close */}
                <div
                  className="absolute inset-0 z-[800]"
                  onClick={() => setAreaFiltersOpen(false)}
                />

                {/* Panel */}
                <div className="absolute right-0 top-0 z-[900] flex h-full w-[300px] flex-col bg-white shadow-2xl">

                  {/* ── Panel header ──────────────────────────────────── */}
                  <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3.5">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <BarChart2 className="h-4 w-4 text-indigo-600" />
                      상권 분석
                      {activeAreaFilterCount(areaFilters) > 0 && (
                        <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] text-white">
                          {activeAreaFilterCount(areaFilters)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {activeAreaFilterCount(areaFilters) > 0 && (
                        <button
                          onClick={() => setAreaFilters(DEFAULT_AREA_FILTERS)}
                          className="text-xs text-gray-400 hover:text-gray-900"
                        >
                          초기화
                        </button>
                      )}
                      <button
                        onClick={() => setAreaFiltersOpen(false)}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* ── Panel body (scrollable) ────────────────────────── */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-5 p-4">

                      {/* ── 상권 검색 ──────────────────────────────────────── */}
                      <div className="relative">
                        <div className="relative">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={areaQuery}
                            placeholder="상권명 검색 (예: 홍대, 강남)…"
                            onChange={e => setAreaQuery(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-300 focus:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-200"
                          />
                          {areaQuery && (
                            <button
                              onClick={() => setAreaQuery('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-700"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        {/* 검색 결과 */}
                        {areaQuery.trim() && (() => {
                          const q = areaQuery.toLowerCase()
                          const hits = AREAS.filter(a =>
                            a.lat != null && (
                              a.name.toLowerCase().includes(q) ||
                              a.district.toLowerCase().includes(q) ||
                              a.region.toLowerCase().includes(q)
                            )
                          ).slice(0, 6)
                          return (
                            <div className="absolute left-0 right-0 top-full z-[1000] mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                              {hits.length === 0 ? (
                                <p className="px-3 py-3 text-center text-xs text-gray-400">검색 결과 없음</p>
                              ) : hits.map(a => {
                                const c = areaCircleColor(a, areaFilters.colorBy)
                                return (
                                  <button
                                    key={a.key}
                                    onClick={() => {
                                      setAreaQuery('')
                                      if (!mapRef.current || !a.lat || !a.lng) return
                                      // ensure overlay is on
                                      if (!showAreas) setShowAreas(true)
                                      mapRef.current.flyTo([a.lat, a.lng], 15, { animate: true, duration: 0.8 })
                                      // open popup after fly
                                      const circle = areaLayersRef.current.get(`${a.key}-circle`) as any
                                      if (circle) setTimeout(() => circle.openPopup?.(), 900)
                                    }}
                                    className="flex w-full items-center gap-2.5 border-b border-gray-50 px-3 py-2.5 text-left last:border-0 hover:bg-gray-50"
                                  >
                                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c }} />
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-xs font-bold text-gray-900">{a.name}</p>
                                      <p className="text-[10px] text-gray-400">{a.region} {a.district}</p>
                                    </div>
                                    <span className="shrink-0 text-[11px] text-gray-400">
                                      {formatNumber(a.footTraffic)}명
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          )
                        })()}
                      </div>

                      {/* ── 구분선 ────────────────────────────────────────── */}
                      <div className="-mx-4 border-t border-gray-100" />

                      {/* ① 레이어 ON / OFF ──────────────────────────────── */}
                      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                        <span className="text-sm font-semibold text-gray-700">상권 원 표시</span>
                        <button
                          onClick={() => setShowAreas(v => !v)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${showAreas ? 'bg-indigo-600' : 'bg-gray-200'}`}
                          role="switch" aria-checked={showAreas}
                        >
                          <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${showAreas ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* ② 색상 기준 ────────────────────────────────────── */}
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">색상 기준</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {COLOR_BY_OPTIONS.map(opt => (
                            <button
                              key={opt.key}
                              onClick={() => setAreaFilters(f => ({ ...f, colorBy: opt.key }))}
                              className={`flex flex-col items-center gap-1 rounded-xl border py-2.5 text-[11px] font-semibold transition-all ${
                                areaFilters.colorBy === opt.key
                                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                  : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                              }`}
                            >
                              {/* mini colour swatch strip */}
                              <span className="flex gap-0.5">
                                {opt.legends.map(l => (
                                  <span key={l.color} className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                                ))}
                              </span>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ── 구분선 ────────────────────────────────────────── */}
                      <div className="-mx-4 border-t border-gray-100" />

                      {/* ③ 지역 필터 ─────────────────────────────────────── */}
                      <FilterRow label="지역">
                        <ChipBtn active={!areaFilters.region} onClick={() => setAreaFilters(f => ({ ...f, region: null }))}>전체</ChipBtn>
                        {REGIONS.map(r => (
                          <ChipBtn
                            key={r}
                            active={areaFilters.region === r}
                            onClick={() => setAreaFilters(f => ({ ...f, region: f.region === r ? null : r }))}
                          >{r}</ChipBtn>
                        ))}
                      </FilterRow>

                      {/* ④ 유동인구 ──────────────────────────────────────── */}
                      <FilterRow label="유동인구">
                        {AREA_FT_TIERS.map((t, i) => (
                          <ChipBtn
                            key={i}
                            active={areaFilters.ftTier === i}
                            onClick={() => setAreaFilters(f => ({ ...f, ftTier: i }))}
                          >
                            {t.label}
                            {t.desc && <span className="ml-1 text-[10px] opacity-60">{t.desc}</span>}
                          </ChipBtn>
                        ))}
                      </FilterRow>

                      {/* ⑤ 주요 업종 ─────────────────────────────────────── */}
                      <FilterRow label="주요 업종">
                        <ChipBtn active={!areaFilters.category} onClick={() => setAreaFilters(f => ({ ...f, category: null }))}>전체</ChipBtn>
                        {AREA_CATS.map(c => (
                          <ChipBtn
                            key={c.key}
                            active={areaFilters.category === c.key}
                            onClick={() => setAreaFilters(f => ({ ...f, category: f.category === c.key ? null : c.key }))}
                          >{c.label}</ChipBtn>
                        ))}
                      </FilterRow>

                      {/* ── 구분선 ────────────────────────────────────────── */}
                      <div className="-mx-4 border-t border-gray-100" />

                      {/* ⑦ 정렬 기준 ─────────────────────────────────────── */}
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">정렬 기준</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {AREA_SORT_OPTIONS.map(opt => (
                            <button
                              key={opt.key}
                              onClick={() => setAreaFilters(f => ({ ...f, sortBy: opt.key }))}
                              className={`rounded-lg border py-2 text-xs font-semibold transition-all ${
                                areaFilters.sortBy === opt.key
                                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                  : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ── 구분선 ────────────────────────────────────────── */}
                      <div className="-mx-4 border-t border-gray-100" />

                      {/* ⑧ 표시 반경 ─────────────────────────────────────── */}
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">표시 반경</p>
                        <p className="mb-2 text-[11px] text-gray-400">각 상권 원의 표시 크기를 조절합니다</p>
                        <div className="flex flex-wrap gap-1.5">
                          {CIRCLE_RADIUS_OPTS.map(opt => (
                            <ChipBtn
                              key={String(opt.value)}
                              active={circleRadiusOverride === opt.value}
                              onClick={() => setCircleRadiusOverride(opt.value)}
                            >
                              {opt.label}
                            </ChipBtn>
                          ))}
                        </div>
                      </div>

                      {/* ⑨ 반경 분석 ─────────────────────────────────────── */}
                      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">반경 분석</p>
                          {analyzeCenter && (
                            <button
                              onClick={() => { setAnalyzeCenter(null); setAnalyzeMode('idle') }}
                              className="flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 hover:bg-indigo-200"
                            >
                              <X className="h-2.5 w-2.5" /> 초기화
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-indigo-500">
                          지도에서 중심점을 선택하면 해당 반경 안의 상권만 표시합니다
                        </p>
                        {/* 반경 선택 */}
                        <div>
                          <p className="mb-1.5 text-[11px] text-indigo-400">분석 반경</p>
                          <div className="flex flex-wrap gap-1.5">
                            {ANALYZE_RADIUS_OPTS.map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => setAnalyzeRadius(opt.value)}
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                                  analyzeRadius === opt.value
                                    ? 'bg-indigo-600 text-white'
                                    : 'border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* 중심점 선택 버튼 */}
                        <button
                          onClick={() => setAnalyzeMode(m => m === 'picking' ? 'idle' : 'picking')}
                          className={`w-full rounded-xl py-2.5 text-sm font-bold transition-all ${
                            analyzeMode === 'picking'
                              ? 'bg-indigo-600 text-white shadow-md'
                              : analyzeCenter
                                ? 'border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {analyzeMode === 'picking'
                            ? '⊕ 지도를 클릭해 중심점 설정…'
                            : analyzeCenter
                              ? '⊕ 중심점 재설정'
                              : '⊕ 지도에서 중심점 선택'}
                        </button>
                        {analyzeCenter && (
                          <p className="text-center text-[11px] font-semibold text-indigo-600">
                            반경 {analyzeRadius >= 1000 ? `${analyzeRadius / 1000}km` : `${analyzeRadius}m`} 내{' '}
                            <strong>
                              {AREAS.filter(a => a.lat != null && haversineM(a.lat!, a.lng!, analyzeCenter.lat, analyzeCenter.lng) <= analyzeRadius).length}
                            </strong>
                            개 상권 분석 중
                          </p>
                        )}
                      </div>

                      {/* ── 구분선 ────────────────────────────────────────── */}
                      <div className="-mx-4 border-t border-gray-100" />

                      {/* ⑩ 정렬 기준 ─────────────────────────────────────── */}
                      <div>
                        <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">결과 정렬</p>
                        <p className="mb-2 text-[10px] text-gray-400">월세·권리금은 결과에서 비교하세요</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {AREA_SORT_OPTIONS.map(opt => (
                            <button
                              key={opt.key}
                              onClick={() => setAreaFilters(f => ({ ...f, sortBy: opt.key }))}
                              className={`rounded-lg border py-2 text-xs font-semibold transition-all ${
                                areaFilters.sortBy === opt.key
                                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                  : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ⑪ 상권 순위 목록 ────────────────────────────────── */}
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                          상권 순위&nbsp;
                          <span className="normal-case font-normal text-gray-400">
                            {matchingAreas.length}개 표시
                          </span>
                        </p>
                        {sortedAreas.length === 0 ? (
                          <p className="py-6 text-center text-xs text-gray-400">조건에 맞는 상권이 없습니다</p>
                        ) : (
                          <div className="space-y-2">
                            {sortedAreas.map((area, idx) => {
                              const c = areaCircleColor(area, areaFilters.colorBy)
                              const metricValue =
                                areaFilters.sortBy === 'rent'     ? `${area.avgMonthlyRentPerPyeong}만/평` :
                                areaFilters.sortBy === 'rightFee' ? `${formatNumber(area.avgRightFee)}만` :
                                areaFilters.sortBy === 'name'     ? area.region :
                                `${formatNumber(area.footTraffic)}명`
                              const dist = analyzeCenter && area.lat != null
                                ? haversineM(area.lat!, area.lng!, analyzeCenter.lat, analyzeCenter.lng)
                                : null
                              return (
                                <div
                                  key={area.key}
                                  className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-3 py-2.5 hover:border-gray-200 hover:bg-gray-50"
                                >
                                  <span
                                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                                    style={{ background: c }}
                                  >
                                    {idx + 1}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-bold text-gray-900">{area.name}</p>
                                    <p className="text-[10px] text-gray-400">
                                      {area.district}
                                      {dist != null && (
                                        <span className="ml-1 text-indigo-400">
                                          {dist >= 1000 ? `${(dist / 1000).toFixed(1)}km` : `${Math.round(dist)}m`}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                  <span className="shrink-0 text-[11px] font-semibold text-gray-700">{metricValue}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* ── Panel footer ────────────────────────────────────── */}
                  <div className="shrink-0 border-t border-gray-100 px-4 py-3">
                    <p className="text-center text-xs text-gray-500">
                      전체{' '}
                      <strong className="font-bold text-gray-900">{AREAS.filter(a => a.lat != null).length}</strong>
                      개 상권 중{' '}
                      <strong className="font-bold text-indigo-600">{matchingAreas.length}</strong>
                      개 표시 중
                    </p>
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MOBILE — Bottom sheet listing panel (lg:hidden)
      ════════════════════════════════════════════════════════════════════ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[600] flex flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out lg:hidden ${
          sheetOpen ? 'translate-y-0' : 'translate-y-[calc(100%-56px)]'
        }`}
        style={{ maxHeight: '72vh' }}
      >
        {/* Pull handle / header */}
        <button
          onClick={() => setSheetOpen(v => !v)}
          className="flex w-full shrink-0 flex-col items-center gap-1.5 px-4 pb-2.5 pt-3"
        >
          <span className="h-1 w-10 rounded-full bg-gray-300" />
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-bold text-gray-900">
              매물 목록
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                <strong className="font-bold text-gray-900">{displayListings.length}</strong>건
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                <span className={`text-[10px] font-bold text-gray-600 transition-transform duration-200 ${sheetOpen ? 'rotate-180' : ''}`}>▲</span>
              </div>
            </div>
          </div>
        </button>
        <div className="h-px shrink-0 bg-gray-100" />

        {/* Scrollable card list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 overscroll-contain">
          {displayListings.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">이 지역에 매물이 없습니다</p>
          ) : (
            displayListings.map(l => (
              <SidebarCard
                key={l.id}
                listing={l}
                selected={l.id === selectedId}
                isFavorite={favorites.has(l.id)}
                onToggleFavorite={() => toggleFavorite(l.id)}
                onClick={() => {
                  setSelectedId(prev => prev === l.id ? null : l.id)
                  panTo(l)
                  setSheetOpen(false)
                }}
              />
            ))
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
    <div
      data-id={listing.id}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      className={`relative w-full cursor-pointer px-4 py-4 text-left transition-colors ${
        selected ? 'bg-gray-50 ring-inset ring-1 ring-gray-200' : 'hover:bg-gray-50/60'
      }`}
    >
      {/* Heart / favorite button — must be a real button for a11y */}
      <button
        type="button"
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
    </div>
  )
}
