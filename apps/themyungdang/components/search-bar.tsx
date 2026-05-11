'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@amakers/ui'

const TYPES = [
  { value: '', label: '전체 유형' },
  { value: 'transfer', label: '양도' },
  { value: 'new', label: '신규 임대' },
  { value: 'sale', label: '매각' },
]

const REGIONS = [
  '전국',
  '서울',
  '경기',
  '인천',
  '부산',
  '대구',
  '대전',
  '광주',
  '울산',
  '강원',
  '충청',
  '전라',
  '경상',
  '제주',
]

export function SearchBar() {
  const [type, setType] = useState('')
  const [region, setRegion] = useState('전국')
  const [keyword, setKeyword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (region && region !== '전국') params.set('region', region)
    if (keyword) params.set('q', keyword)
    window.location.href = `/listings?${params.toString()}`
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-md sm:flex-row sm:items-center sm:p-1.5"
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
        type="text"
        placeholder="지역명, 동, 상권명"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="flex-1 rounded-lg border-0 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-0 sm:px-3"
        autoComplete="off"
      />
      <Button type="submit" size="md" className="gap-1.5">
        <Search className="h-4 w-4" />
        검색
      </Button>
    </form>
  )
}
