'use client'

import { useEffect, useState } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { BrandCard } from '@/components/brand-card'
import { BRANDS, type MockBrand } from '@/lib/mock-data'

const SAVED_KEY = 'pchahub:savedBrands'

function readSavedIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(SAVED_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function SavedBrandsClient() {
  const [savedBrands, setSavedBrands] = useState<MockBrand[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const ids = readSavedIds()
    const brands = ids
      .map((id) => BRANDS.find((b) => b.id === id))
      .filter((b): b is MockBrand => b !== undefined)
    setSavedBrands(brands)
    setHydrated(true)
  }, [])

  const removeSaved = (brandId: string) => {
    try {
      const raw = window.localStorage.getItem(SAVED_KEY)
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : []
      const next = ids.filter((id) => id !== brandId)
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next))
      setSavedBrands((prev) => prev.filter((b) => b.id !== brandId))
    } catch {
      // ignore
    }
  }

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  if (savedBrands.length === 0) {
    return (
      <Card className="border-dashed border-gray-200">
        <CardContent className="p-10 text-center">
          <Heart className="mx-auto h-10 w-10 text-gray-300" />
          <h2 className="mt-3 text-base font-semibold text-gray-900">
            아직 찜한 브랜드가 없습니다
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            브랜드 페이지에서 하트 아이콘을 눌러 관심 브랜드를 저장하세요.
          </p>
          <a
            href="/brands"
            className="mt-5 inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            브랜드 검색
          </a>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between text-sm">
        <div className="text-gray-700">{savedBrands.length}개 브랜드</div>
        {savedBrands.length >= 2 && (
          <a
            href={`/brands/compare?ids=${savedBrands.slice(0, 3).map((b) => b.id).join(',')}`}
            className="text-gray-700 hover:text-gray-900"
          >
            찜한 브랜드 비교하기 →
          </a>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {savedBrands.map((b) => (
          <div key={b.id} className="relative group/card">
            <BrandCard brand={b} />
            <button
              type="button"
              onClick={() => removeSaved(b.id)}
              title="찜 해제"
              className="absolute right-2 top-2 hidden rounded-full bg-white/90 p-1.5 text-rose-500 shadow-sm hover:bg-white group-hover/card:flex items-center justify-center"
            >
              <Heart className="h-4 w-4 fill-rose-500" />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
