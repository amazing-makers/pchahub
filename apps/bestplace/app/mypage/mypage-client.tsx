'use client'

import { useEffect, useState } from 'react'
import { Award, Bookmark, Building2, MapPin, Star } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { StoreCard } from '@/components/store-card'
import { AWARDS, RANK_LABEL, STORES, type MockAward } from '@/lib/mock-data'

interface ReviewEntry {
  id: string
  storeId: string
  storeName: string
  rating: number
  content: string
  createdAt: string
}

interface StoreApplication {
  id: string
  storeName: string
  region: string
  district: string
  status: string
  createdAt: string
}

export function MyPageClient() {
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [recentIds, setRecentIds] = useState<string[]>([])
  const [reviews, setReviews] = useState<ReviewEntry[]>([])
  const [voteIds, setVoteIds] = useState<string[]>([])
  const [applications, setApplications] = useState<StoreApplication[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('bestplace:savedStores')
      if (raw) setSavedIds(JSON.parse(raw) as string[])
    } catch { /* ignore */ }
    try {
      const raw2 = window.localStorage.getItem('bestplace:recentlyViewed')
      if (raw2) setRecentIds(JSON.parse(raw2) as string[])
    } catch { /* ignore */ }
    try {
      const raw3 = window.localStorage.getItem('bestplace:reviews')
      if (raw3) setReviews(JSON.parse(raw3) as ReviewEntry[])
    } catch { /* ignore */ }
    try {
      const raw4 = window.localStorage.getItem('bestplace:votes')
      if (raw4) setVoteIds(JSON.parse(raw4) as string[])
    } catch { /* ignore */ }
    try {
      const raw5 = window.localStorage.getItem('bestplace:store-applications')
      if (raw5) setApplications(JSON.parse(raw5) as StoreApplication[])
    } catch { /* ignore */ }
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
        <Stat icon={Star} label="작성한 리뷰" value={`${reviews.length}개`} />
        <Stat icon={Award} label="투표한 어워드" value={`${voteIds.length}건`} />
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

      {/* 내가 쓴 리뷰 */}
      {reviews.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            <h2 className="text-h4 font-semibold text-gray-900">내가 쓴 리뷰</h2>
          </div>
          <div className="space-y-3">
            {reviews.slice(0, 5).map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={`/stores/${r.storeId}`}
                    className="text-sm font-semibold text-gray-900 hover:underline"
                  >
                    {r.storeName}
                  </a>
                  <div className="flex shrink-0">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-3.5 w-3.5 ${n <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700">{r.content}</p>
                <div className="mt-1 text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString('ko-KR')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 투표한 어워드 */}
      {voteIds.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <h2 className="text-h4 font-semibold text-gray-900">내 어워드 투표</h2>
          </div>
          <div className="space-y-2">
            {voteIds.map((id) => {
              const award: MockAward | undefined = AWARDS.find((a) => a.id === id)
              if (award) {
                const rankLabel = RANK_LABEL[award.rank]
                const href = `/awards/${award.year}?category=${award.category}`
                return (
                  <a
                    key={id}
                    href={href}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-900">
                        {award.year} {award.categoryLabel} {rankLabel}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-gray-500">{award.citation}</div>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      {rankLabel}
                    </span>
                  </a>
                )
              }
              // Fallback: unknown ID — show as a simple chip
              return (
                <div
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800"
                >
                  <Award className="h-3 w-3" />
                  {id}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* 매장 등록 신청 내역 */}
      {applications.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-400" />
            <h2 className="text-h4 font-semibold text-gray-900">매장 등록 신청 내역</h2>
          </div>
          <div className="space-y-2">
            {applications.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-gray-900">{a.storeName}</div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    {a.region} {a.district} · {a.createdAt}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                  검토 중
                </span>
              </div>
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
