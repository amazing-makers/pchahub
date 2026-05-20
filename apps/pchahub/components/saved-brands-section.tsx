'use client'

import { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'
import { Badge, BrandLogo } from '@amakers/ui'
import { BRANDS } from '@/lib/mock-data'

const KEY = 'pchahub:savedBrands'

export function SavedBrandsSection() {
  const [ids, setIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      setIds(raw ? JSON.parse(raw) : [])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated) return null

  const saved = ids
    .map((id) => BRANDS.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))

  if (saved.length === 0) return null

  return (
    <section className="container mx-auto pt-section">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
            <Bookmark className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
            저장한 브랜드
          </h2>
          <p className="mt-1 text-sm text-gray-500">{saved.length}개 저장됨</p>
        </div>
        <a
          href="/brands"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          전체 브랜드 보기 →
        </a>
      </div>
      <div className="flex flex-wrap gap-2">
        {saved.map((brand) => (
          <a
            key={brand.id}
            href={`/brands/${brand.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            <BrandLogo brand={brand} size="sm" />
            <span className="font-medium">{brand.name}</span>
            <Badge variant="primary" className="text-[10px]">{brand.categoryLabel}</Badge>
            <span className="text-xs text-gray-400">{brand.storeCount}점</span>
          </a>
        ))}
      </div>
    </section>
  )
}
