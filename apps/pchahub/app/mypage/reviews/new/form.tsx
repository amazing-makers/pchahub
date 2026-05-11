'use client'

import { useState } from 'react'
import { CheckCircle2, Send, Shield, Star } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import type { MockBrand } from '@/lib/mock-data'

interface ReviewFormProps {
  presetBrandId: string | null
  brands: MockBrand[]
}

interface FormState {
  brandId: string
  rating: number
  yearsOperating: string
  region: string
  storeName: string
  isCurrent: boolean
  summary: string
  detail: string
  pros: string
  cons: string
  recommend: 'yes' | 'no' | 'partial' | ''
  anonymous: boolean
  agreedTruth: boolean
}

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']

export function ReviewForm({ presetBrandId, brands }: ReviewFormProps) {
  const [state, setState] = useState<FormState>({
    brandId: presetBrandId ?? '',
    rating: 0,
    yearsOperating: '',
    region: '',
    storeName: '',
    isCurrent: true,
    summary: '',
    detail: '',
    pros: '',
    cons: '',
    recommend: '',
    anonymous: false,
    agreedTruth: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const isValid =
    state.brandId !== '' &&
    state.rating >= 1 &&
    state.region !== '' &&
    state.summary.trim().length >= 8 &&
    state.detail.trim().length >= 40 &&
    state.recommend !== '' &&
    state.agreedTruth

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((p) => ({ ...p, [key]: value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-10 text-center">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: 'var(--brand-primary)' }}
            >
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-4 text-h3 font-bold text-gray-900">후기가 접수되었습니다</h2>
            <p className="mt-3 text-gray-600">
              운영팀의 검수를 거쳐 영업일 2일 이내 브랜드 페이지와 장사노트 커뮤니티에 게시됩니다.
              검수 진행 상황은 마이페이지에서 확인할 수 있습니다.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <a href="/mypage">
                <Button variant="outline" size="lg">마이페이지로</Button>
              </a>
              <a href="/brands">
                <Button size="lg">다른 브랜드 둘러보기</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedBrand = brands.find((b) => b.id === state.brandId)

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6">
      {/* 브랜드 + 별점 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <SectionHeader title="기본 정보" />
          <Field label="브랜드 선택" required>
            <select
              value={state.brandId}
              onChange={(e) => update('brandId', e.target.value)}
              className="form-input"
              required
            >
              <option value="">선택</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.categoryLabel})</option>
              ))}
            </select>
          </Field>

          <div>
            <div className="text-xs font-medium text-gray-700">
              별점 <span className="text-rose-500">*</span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => update('rating', n)}
                  className="rounded-full p-1 transition-transform hover:scale-110"
                  aria-label={`${n}점`}
                >
                  <Star
                    className={
                      'h-7 w-7 ' +
                      (n <= state.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300')
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {state.rating > 0 ? `${state.rating}점` : '별점을 선택하세요'}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="운영 연차" required>
              <select
                value={state.yearsOperating}
                onChange={(e) => update('yearsOperating', e.target.value)}
                className="form-input"
                required
              >
                <option value="">선택</option>
                <option>6개월 이하</option>
                <option>1년차</option>
                <option>2년차</option>
                <option>3년차</option>
                <option>4년차</option>
                <option>5년차</option>
                <option>5년 이상</option>
                <option>10년 이상</option>
              </select>
            </Field>
            <Field label="매장 지역" required>
              <select
                value={state.region}
                onChange={(e) => update('region', e.target.value)}
                className="form-input"
                required
              >
                <option value="">선택</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="매장명 (공개되지 않음)" className="sm:col-span-2">
              <input
                type="text"
                value={state.storeName}
                onChange={(e) => update('storeName', e.target.value)}
                placeholder="예: 강남역점 (운영팀 확인용)"
                className="form-input"
              />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={state.isCurrent}
              onChange={(e) => update('isCurrent', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            현재 운영 중인 매장입니다 (체크 해제 시 폐점/양도 매장)
          </label>
        </CardContent>
      </Card>

      {/* 후기 내용 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <SectionHeader
            title="후기 내용"
            helper="제목 8자 이상, 상세 후기 40자 이상 작성해주세요."
          />
          <Field label="한 줄 요약" required>
            <input
              type="text"
              value={state.summary}
              onChange={(e) => update('summary', e.target.value)}
              placeholder="예: 본사 응대가 빠르고 신메뉴 회전이 좋아요"
              className="form-input"
              required
              maxLength={80}
            />
          </Field>

          <Field label="상세 후기" required>
            <textarea
              value={state.detail}
              onChange={(e) => update('detail', e.target.value)}
              placeholder="운영하면서 느낀 점을 솔직하게 적어주세요. 본사 응대, 매출, 비용, 브랜드 인지도, 점주 교육 등 다양한 측면."
              className="form-input min-h-[180px]"
              rows={7}
              required
              maxLength={2000}
            />
            <div className="mt-1 text-right text-xs text-gray-400">
              {state.detail.length} / 2000
            </div>
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="장점 (3가지 내외)">
              <textarea
                value={state.pros}
                onChange={(e) => update('pros', e.target.value)}
                placeholder="• 본사 응대 빠름&#10;• 신메뉴 자주 출시&#10;• 점주 교육 충실"
                className="form-input min-h-[100px]"
                rows={4}
              />
            </Field>
            <Field label="단점 (3가지 내외)">
              <textarea
                value={state.cons}
                onChange={(e) => update('cons', e.target.value)}
                placeholder="• 초도물품 의무 발주&#10;• 인테리어 단가 높음"
                className="form-input min-h-[100px]"
                rows={4}
              />
            </Field>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-700">
              가맹 추천 여부 <span className="text-rose-500">*</span>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {(
                [
                  { key: 'yes', label: '추천합니다', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
                  { key: 'partial', label: '조건부 추천', color: 'border-amber-300 bg-amber-50 text-amber-700' },
                  { key: 'no', label: '추천하지 않음', color: 'border-rose-300 bg-rose-50 text-rose-700' },
                ] as const
              ).map((opt) => {
                const active = state.recommend === opt.key
                return (
                  <label
                    key={opt.key}
                    className={
                      'flex cursor-pointer items-center justify-center rounded-xl border-2 p-3 text-sm font-medium transition-colors ' +
                      (active ? opt.color : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300')
                    }
                  >
                    <input
                      type="radio"
                      name="recommend"
                      checked={active}
                      onChange={() => update('recommend', opt.key)}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 공개 옵션 + 동의 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-2 p-6">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={state.anonymous}
              onChange={(e) => update('anonymous', e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
            />
            <span className="text-gray-700">
              익명으로 게시 (예: "3년차 가맹점주 · 서울"으로만 표시되고 사용자명 비공개)
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={state.agreedTruth}
              onChange={(e) => update('agreedTruth', e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
            />
            <span className="text-gray-700">
              [필수] 본인이 실제로 운영했던 매장에 대한 사실적 후기임을 확인합니다. 허위 후기 작성 시
              영구 정지 + 법적 책임이 발생할 수 있습니다.
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-start gap-1.5 text-xs text-gray-500">
          <Shield className="mt-0.5 h-3 w-3 shrink-0" />
          운영팀 검수 후 게시됩니다. 본사 인증 매장 확인 시 "검증 점주" 배지가 함께 부여됩니다.
        </p>
        <Button type="submit" size="lg" className="gap-1" disabled={!isValid}>
          <Send className="h-4 w-4" />
          후기 등록
        </Button>
      </div>

      {selectedBrand && (
        <div className="text-center text-xs text-gray-500">
          작성 대상: <span className="font-medium text-gray-700">{selectedBrand.name}</span>
        </div>
      )}

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
        :global(.form-input:focus) {
          outline: none;
          box-shadow: 0 0 0 2px var(--brand-primary);
        }
      `}</style>
    </form>
  )
}

function SectionHeader({ title, helper }: { title: string; helper?: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {helper && <p className="mt-0.5 text-xs text-gray-500">{helper}</p>}
    </div>
  )
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={'block text-sm ' + (className ?? '')}>
      <span className="text-xs font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
