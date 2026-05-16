'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

const STORAGE_KEY = 'bestplace:reviews'
const MAX_REVIEWS = 100

interface ReviewEntry {
  id: string
  storeId: string
  storeName: string
  rating: number
  content: string
  createdAt: string
}

interface StoreReviewFormProps {
  storeId: string
  storeName: string
}

export function StoreReviewForm({ storeId, storeName }: StoreReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) { setError('별점을 선택해 주세요.'); return }
    if (content.trim().length < 10) { setError('리뷰를 10자 이상 작성해 주세요.'); return }
    setError('')

    const entry: ReviewEntry = {
      id: `rev-${Date.now()}`,
      storeId,
      storeName,
      rating,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const prev: ReviewEntry[] = raw ? (JSON.parse(raw) as ReviewEntry[]) : []
      const next = [entry, ...prev].slice(0, MAX_REVIEWS)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* ignore */ }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-800">
        ✅ 리뷰가 등록되었습니다. 감사합니다!
      </div>
    )
  }

  return (
    <Card className="border-gray-200">
      <CardContent className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">리뷰 작성</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Star rating */}
          <div>
            <p className="mb-1 text-xs text-gray-500">별점</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  className="focus:outline-none"
                  aria-label={`${n}점`}
                >
                  <Star
                    className={
                      'h-6 w-6 transition-colors ' +
                      (n <= (hovered || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300')
                    }
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 self-center text-sm font-medium text-gray-700">
                  {rating}점
                </span>
              )}
            </div>
          </div>

          {/* Text */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="이 매장을 방문한 경험을 공유해 주세요. (10자 이상)"
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[var(--brand-primary)] focus:bg-white focus:outline-none"
          />
          <div className="text-right text-xs text-gray-400">{content.length}/500</div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none"
          >
            리뷰 등록
          </button>
        </form>
      </CardContent>
    </Card>
  )
}
