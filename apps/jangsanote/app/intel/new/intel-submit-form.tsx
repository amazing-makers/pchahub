'use client'

import { useState } from 'react'
import { CheckCircle2, MapPin } from 'lucide-react'
import { Button } from '@amakers/ui'
import { INTEL_CATEGORY_LABEL, type FootTraffic, type IntelCategory, type RentLevel, type IntelTrend } from '@/lib/mock-intel'

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '기타']

const FOOT_TRAFFIC_OPTIONS: { value: FootTraffic; label: string; desc: string }[] = [
  { value: 'high', label: '많음', desc: '주말 시간당 5,000+' },
  { value: 'medium', label: '보통', desc: '주말 시간당 1,000~5,000' },
  { value: 'low', label: '적음', desc: '주말 시간당 1,000 미만' },
]

const RENT_OPTIONS: { value: RentLevel; label: string; desc: string }[] = [
  { value: 'high', label: '높음', desc: '3.3㎡당 월 35만원+' },
  { value: 'medium', label: '보통', desc: '3.3㎡당 월 15~35만원' },
  { value: 'low', label: '낮음', desc: '3.3㎡당 월 15만원 이하' },
]

const TREND_OPTIONS: { value: IntelTrend; label: string; desc: string }[] = [
  { value: 'up', label: '성장 중', desc: '신규 입점 증가, 임대료 상승' },
  { value: 'stable', label: '안정', desc: '큰 변화 없이 유지' },
  { value: 'down', label: '침체', desc: '공실 증가, 매출 하락' },
]

const categoryKeys = Object.keys(INTEL_CATEGORY_LABEL) as IntelCategory[]

export function IntelSubmitForm() {
  const [title, setTitle] = useState('')
  const [region, setRegion] = useState('')
  const [district, setDistrict] = useState('')
  const [category, setCategory] = useState<IntelCategory | ''>('')
  const [footTraffic, setFootTraffic] = useState<FootTraffic | ''>('')
  const [rentLevel, setRentLevel] = useState<RentLevel | ''>('')
  const [trend, setTrend] = useState<IntelTrend | ''>('')
  const [summary, setSummary] = useState('')
  const [body, setBody] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isValid =
    title.trim() &&
    region &&
    district.trim() &&
    category &&
    footTraffic &&
    rentLevel &&
    trend &&
    summary.trim().length >= 30 &&
    body.trim().length >= 100 &&
    agreed

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    try {
      const raw = window.localStorage.getItem('jangsanote:intel-submissions')
      const prev: object[] = raw ? (JSON.parse(raw) as object[]) : []
      window.localStorage.setItem(
        'jangsanote:intel-submissions',
        JSON.stringify([
          {
            id: `is-${Date.now()}`,
            title, region, district, category, footTraffic, rentLevel, trend, summary, body,
            submittedAt: new Date().toISOString(),
          },
          ...prev,
        ]),
      )
    } catch {}
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'var(--brand-primary)' }}
        >
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="mt-4 text-h3 font-bold text-gray-900">리포트가 접수되었습니다</h2>
        <p className="mt-3 text-sm text-gray-500">
          검토 후 2~3일 이내에 상권 인텔 페이지에 게시됩니다.
          <br />
          소중한 정보를 나눠주셔서 감사합니다.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a
            href="/intel"
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            상권 인텔 보기
          </a>
          <a
            href="/"
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            style={{ background: 'var(--brand-primary)' }}
          >
            홈으로
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 제목 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">
          리포트 제목 <span className="text-rose-500">*</span>
        </h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 홍대 카페 상권 분석 — 2026 상반기"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          required
        />
      </div>

      {/* 지역 + 상세 위치 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">
          위치 <span className="text-rose-500">*</span>
        </h3>
        <div>
          <label className="block text-xs font-medium text-gray-700">광역시·도</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ' +
                  (region === r ? 'text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300')
                }
                style={region === r ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : undefined}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">
            상세 위치 (구·동 수준) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="예: 마포구 홍대·합정 일대"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            required
          />
        </div>
      </div>

      {/* 업종 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">
          업종 <span className="text-rose-500">*</span>
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {categoryKeys.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setCategory(k)}
              className={
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ' +
                (category === k ? 'text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300')
              }
              style={category === k ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : undefined}
            >
              {INTEL_CATEGORY_LABEL[k]}
            </button>
          ))}
        </div>
      </div>

      {/* 상권 지표 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5">
        <h3 className="text-sm font-semibold text-gray-900">
          상권 지표 <span className="text-rose-500">*</span>
        </h3>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">유동인구</label>
          <div className="grid grid-cols-3 gap-2">
            {FOOT_TRAFFIC_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setFootTraffic(o.value)}
                className={
                  'rounded-xl border-2 p-3 text-left transition-colors ' +
                  (footTraffic === o.value ? 'text-white' : 'border-gray-200 hover:border-gray-300')
                }
                style={footTraffic === o.value ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : undefined}
              >
                <div className="text-xs font-bold">{o.label}</div>
                <div className={`mt-0.5 text-[10px] ${footTraffic === o.value ? 'text-white/80' : 'text-gray-400'}`}>{o.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">임대료 수준</label>
          <div className="grid grid-cols-3 gap-2">
            {RENT_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setRentLevel(o.value)}
                className={
                  'rounded-xl border-2 p-3 text-left transition-colors ' +
                  (rentLevel === o.value ? 'text-white' : 'border-gray-200 hover:border-gray-300')
                }
                style={rentLevel === o.value ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : undefined}
              >
                <div className="text-xs font-bold">{o.label}</div>
                <div className={`mt-0.5 text-[10px] ${rentLevel === o.value ? 'text-white/80' : 'text-gray-400'}`}>{o.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">상권 흐름</label>
          <div className="grid grid-cols-3 gap-2">
            {TREND_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setTrend(o.value)}
                className={
                  'rounded-xl border-2 p-3 text-left transition-colors ' +
                  (trend === o.value ? 'text-white' : 'border-gray-200 hover:border-gray-300')
                }
                style={trend === o.value ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : undefined}
              >
                <div className="text-xs font-bold">{o.label}</div>
                <div className={`mt-0.5 text-[10px] ${trend === o.value ? 'text-white/80' : 'text-gray-400'}`}>{o.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 요약 + 본문 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">내용</h3>
        <div>
          <label className="block text-xs font-medium text-gray-700">
            한 줄 요약 <span className="text-rose-500">*</span>
            <span className="ml-1 font-normal text-gray-400">({summary.length}/30자 이상)</span>
          </label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="핵심 결론을 한 문장으로 요약"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">
            상세 내용 <span className="text-rose-500">*</span>
            <span className="ml-1 font-normal text-gray-400">({body.length}/100자 이상)</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="유동인구 패턴, 임대료 실제 수준, 최근 오픈·폐업 동향, 경쟁 강도 등 직접 확인한 내용을 자유롭게 작성해 주세요."
            rows={7}
            className="mt-1 w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            required
          />
        </div>
      </div>

      {/* Agreement */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
            required
          />
          <span>
            [필수] 본 리포트의 내용이 직접 조사·확인한 정보이며, 허위·과장 정보가 없음을 확인합니다.
            게시된 리포트는 다른 점주들과 공유됩니다.
          </span>
        </label>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full gap-1.5"
        disabled={!isValid}
        style={isValid ? { background: 'var(--brand-primary)' } : undefined}
      >
        <MapPin className="h-4 w-4" />
        상권 리포트 제출
      </Button>
    </form>
  )
}
