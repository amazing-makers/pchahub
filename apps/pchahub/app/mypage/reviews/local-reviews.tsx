'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'

interface LocalReview {
  id: string
  brandId: string
  brandName: string
  rating: number
  region: string
  summary: string
  recommend: string
  anonymous: boolean
  status: string
  createdAt: string
}

export function LocalReviews() {
  const [reviews, setReviews] = useState<LocalReview[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('pchahub:reviews')
      if (raw) setReviews(JSON.parse(raw) as LocalReview[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated || reviews.length === 0) return null

  return (
    <div className="mb-6">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
        최근 접수 ({reviews.length}건) — 검수 후 게시됩니다
      </div>
      <div className="space-y-3">
        {reviews.map((r) => (
          <Card key={r.id} className="border-[var(--brand-primary)]/20 bg-amber-50/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={`/brands/${r.brandId}`}
                    className="text-sm font-semibold text-gray-900 hover:underline"
                  >
                    {r.brandName}
                  </a>
                  <Badge variant="warning">검수 중</Badge>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={
                        'h-3.5 w-3.5 ' +
                        (n <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300')
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-700">{r.summary}</div>
              <div className="mt-2 text-xs text-gray-400">작성일 · {r.createdAt}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
