'use client'

import { useState } from 'react'
import { CheckCircle2, Mail, Phone, Send, Shield } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { SERVICES } from '@/lib/mock-data'

const BUDGETS = [
  { value: 'under-500', label: '500만원 이하' },
  { value: '500-1500', label: '500만 ~ 1,500만원' },
  { value: '1500-3000', label: '1,500만 ~ 3,000만원' },
  { value: '3000-plus', label: '3,000만원 이상' },
  { value: 'flexible', label: '유연하게 검토' },
]

const TIMELINES = [
  { value: 'urgent', label: '2주 이내 시작' },
  { value: 'soon', label: '1개월 이내' },
  { value: 'planning', label: '분기 단위 계획' },
  { value: 'exploring', label: '아직 검토 단계' },
]

interface FormState {
  role: 'hq' | 'franchisee'
  brandName: string
  contactName: string
  email: string
  phone: string
  services: string[]
  budget: string
  timeline: string
  message: string
  agreed: boolean
}

export function ContactForm() {
  const [state, setState] = useState<FormState>({
    role: 'hq',
    brandName: '',
    contactName: '',
    email: '',
    phone: '',
    services: [],
    budget: '500-1500',
    timeline: 'soon',
    message: '',
    agreed: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const isValid =
    state.brandName.trim() &&
    state.contactName.trim() &&
    state.email.trim() &&
    state.phone.trim() &&
    state.services.length > 0 &&
    state.agreed

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    // localStorage 저장
    const entryId = `or-${Date.now()}`
    try {
      const raw = window.localStorage.getItem('openrun:contacts')
      const prev: object[] = raw ? (JSON.parse(raw) as object[]) : []
      const entry = {
        id: entryId,
        ...state,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      window.localStorage.setItem('openrun:contacts', JSON.stringify([entry, ...prev]))
    } catch {
      // ignore
    }

    // 의뢰 추적 스냅샷 저장 (openrun:inquiries)
    const INQUIRIES_KEY = 'openrun:inquiries'
    try {
      const inquiry = {
        id: entryId,
        service: state.services.join(', '),
        brandName: state.brandName,
        status: '검토 중',
        submittedAt: new Date().toISOString().slice(0, 10),
      }
      const existing = JSON.parse(window.localStorage.getItem(INQUIRIES_KEY) ?? '[]') as object[]
      window.localStorage.setItem(INQUIRIES_KEY, JSON.stringify([inquiry, ...existing].slice(0, 20)))
    } catch {
      // ignore
    }

    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-2xl border-gray-200 shadow-sm">
        <CardContent className="p-10 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'var(--brand-primary)' }}
          >
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-4 text-h3 font-bold text-gray-900">의뢰가 접수되었습니다</h2>
          <p className="mt-3 text-gray-600">
            영업일 기준 24시간 이내 캠페인 기획안과 견적을 입력해주신 이메일로 보내드립니다.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            {state.email}
          </div>
          <div className="mt-8">
            <a href="/portfolio">
              <Button size="lg" variant="outline">
                다른 사례 둘러보기
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Section title="신청자 정보" required>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="회사명 / 브랜드명" required>
              <input
                type="text"
                value={state.brandName}
                onChange={(e) => setState((p) => ({ ...p, brandName: e.target.value }))}
                placeholder="(주)예시컴퍼니 / 브랜드 X"
                className="form-input"
                required
              />
            </Field>
            <Field label="담당자명" required>
              <input
                type="text"
                value={state.contactName}
                onChange={(e) => setState((p) => ({ ...p, contactName: e.target.value }))}
                className="form-input"
                required
              />
            </Field>
            <Field label="이메일" required>
              <input
                type="email"
                value={state.email}
                onChange={(e) => setState((p) => ({ ...p, email: e.target.value }))}
                className="form-input"
                required
              />
            </Field>
            <Field label="연락처" required>
              <input
                type="tel"
                value={state.phone}
                onChange={(e) => setState((p) => ({ ...p, phone: e.target.value }))}
                placeholder="010-1234-5678"
                className="form-input"
                required
              />
            </Field>
          </div>
        </Section>

        <Section title="역할" required>
          <div className="grid gap-2 sm:grid-cols-2">
            <RadioCard
              active={state.role === 'hq'}
              onClick={() => setState((p) => ({ ...p, role: 'hq' }))}
              title="본사 / 가맹사업"
              helper="가맹 모집·본사 마케팅 캠페인"
            />
            <RadioCard
              active={state.role === 'franchisee'}
              onClick={() => setState((p) => ({ ...p, role: 'franchisee' }))}
              title="가맹점주 / 매장 운영자"
              helper="그랜드 오픈·매장 캠페인"
            />
          </div>
        </Section>

        <Section title="관심 서비스" required helper="복수 선택 가능">
          <div className="space-y-2">
            {SERVICES.map((s) => {
              const active = state.services.includes(s.slug)
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() =>
                    setState((p) => ({
                      ...p,
                      services: active ? p.services.filter((x) => x !== s.slug) : [...p.services, s.slug],
                    }))
                  }
                  className={
                    'flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition-colors ' +
                    (active
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 bg-white hover:border-gray-400')
                  }
                  aria-pressed={active}
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{s.title}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{s.subtitle}</div>
                  </div>
                  {active && <CheckCircle2 className="h-4 w-4 text-gray-900" />}
                </button>
              )
            })}
          </div>
        </Section>

        <Section title="예상 예산">
          <div className="grid gap-2 sm:grid-cols-3">
            {BUDGETS.map((b) => (
              <Radio
                key={b.value}
                active={state.budget === b.value}
                onClick={() => setState((p) => ({ ...p, budget: b.value }))}
                label={b.label}
              />
            ))}
          </div>
        </Section>

        <Section title="시작 시점">
          <div className="grid gap-2 sm:grid-cols-2">
            {TIMELINES.map((t) => (
              <Radio
                key={t.value}
                active={state.timeline === t.value}
                onClick={() => setState((p) => ({ ...p, timeline: t.value }))}
                label={t.label}
              />
            ))}
          </div>
        </Section>

        <Section title="추가 메시지">
          <textarea
            value={state.message}
            onChange={(e) => setState((p) => ({ ...p, message: e.target.value }))}
            placeholder="현재 상황·고민·캠페인 목표를 간단히 적어주세요."
            rows={4}
            className="form-input resize-y"
          />
        </Section>

        <Card className="border-gray-200">
          <CardContent className="p-4">
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={state.agreed}
                onChange={(e) => setState((p) => ({ ...p, agreed: e.target.checked }))}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
              />
              <span className="text-gray-700">
                [필수] 캠페인 안내 + 기획안 회신을 위해 위 개인정보 처리에 동의합니다.
              </span>
            </label>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              의뢰 요약
            </div>
            <div className="space-y-2 text-sm">
              <Row label="회사명" value={state.brandName || '-'} />
              <Row
                label="역할"
                value={state.role === 'hq' ? '본사' : '가맹점주'}
              />
              <Row
                label="관심 서비스"
                value={
                  state.services.length === 0
                    ? '-'
                    : state.services
                        .map((s) => SERVICES.find((x) => x.slug === s)?.title)
                        .filter(Boolean)
                        .join(', ')
                }
              />
              <Row
                label="예산"
                value={BUDGETS.find((b) => b.value === state.budget)?.label ?? '-'}
              />
              <Row
                label="시작 시점"
                value={TIMELINES.find((t) => t.value === state.timeline)?.label ?? '-'}
              />
            </div>

            <Button type="submit" size="lg" className="w-full gap-1" disabled={!isValid}>
              <Send className="h-4 w-4" />
              의뢰 제출
            </Button>

            <div className="space-y-1 text-xs text-gray-500">
              <p className="flex items-center gap-1.5">
                <Shield className="h-3 w-3" />
                의뢰 정보는 캠페인 답변 외 사용되지 않습니다.
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="h-3 w-3" />
                급한 문의는 02-1234-5678
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

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

function Section({
  title,
  required,
  helper,
  children,
}: {
  title: string
  required?: boolean
  helper?: string
  children: React.ReactNode
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            {title}
            {required && <span className="ml-1 text-rose-500">*</span>}
          </h2>
          {helper && <p className="mt-0.5 text-xs text-gray-500">{helper}</p>}
        </div>
        <div className="mt-3">{children}</div>
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function Radio({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ' +
        (active
          ? 'border-gray-900 bg-gray-900 text-white'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300')
      }
    >
      {label}
    </button>
  )
}

function RadioCard({
  active,
  onClick,
  title,
  helper,
}: {
  active: boolean
  onClick: () => void
  title: string
  helper: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-xl border-2 p-3 text-left transition-colors ' +
        (active
          ? 'border-gray-900 bg-gray-50'
          : 'border-gray-200 bg-white hover:border-gray-400')
      }
    >
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="mt-0.5 text-xs text-gray-500">{helper}</div>
    </button>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-gray-50 pb-1.5 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-right text-xs font-medium text-gray-900">{value}</span>
    </div>
  )
}
