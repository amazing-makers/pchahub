'use client'

import { useState } from 'react'
import { CheckCircle2, Search, Star, X } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

interface StoreOption {
  id: string
  name: string
  brandId: string
  region: string
  district: string
}

interface NewReviewClientProps {
  stores: StoreOption[]
}

const SUB_RATINGS = [
  { key: 'food', label: '음식·맛' },
  { key: 'service', label: '서비스' },
  { key: 'price', label: '가성비' },
  { key: 'atmosphere', label: '분위기' },
] as const
type SubKey = (typeof SUB_RATINGS)[number]['key']

const STORAGE_KEY = 'bestplace:reviews'

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`${n}점`}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              n <= (hover || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

function SmallStarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5"
          aria-label={`${n}점`}
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              n <= (hover || value) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

const RATING_LABELS: Record<number, string> = {
  1: '별로예요',
  2: '아쉬워요',
  3: '보통이에요',
  4: '좋아요',
  5: '최고예요!',
}

export function NewReviewClient({ stores }: NewReviewClientProps) {
  const [query, setQuery] = useState('')
  const [selectedStore, setSelectedStore] = useState<StoreOption | null>(null)
  const [rating, setRating] = useState(0)
  const [subRatings, setSubRatings] = useState<Record<SubKey, number>>({
    food: 0, service: 0, price: 0, atmosphere: 0,
  })
  const [content, setContent] = useState('')
  const [done, setDone] = useState(false)

  const filtered = query.trim()
    ? stores.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.region.includes(query) ||
          s.district.includes(query),
      ).slice(0, 8)
    : []

  const isValid = selectedStore && rating > 0 && content.trim().length >= 10

  function handleSubmit() {
    if (!selectedStore || !isValid) return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const prev: object[] = raw ? (JSON.parse(raw) as object[]) : []
      const entry = {
        id: `rv-${Date.now()}`,
        storeId: selectedStore.id,
        storeName: selectedStore.name,
        rating,
        subRatings,
        content,
        createdAt: new Date().toISOString().split('T')[0],
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...prev]))
    } catch { /* ignore */ }
    setDone(true)
  }

  if (done) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-10 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'var(--brand-primary)' }}
          >
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-5 text-h3 font-bold text-gray-900">리뷰가 등록됐어요!</h2>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold">{selectedStore?.name}</span>에 대한 소중한 리뷰 감사합니다.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href="/mypage/reviews"
              className="inline-flex rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-400"
            >
              내 리뷰 보기
            </a>
            <a
              href="/stores"
              className="inline-flex rounded-lg px-5 py-2.5 text-sm font-medium text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              매장 더 보기
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* 1. 매장 선택 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              1
            </span>
            <h2 className="text-sm font-bold text-gray-900">어느 매장을 방문하셨나요?</h2>
          </div>

          {selectedStore ? (
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{selectedStore.name}</p>
                <p className="text-xs text-gray-500">{selectedStore.region} {selectedStore.district}</p>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedStore(null); setQuery('') }}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="매장 이름·지역으로 검색"
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-4 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20"
              />
              {filtered.length > 0 && (
                <div className="absolute top-full z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                  {filtered.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => { setSelectedStore(s); setQuery('') }}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">{s.name}</span>
                      <span className="text-xs text-gray-400">{s.region} {s.district}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. 별점 */}
      <Card className={`border-gray-200 shadow-sm transition-opacity ${!selectedStore ? 'opacity-40 pointer-events-none' : ''}`}>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              2
            </span>
            <h2 className="text-sm font-bold text-gray-900">전체적으로 어떠셨나요?</h2>
          </div>
          <div className="flex flex-col items-center gap-2 py-2">
            <StarPicker value={rating} onChange={setRating} />
            <p className={`text-sm font-semibold ${rating ? 'text-amber-500' : 'text-gray-400'}`}>
              {rating ? RATING_LABELS[rating] : '별을 선택해주세요'}
            </p>
          </div>

          {/* 항목별 세부 평가 */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500">항목별 평가 (선택)</p>
            {SUB_RATINGS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{label}</span>
                <SmallStarPicker
                  value={subRatings[key]}
                  onChange={(v) => setSubRatings((prev) => ({ ...prev, [key]: v }))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. 리뷰 내용 */}
      <Card className={`border-gray-200 shadow-sm transition-opacity ${!selectedStore ? 'opacity-40 pointer-events-none' : ''}`}>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              3
            </span>
            <h2 className="text-sm font-bold text-gray-900">경험을 자세히 알려주세요</h2>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="음식 맛, 서비스, 분위기 등 실제 방문 경험을 솔직하게 작성해주세요. (최소 10자)"
            rows={5}
            className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20"
          />
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{content.length < 10 && content.length > 0 ? `${10 - content.length}자 더 필요` : ''}</span>
            <span>{content.length}자</span>
          </div>
        </CardContent>
      </Card>

      {/* 제출 */}
      <div className="pb-4">
        <Button
          size="lg"
          className="w-full"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          리뷰 등록하기
        </Button>
        {!selectedStore && (
          <p className="mt-2 text-center text-xs text-gray-400">매장을 먼저 선택해주세요</p>
        )}
      </div>
    </div>
  )
}
