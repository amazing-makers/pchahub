'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Search, TrendingUp } from 'lucide-react'
import { Button } from '@amakers/ui'
import { AREAS, LISTING_CATEGORIES } from '@/lib/mock-data'

const TYPES = [
  { value: '', label: '전체 유형' },
  { value: 'transfer', label: '양도' },
  { value: 'new', label: '신규 임대' },
  { value: 'sale', label: '매각' },
]

const REGIONS = [
  '전국', '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산',
  '강원', '충청', '전라', '경상', '제주',
]

// ─────────────────────────────────────────────────────────────────────────────
// Suggestion types
// ─────────────────────────────────────────────────────────────────────────────
type Suggestion =
  | { kind: 'area';     key: string; name: string; sub: string; href: string }
  | { kind: 'region';   key: string; name: string; sub: string; href: string }
  | { kind: 'category'; key: string; name: string; sub: string; href: string }

function buildSuggestions(q: string, type: string, region: string): Suggestion[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return []

  const out: Suggestion[] = []

  // Commercial areas
  AREAS.forEach((a) => {
    if (
      a.name.toLowerCase().includes(needle) ||
      a.district.toLowerCase().includes(needle) ||
      a.region.toLowerCase().includes(needle)
    ) {
      out.push({
        kind: 'area',
        key: a.key,
        name: a.name,
        sub: `${a.region} ${a.district}`,
        href: `/areas/${a.key}`,
      })
    }
  })

  // Categories (업종)
  LISTING_CATEGORIES.forEach((c) => {
    if (c.label.includes(needle)) {
      const params = new URLSearchParams()
      if (type) params.set('type', type)
      if (region && region !== '전국') params.set('region', region)
      params.set('fitCategory', c.key)
      out.push({
        kind: 'category',
        key: c.key,
        name: `${c.label} 매물`,
        sub: `업종 필터 · ${c.brandRefCount}개 가맹 브랜드`,
        href: `/listings?${params.toString()}`,
      })
    }
  })

  return out.slice(0, 6)
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function SearchBar() {
  const [type, setType] = useState('')
  const [region, setRegion] = useState('전국')
  const [keyword, setKeyword] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [focused, setFocused] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Rebuild suggestions whenever keyword/type/region changes
  useEffect(() => {
    setSuggestions(buildSuggestions(keyword, type, region))
    setActiveIdx(-1)
  }, [keyword, type, region])

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFocused(false)
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (region && region !== '전국') params.set('region', region)
    if (keyword) params.set('q', keyword)
    window.location.href = `/listings?${params.toString()}`
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!focused || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      const s = suggestions[activeIdx]
      if (s) {
        setFocused(false)
        window.location.href = s.href
      }
    } else if (e.key === 'Escape') {
      setFocused(false)
    }
  }

  const showDropdown = focused && suggestions.length > 0

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-md sm:flex-row sm:items-center sm:p-1.5"
      >
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] sm:w-32 sm:border-0 sm:border-r"
          aria-label="매물 유형"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] sm:w-32 sm:border-0 sm:border-r"
          aria-label="지역"
        >
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <input
          ref={inputRef}
          type="text"
          placeholder="지역명, 동, 상권명, 업종"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-lg border-0 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-0 sm:px-3"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
        <Button type="submit" size="md" className="gap-1.5">
          <Search className="h-4 w-4" />
          검색
        </Button>
      </form>

      {/* Autocomplete dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
        >
          {suggestions.map((s, i) => (
            <a
              key={s.key}
              href={s.href}
              onClick={() => setFocused(false)}
              className={
                'flex items-center gap-3 px-4 py-3 text-sm transition-colors ' +
                (i === activeIdx ? 'bg-gray-100' : 'hover:bg-gray-50')
              }
            >
              <span
                className={
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ' +
                  (s.kind === 'area'
                    ? 'bg-blue-50 text-blue-600'
                    : s.kind === 'category'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-gray-100 text-gray-500')
                }
              >
                {s.kind === 'category' ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <MapPin className="h-3.5 w-3.5" />
                )}
              </span>
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate font-medium text-gray-900">{s.name}</div>
                <div className="truncate text-xs text-gray-500">{s.sub}</div>
              </div>
              {s.kind === 'area' && (
                <span className="shrink-0 text-xs text-blue-600">상권 →</span>
              )}
              {s.kind === 'category' && (
                <span className="shrink-0 text-xs text-emerald-600">업종 →</span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
