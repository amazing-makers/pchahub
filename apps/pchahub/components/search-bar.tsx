'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { CheckCircle2, Search } from 'lucide-react'
import { Button } from '@amakers/ui'
import { BRANDS, CATEGORIES } from '@/lib/mock-data'

const REGIONS = [
  '전국',
  '서울',
  '경기/인천',
  '부산',
  '대구',
  '대전/세종',
  '광주',
  '울산',
  '강원',
  '충청',
  '전라',
  '경상',
  '제주',
]

const MAX_SUGGESTIONS = 5

export function SearchBar() {
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('전국')
  const [keyword, setKeyword] = useState('')
  const [focused, setFocused] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Filter brands by keyword (and category if selected).
  const suggestions = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    if (q.length === 0) return []
    return BRANDS.filter((b) => {
      if (category && b.category !== category) return false
      return (
        b.name.toLowerCase().includes(q) ||
        b.categoryLabel.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      )
    }).slice(0, MAX_SUGGESTIONS)
  }, [keyword, category])

  // Close dropdown on outside click.
  useEffect(() => {
    if (!focused) return
    const onClickAway = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', onClickAway)
    return () => document.removeEventListener('mousedown', onClickAway)
  }, [focused])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (region && region !== '전국') params.set('region', region)
    if (keyword) params.set('q', keyword)
    window.location.href = `/brands?${params.toString()}`
  }

  const showDropdown = focused && suggestions.length > 0

  return (
    <div ref={wrapperRef} className="relative mx-auto w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-md sm:flex-row sm:items-center sm:p-1.5"
      >
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] sm:w-32 sm:border-0 sm:border-r"
          aria-label="업종 선택"
        >
          <option value="">전체 업종</option>
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] sm:w-32 sm:border-0 sm:border-r"
          aria-label="지역 선택"
        >
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="브랜드명 또는 키워드"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setFocused(true)}
          className="flex-1 rounded-lg border-0 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-0 sm:px-3"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="search-suggestions"
        />
        <Button type="submit" size="md" className="gap-1.5">
          <Search className="h-4 w-4" />
          검색
        </Button>
      </form>

      {showDropdown && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          <div className="px-3 py-2 text-xs font-semibold text-gray-500">브랜드 추천</div>
          {suggestions.map((b) => (
            <a
              key={b.id}
              href={`/brands/${b.id}`}
              role="option"
              className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-gray-50"
            >
              <span
                className="h-8 w-8 shrink-0 rounded-md"
                style={{ background: b.logoColor }}
                aria-hidden
              />
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-1">
                  <span className="truncate text-sm font-medium text-gray-900">{b.name}</span>
                  {b.hqVerified && (
                    <CheckCircle2 className="h-3 w-3 shrink-0 text-blue-500" aria-hidden />
                  )}
                </div>
                <div className="truncate text-xs text-gray-500">
                  {b.categoryLabel} · 매장 {b.storeCount}개
                </div>
              </div>
            </a>
          ))}
          <a
            href={`/brands?q=${encodeURIComponent(keyword)}`}
            className="block border-t border-gray-100 px-3 py-2.5 text-center text-xs text-gray-600 hover:bg-gray-50"
          >
            ‘{keyword}’에 대한 전체 결과 보기
          </a>
        </div>
      )}
    </div>
  )
}
