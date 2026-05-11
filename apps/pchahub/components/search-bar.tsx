'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@amakers/ui'
import { CATEGORIES } from '@/lib/mock-data'

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

export function SearchBar() {
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('전국')
  const [keyword, setKeyword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (region && region !== '전국') params.set('region', region)
    if (keyword) params.set('q', keyword)
    window.location.href = `/brands?${params.toString()}`
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-md sm:flex-row sm:items-center sm:p-1.5"
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
        className="flex-1 rounded-lg border-0 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-0 sm:px-3"
      />
      <Button type="submit" size="md" className="gap-1.5">
        <Search className="h-4 w-4" />
        검색
      </Button>
    </form>
  )
}
