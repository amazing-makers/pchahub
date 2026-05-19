'use client'

import { useEffect, useState } from 'react'
import { Star, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

const STORAGE_KEY = 'bestplace:reviews'

interface ReviewEntry {
  id: string
  storeId: string
  storeName: string
  rating: number
  content: string
  createdAt: string
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  )
}

export function ReviewsClient() {
  const [reviews, setReviews] = useState<ReviewEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setReviews(JSON.parse(raw) as ReviewEntry[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  function deleteReview(id: string) {
    const updated = reviews.filter((r) => r.id !== id)
    setReviews(updated)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  if (!hydrated) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-xl bg-gray-100" />)}
      </div>
    )
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  if (reviews.length === 0) {
    return (
      <Card className="border-dashed border-gray-200">
        <CardContent className="p-10 text-center">
          <Star className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-4 text-sm font-medium text-gray-600">아직 작성한 리뷰가 없습니다</p>
          <p className="mt-1 text-xs text-gray-400">
            매장 상세 페이지에서 방문 경험을 리뷰로 남겨보세요.
          </p>
          <a
            href="/stores"
            className="mt-6 inline-flex rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            매장 둘러보기
          </a>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{avgRating}</div>
          <StarRow rating={Math.round(Number(avgRating))} />
          <div className="mt-1 text-xs text-gray-500">평균 별점</div>
        </div>
        <div className="h-10 w-px bg-gray-100" />
        <div>
          <div className="text-xl font-bold text-gray-900">{reviews.length}</div>
          <div className="text-xs text-gray-500">작성한 리뷰</div>
        </div>
        <div className="h-10 w-px bg-gray-100" />
        <div>
          <div className="text-xl font-bold text-gray-900">
            {new Set(reviews.map((r) => r.storeId)).size}
          </div>
          <div className="text-xs text-gray-500">방문한 매장</div>
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-3">
        {reviews.map((r) => (
          <Card key={r.id} className="border-gray-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <a
                    href={`/stores/${r.storeId}`}
                    className="text-sm font-semibold text-gray-900 hover:underline"
                  >
                    {r.storeName}
                  </a>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRow rating={r.rating} />
                    <span className="text-xs text-gray-500">{r.rating}점</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                  <button
                    onClick={() => deleteReview(r.id)}
                    className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-red-200 hover:text-red-500"
                    title="삭제"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700">{r.content}</p>
              <div className="mt-3 border-t border-gray-100 pt-3">
                <a
                  href={`/stores/${r.storeId}`}
                  className="text-xs text-[var(--brand-primary)] hover:underline"
                >
                  매장 보기 →
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 text-xs">
          <div className="font-semibold text-amber-900">리뷰 정책 안내</div>
          <p className="mt-1 text-amber-800">
            허위·욕설·광고성 리뷰는 삭제될 수 있습니다. Supabase 연결 후 서버에 저장됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
