'use client'

import { useState } from 'react'
import { CheckCircle2, Mail, Send, Shield } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { CATEGORIES, CONTRACTORS } from '@/lib/mock-data'

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '강원', '제주']

const BUDGET_LEVELS = [
  { value: 'low', label: '평당 70-90만원 (가성비)' },
  { value: 'mid', label: '평당 90-120만원 (표준)' },
  { value: 'high', label: '평당 120-150만원 (프리미엄)' },
  { value: 'top', label: '평당 150만원 이상 (SNS 핫플)' },
  { value: 'flex', label: '상관없음 / 비교' },
]

const TIMELINES = [
  { value: 'urgent', label: '1개월 이내 시작' },
  { value: 'soon', label: '1 ~ 2개월 이내' },
  { value: 'plan', label: '분기 단위 계획' },
  { value: 'exploring', label: '검토 단계' },
]

interface FormState {
  category: string
  area: string
  region: string
  district: string
  budgetLevel: string
  timeline: string
  preselectedContractor: string
  contactName: string
  email: string
  phone: string
  message: string
  agreed: boolean
}

interface QuoteFormProps {
  preselectedContractor?: string
}

export function QuoteForm({ preselectedContractor }: QuoteFormProps) {
  const [state, setState] = useState<FormState>({
    category: '',
    area: '',
    region: '서울',
    district: '',
    budgetLevel: 'mid',
    timeline: 'soon',
    preselectedContractor: preselectedContractor ?? '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
    agreed: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const isValid =
    state.category &&
    state.area.trim() &&
    state.region &&
    state.contactName.trim() &&
    state.email.trim() &&
    state.phone.trim() &&
    state.agreed

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    // localStorage 저장
    try {
      const raw = window.localStorage.getItem('gongganhansu:quotes')
      const prev: object[] = raw ? (JSON.parse(raw) as object[]) : []
      const entry = {
        id: `qt-${Date.now()}`,
        ...state,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      window.localStorage.setItem('gongganhansu:quotes', JSON.stringify([entry, ...prev]))
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
          <h2 className="mt-4 text-h3 font-bold text-gray-900">견적 요청이 접수되었습니다</h2>
          <p className="mt-3 text-gray-600">
            영업일 48시간 이내 적합한 시공사 3 ~ 5곳에서 견적과 미팅 가능 일정을 입력 이메일로 보내드립니다.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            {state.email}
          </div>
          <div className="mt-8">
            <a href="/gallery">
              <Button size="lg" variant="outline">
                매장 갤러리 둘러보기
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  const preselected = state.preselectedContractor
    ? CONTRACTORS.find((c) => c.id === state.preselectedContractor)
    : null

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Section title="매장 정보" required>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="카테고리" required>
              <select
                value={state.category}
                onChange={(e) => setState((p) => ({ ...p, category: e.target.value }))}
                className="form-input"
                required
              >
                <option value="">선택</option>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="면적 (평)" required>
              <input
                type="number"
                value={state.area}
                onChange={(e) => setState((p) => ({ ...p, area: e.target.value }))}
                placeholder="예) 20"
                className="form-input"
                required
              />
            </Field>
            <Field label="지역" required>
              <select
                value={state.region}
                onChange={(e) => setState((p) => ({ ...p, region: e.target.value }))}
                className="form-input"
                required
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="시/군/구">
              <input
                type="text"
                value={state.district}
                onChange={(e) => setState((p) => ({ ...p, district: e.target.value }))}
                placeholder="예) 강남구"
                className="form-input"
              />
            </Field>
          </div>
        </Section>

        <Section title="예산">
          <div className="space-y-2">
            {BUDGET_LEVELS.map((b) => (
              <RadioRow
                key={b.value}
                active={state.budgetLevel === b.value}
                onClick={() => setState((p) => ({ ...p, budgetLevel: b.value }))}
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

        {preselected && (
          <Card className="border-gray-200 bg-slate-50">
            <CardContent className="p-5">
              <div className="text-xs text-gray-500">선택한 시공사 (우선 견적 요청)</div>
              <div className="mt-2 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                  style={{ background: preselected.brandColor }}
                >
                  {preselected.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{preselected.name}</div>
                  <div className="text-xs text-gray-500">{preselected.tagline}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Section title="연락처" required>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="이름" required>
              <input
                type="text"
                value={state.contactName}
                onChange={(e) => setState((p) => ({ ...p, contactName: e.target.value }))}
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
            <Field label="이메일" required className="sm:col-span-2">
              <input
                type="email"
                value={state.email}
                onChange={(e) => setState((p) => ({ ...p, email: e.target.value }))}
                className="form-input"
                required
              />
            </Field>
          </div>
        </Section>

        <Section title="추가 메시지">
          <textarea
            value={state.message}
            onChange={(e) => setState((p) => ({ ...p, message: e.target.value }))}
            placeholder="시공 컨셉·일정·기타 요청 사항"
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
                [필수] 시공사 견적 회신을 위해 위 개인정보가 시공사에 전달되는 데 동의합니다.
              </span>
            </label>
          </CardContent>
        </Card>
      </div>

      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              견적 요청 요약
            </div>
            <div className="space-y-2 text-sm">
              <Row
                label="카테고리"
                value={CATEGORIES.find((c) => c.key === state.category)?.label ?? '-'}
              />
              <Row label="면적" value={state.area ? `${state.area}평` : '-'} />
              <Row label="지역" value={`${state.region} ${state.district}`.trim() || '-'} />
              <Row
                label="예산"
                value={BUDGET_LEVELS.find((b) => b.value === state.budgetLevel)?.label ?? '-'}
              />
              <Row
                label="시작 시점"
                value={TIMELINES.find((t) => t.value === state.timeline)?.label ?? '-'}
              />
            </div>

            <Button type="submit" size="lg" className="w-full gap-1" disabled={!isValid}>
              <Send className="h-4 w-4" />
              견적 요청 제출
            </Button>

            <p className="flex items-start gap-1.5 text-xs text-gray-500">
              <Shield className="mt-0.5 h-3 w-3 shrink-0" />
              제출된 정보는 시공사 견적 외 사용되지 않습니다.
            </p>
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
  children,
}: {
  title: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <h2 className="text-sm font-semibold text-gray-900">
          {title}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </h2>
        <div className="mt-3">{children}</div>
      </CardContent>
    </Card>
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
          ? 'text-white'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300')
      }
      style={active ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : undefined}
    >
      {label}
    </button>
  )
}

function RadioRow({
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
        'flex w-full items-center justify-between rounded-lg border-2 px-4 py-2.5 text-left text-sm transition-colors ' +
        (active
          ? 'bg-gray-50'
          : 'border-gray-200 bg-white hover:border-gray-300')
      }
      style={active ? { borderColor: 'var(--brand-primary)' } : undefined}
    >
      <span className="font-medium text-gray-900">{label}</span>
      {active && <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--brand-primary)' }} />}
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
