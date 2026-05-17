'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { CheckCircle2, Star } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { BRANDS } from '@/lib/mock-data'

const KEY = 'pchahub:reviews'

const REGION_OPTIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']

const RECOMMEND_OPTIONS = [
  { value: 'yes', label: '추천합니다' },
  { value: 'conditional', label: '조건부 추천' },
  { value: 'no', label: '비추천합니다' },
]

export function ReviewFormContent() {
  const searchParams = useSearchParams()
  const brandId = searchParams.get('brand') ?? ''
  const brand = BRANDS.find((b) => b.id === brandId)

  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [region, setRegion] = useState('')
  const [yearsOperating, setYearsOperating] = useState('')
  const [summary, setSummary] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [recommend, setRecommend] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) return
    try {
      const raw = window.localStorage.getItem(KEY)
      const existing: unknown[] = raw ? JSON.parse(raw) : []
      const entry = {
        id: `rev-${Date.now()}`,
        brandId,
        brandName: brand?.name ?? brandId,
        rating,
        region,
        yearsOperating,
        summary,
        pros,
        cons,
        recommend,
        anonymous,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      window.localStorage.setItem(KEY, JSON.stringify([entry, ...existing].slice(0, 20)))
    } catch { /* ignore */ }
    setDone(true)
  }

  if (done) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
          <h2 className="mt-4 text-h3 font-bold text-gray-900">후기 접수 완료</h2>
          <p className="mt-2 text-sm text-gray-500">
            검수 후 3~5 영업일 내에 게시됩니다. 솔직한 의견 감사합니다.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="/mypage/reviews">
              <Button variant="outline">내 후기 목록</Button>
            </a>
            <a href="/brands">
              <Button>다른 브랜드 보기</Button>
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6">
        {brand && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <span className="h-10 w-10 shrink-0 rounded-lg" style={{ background: brand.logoColor }} />
            <div>
              <div className="text-sm font-semibold text-gray-900">{brand.name}</div>
              <div className="text-xs text-gray-500">{brand.categoryLabel}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star rating */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700">전체 평점 *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoveredRating(n)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={
                      'h-8 w-8 ' +
                      (n <= (hoveredRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300')
                    }
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="mt-1 text-xs text-gray-500">
                {rating === 5 ? '매우 만족' : rating === 4 ? '만족' : rating === 3 ? '보통' : rating === 2 ? '불만족' : '매우 불만족'}
              </div>
            )}
          </div>

          {/* Region + years */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">운영 지역 *</label>
              <select required value={region} onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              >
                <option value="">선택</option>
                {REGION_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">운영 연차</label>
              <select value={yearsOperating} onChange={(e) => setYearsOperating(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              >
                <option value="">선택</option>
                <option value="under-1">1년 미만</option>
                <option value="1-3">1 ~ 3년</option>
                <option value="3-5">3 ~ 5년</option>
                <option value="over-5">5년 이상</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">한줄 요약 *</label>
            <input required value={summary} onChange={(e) => setSummary(e.target.value)}
              placeholder="예: 본사 지원은 좋지만 로열티가 높습니다"
              maxLength={60}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
            />
          </div>

          {/* Pros */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">장점</label>
            <textarea value={pros} onChange={(e) => setPros(e.target.value)}
              placeholder="운영하면서 좋았던 점을 자유롭게 적어주세요"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
            />
          </div>

          {/* Cons */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">단점</label>
            <textarea value={cons} onChange={(e) => setCons(e.target.value)}
              placeholder="개선이 필요하다고 생각하는 부분"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
            />
          </div>

          {/* Recommend */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">추천 여부 *</label>
            <div className="flex flex-wrap gap-2">
              {RECOMMEND_OPTIONS.map((o) => (
                <button type="button" key={o.value}
                  onClick={() => setRecommend(o.value)}
                  className={
                    'rounded-full border px-4 py-1.5 text-sm transition-colors ' +
                    (recommend === o.value
                      ? 'border-transparent text-white'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50')
                  }
                  style={recommend === o.value ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : {}}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Anonymous */}
          <label className="flex cursor-pointer items-center gap-2.5">
            <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">익명으로 제출</span>
          </label>

          <Button type="submit" size="lg" className="w-full" disabled={rating === 0 || !region || !summary || !recommend}>
            후기 제출
          </Button>
          <p className="text-center text-xs text-gray-400">
            허위 정보 및 비방성 표현은 검수 단계에서 반려될 수 있습니다
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
