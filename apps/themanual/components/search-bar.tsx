'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@amakers/ui'
import { COURSE_CATEGORIES } from '@/lib/mock-data'

export function SearchBar() {
  const [category, setCategory] = useState('')
  const [keyword, setKeyword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (keyword) params.set('q', keyword)
    window.location.href = `/courses?${params.toString()}`
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-md sm:flex-row sm:items-center sm:p-1.5"
    >
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] sm:w-40 sm:border-0 sm:border-r"
        aria-label="카테고리"
      >
        <option value="">전체 카테고리</option>
        {COURSE_CATEGORIES.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="강의명, 키워드, 멘토 이름"
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
