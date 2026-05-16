'use client'

import { useEffect, useState } from 'react'
import { Award, Bookmark, MapPin, Star } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { StoreCard } from '@/components/store-card'
import { STORES } from '@/lib/mock-data'

export function MyPageClient() {
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [recentIds, setRecentIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('bestplace:savedStores')
      if (raw) setSavedIds(JSON.parse(raw) as string[])
    } catch {
      // ignore
    }
    try {
      const raw2 = window.localStorage.getItem('bestplace:recentlyViewed')
      if (raw2) setRecentIds(JSON.parse(raw2) as string[])
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  const savedStores = savedIds
    .map((id) => STORES.find((s) => s.id === id))
    .filter(Boolean) as typeof STORES

  if (!hydrated) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 통계 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Bookmark} label="찜한 매장" value={`${savedStores.length}곳`} />
        <Stat icon={MapPin} label="최근 본 매장" value={`${recentIds.length}곳`} />
        <Stat icon={Star} label="작성한 리뷰" value="0개" />
        <Stat icon={Award} label="투표한 어워드" value="0건" />
      </div>

      {/* 찜한 매장 */}
      <section>
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">찜한 매장</h2>
        {savedStores.length === 0 ? (
          <Card className="border-dashed border-gray-200">
            <CardContent className="p-8 text-center">
              <Bookmark className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                아직 찜한 매장이 없습니다. 매장 상세 페이지에서 찜하기를 눌러보세요.
              </p>
              <a
                href="/stores"
                className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                매장 둘러보기
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedStores.map((s) => (
              <StoreCard key={s.id} store={s} />
            ))}
          </div>
        )}
      </section>

      {/* 최근 본 매장 */}
      {recentIds.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">최근 본 매장</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentIds
              .slice(0, 6)
              .map((id) => STORES.find((s) => s.id === id))
              .filter(Boolean)
              .map((s) => (
                <StoreCard key={s!.id} store={s!} />
              ))}
          </div>
        </section>
      )}

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-5 text-sm">
          <div className="font-semibold text-amber-900">이 페이지는 mock 데이터입니다</div>
          <p className="mt-1 text-amber-800">
            Supabase 연결 후 실제 사용자별 매장 데이터로 교체됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function Stat({ icon: Icon, label, value }: { icon: typeof Bookmark; label: string; value: string }) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <Icon className="h-4 w-4 text-gray-400" />
        <div className="mt-2 text-xs text-gray-500">{label}</div>
        <div className="mt-0.5 text-base font-semibold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  )
}
