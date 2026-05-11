'use client'

import { useState } from 'react'
import { Check, CheckCircle2, ChevronRight, Phone, Send, Shield } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { BRANDS, type MockBrand } from '@/lib/mock-data'

interface InquiryFormProps {
  initialBrand: MockBrand | null
}

const MOTIVE_OPTIONS = [
  { key: 'consider', label: '창업 검토' },
  { key: 'info', label: '브랜드 정보 문의' },
  { key: 'quote', label: '견적 / 비용 확인' },
  { key: 'location', label: '입지 추천' },
  { key: 'visit', label: '가맹점 방문 희망' },
]

const CAPITAL_OPTIONS = [
  { value: '~3000', label: '3,000만원 이하' },
  { value: '3000~5000', label: '3,000 ~ 5,000만원' },
  { value: '5000~10000', label: '5,000만원 ~ 1억' },
  { value: '10000~', label: '1억 이상' },
  { value: 'flexible', label: '유연하게 검토' },
]

const REGION_OPTIONS = [
  '전국',
  '서울',
  '경기',
  '인천',
  '부산',
  '대구',
  '대전',
  '광주',
  '울산',
  '강원',
  '충청',
  '전라',
  '경상',
  '제주',
]

interface FormState {
  brandId: string
  name: string
  phone: string
  email: string
  motives: string[]
  capital: string
  region: string
  message: string
  agreed: boolean
}

export function InquiryForm({ initialBrand }: InquiryFormProps) {
  const [state, setState] = useState<FormState>({
    brandId: initialBrand?.id ?? '',
    name: '',
    phone: '',
    email: '',
    motives: ['consider'],
    capital: 'flexible',
    region: '전국',
    message: '',
    agreed: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const selectedBrand = state.brandId ? BRANDS.find((b) => b.id === state.brandId) : null
  const isValid =
    state.name.trim() && state.phone.trim() && state.agreed && state.motives.length > 0

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    // In production: POST to /api/inquiries (NextAuth-protected).
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return <SuccessState brand={selectedBrand} />
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-6 p-6">
          <Section title="상담 대상">
            <select
              value={state.brandId}
              onChange={(e) => setState((p) => ({ ...p, brandId: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            >
              <option value="">특정 브랜드 없음 (일반 창업 상담)</option>
              {BRANDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} · {b.categoryLabel}
                </option>
              ))}
            </select>
            {selectedBrand && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <span
                  className="h-10 w-10 shrink-0 rounded-lg"
                  style={{ background: selectedBrand.logoColor }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{selectedBrand.name}</div>
                  <div className="text-xs text-gray-500">
                    {selectedBrand.categoryLabel} · 매장 {selectedBrand.storeCount}개
                  </div>
                </div>
              </div>
            )}
          </Section>

          <Section title="신청자 정보" required>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="이름" required>
                <input
                  type="text"
                  value={state.name}
                  onChange={(e) => setState((p) => ({ ...p, name: e.target.value }))}
                  placeholder="홍길동"
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
              <Field label="이메일" className="sm:col-span-2">
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => setState((p) => ({ ...p, email: e.target.value }))}
                  placeholder="example@email.com"
                  className="form-input"
                />
              </Field>
            </div>
          </Section>

          <Section title="상담 동기" required helper="복수 선택 가능합니다">
            <div className="flex flex-wrap gap-2">
              {MOTIVE_OPTIONS.map((o) => {
                const active = state.motives.includes(o.key)
                return (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() =>
                      setState((p) => ({
                        ...p,
                        motives: active
                          ? p.motives.filter((m) => m !== o.key)
                          : [...p.motives, o.key],
                      }))
                    }
                    className={
                      'inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm transition-colors ' +
                      (active
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300')
                    }
                    aria-pressed={active}
                  >
                    {active && <Check className="h-3 w-3" />}
                    {o.label}
                  </button>
                )
              })}
            </div>
          </Section>

          <Section title="가용 자본">
            <div className="grid gap-2 sm:grid-cols-3">
              {CAPITAL_OPTIONS.map((c) => (
                <RadioButton
                  key={c.value}
                  active={state.capital === c.value}
                  onClick={() => setState((p) => ({ ...p, capital: c.value }))}
                  label={c.label}
                />
              ))}
            </div>
          </Section>

          <Section title="희망 지역">
            <select
              value={state.region}
              onChange={(e) => setState((p) => ({ ...p, region: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            >
              {REGION_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Section>

          <Section title="추가 메시지" helper="본사에 전달될 내용입니다">
            <textarea
              value={state.message}
              onChange={(e) => setState((p) => ({ ...p, message: e.target.value }))}
              placeholder="궁금한 점이나 본사에 전달하고 싶은 내용을 자유롭게 적어주세요."
              rows={4}
              className="form-input resize-y"
            />
          </Section>

          <label className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white p-3 text-sm">
            <input
              type="checkbox"
              checked={state.agreed}
              onChange={(e) => setState((p) => ({ ...p, agreed: e.target.checked }))}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
            />
            <span className="text-gray-700">
              상담 진행을 위해 본사에 개인정보(이름·연락처·이메일·자본·지역·메시지)가 전달되는 데
              동의합니다. 동의하지 않으시면 상담 신청이 불가합니다.
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Sticky summary */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div>
              <div className="text-xs text-gray-500">신청 요약</div>
              <div className="mt-2 space-y-1.5 text-sm">
                <SummaryRow label="대상" value={selectedBrand?.name ?? '일반 창업 상담'} />
                <SummaryRow label="이름" value={state.name || '-'} />
                <SummaryRow label="연락처" value={state.phone || '-'} />
                <SummaryRow
                  label="동기"
                  value={
                    state.motives.length === 0
                      ? '-'
                      : state.motives
                          .map((m) => MOTIVE_OPTIONS.find((o) => o.key === m)?.label)
                          .filter(Boolean)
                          .join(', ')
                  }
                />
                <SummaryRow
                  label="자본"
                  value={CAPITAL_OPTIONS.find((c) => c.value === state.capital)?.label ?? '-'}
                />
                <SummaryRow label="지역" value={state.region} />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full gap-1" disabled={!isValid}>
              <Send className="h-4 w-4" />
              본사에 신청 보내기
            </Button>

            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <Shield className="h-3 w-3" />
              제출된 정보는 본사 외 amakers는 보관하지 않습니다.
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

function SuccessState({ brand }: { brand: MockBrand | null }) {
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
          <h2 className="mt-4 text-h3 font-bold text-gray-900">상담 신청이 접수되었습니다</h2>
          <p className="mt-3 text-gray-600">
            {brand
              ? `${brand.name} 본사에서 영업일 기준 3일 이내 연락드릴 예정입니다.`
              : '담당 컨설턴트가 영업일 기준 3일 이내 연락드릴 예정입니다.'}
          </p>
          <div className="mt-2 inline-flex items-center gap-1 text-sm text-gray-500">
            <Phone className="h-3.5 w-3.5" />
            연락 시간대: 평일 09:00 - 18:00
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <a href="/brands">
              <Button size="lg">다른 브랜드 둘러보기</Button>
            </a>
            <a href="/scanner">
              <Button size="lg" variant="outline" className="gap-1">
                창업 스캐너 다시 보기
                <ChevronRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
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
    <div>
      <div className="text-sm font-semibold text-gray-900">
        {title}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </div>
      {helper && <p className="mt-0.5 text-xs text-gray-500">{helper}</p>}
      <div className="mt-3">{children}</div>
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

function RadioButton({
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
      aria-pressed={active}
    >
      {label}
    </button>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-gray-50 pb-1.5 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-right text-xs font-medium text-gray-900">{value}</span>
    </div>
  )
}
