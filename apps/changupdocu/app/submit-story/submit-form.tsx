'use client'

import { useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { Button } from '@amakers/ui'

const STORY_TYPE_OPTIONS = [
  { value: 'success', label: '성공 다큐' },
  { value: 'failure', label: '실패 분석' },
  { value: 'interview', label: '점주 인터뷰' },
  { value: 'brand', label: '브랜드 인사이드' },
  { value: 'trend', label: '트렌드·시장 분석' },
]

const BUSINESS_TYPES = ['치킨', '카페', '한식', '일식', '분식', '디저트', '음료', '주점', '기타']

export function SubmitStoryForm() {
  const [storyType, setStoryType] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isValid =
    storyType &&
    businessType &&
    title.trim() &&
    summary.trim().length >= 50 &&
    contactName.trim() &&
    (contactPhone.trim() || contactEmail.trim()) &&
    agreed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    try {
      const raw = window.localStorage.getItem('changupdocu:submissions')
      const prev: object[] = raw ? (JSON.parse(raw) as object[]) : []
      window.localStorage.setItem(
        'changupdocu:submissions',
        JSON.stringify([
          {
            id: `sub-${Date.now()}`,
            storyType, businessType, title, summary,
            contactName, contactPhone, contactEmail,
            anonymous, submittedAt: new Date().toISOString(),
          },
          ...prev,
        ]),
      )
    } catch {
      // ignore
    }
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
        <h2 className="mt-4 text-h3 font-bold text-gray-900">제보가 접수되었습니다</h2>
        <p className="mt-3 text-sm text-gray-500">
          창업다큐 취재팀이 3~5일 이내에 검토 후 연락드립니다.
          <br />
          채택 여부와 관계없이 결과를 안내해 드립니다.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a
            href="/episodes"
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            에피소드 보기
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
      {/* Story type */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">
          이야기 유형 <span className="text-rose-500">*</span>
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {STORY_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStoryType(opt.value)}
              className={
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ' +
                (storyType === opt.value
                  ? 'text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300')
              }
              style={storyType === opt.value ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : undefined}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Business type */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">
          업종 <span className="text-rose-500">*</span>
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {BUSINESS_TYPES.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBusinessType(b)}
              className={
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ' +
                (businessType === b
                  ? 'text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300')
              }
              style={businessType === b ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : undefined}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Story summary */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">이야기 내용</h3>
        <div>
          <label className="block text-xs font-medium text-gray-700">
            제목 (한 줄 요약) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 5년간 카페 운영하다 권리금 0원에 폐업한 이야기"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">
            사연 요약 <span className="text-rose-500">*</span>
            <span className="ml-1 font-normal text-gray-400">({summary.length}/50자 이상)</span>
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="언제, 어떤 브랜드로, 어떤 일이 있었는지 자유롭게 적어주세요. 50자 이상 작성해 주세요."
            rows={5}
            className="mt-1 w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            required
          />
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">
          연락처 <span className="text-rose-500">*</span>
          <span className="ml-1 text-xs font-normal text-gray-400">전화 또는 이메일 중 하나 필수</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">이름 / 닉네임 *</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">연락처 (전화)</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700">이메일</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          익명 처리 요청 (에피소드 제작 시 실명 비공개)
        </label>
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
            [필수] 제보한 정보가 창업다큐 취재·제작 목적으로 사용될 수 있음에 동의합니다.
            허위 제보는 콘텐츠 제작에서 제외되며, 제보자 정보는 외부에 공개되지 않습니다.
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
        <Send className="h-4 w-4" />
        제보 제출하기
      </Button>
    </form>
  )
}
