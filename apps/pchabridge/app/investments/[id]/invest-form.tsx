'use client'

import { useState } from 'react'
import { CheckCircle2, Send, X } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'

interface InvestFormProps {
  roundId: string
  brandName: string
  minInvestment: number
  expectedROI: number
  closeDate: string
  isOpen: boolean
}

interface FormState {
  name: string
  phone: string
  email: string
  amount: string
  investorType: string
  message: string
  agreed: boolean
}

const INVESTOR_TYPES = [
  { key: 'individual', label: '개인 투자자' },
  { key: 'angel', label: '엔젤 투자자' },
  { key: 'vc', label: 'VC/기관' },
  { key: 'franchise-owner', label: '점주 (다점포 검토)' },
]

export function InvestForm({
  roundId,
  brandName,
  minInvestment,
  expectedROI,
  closeDate,
  isOpen,
}: InvestFormProps) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    amount: String(minInvestment),
    investorType: 'individual',
    message: '',
    agreed: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const isValid =
    state.name.trim() &&
    state.phone.trim() &&
    state.email.trim() &&
    state.amount &&
    state.agreed

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    try {
      const raw = window.localStorage.getItem('pchabridge:interests')
      const prev: object[] = raw ? (JSON.parse(raw) as object[]) : []
      const entry = {
        id: `inv-${Date.now()}`,
        roundId,
        brandName,
        name: state.name,
        phone: state.phone,
        email: state.email,
        amount: state.amount,
        investorType: state.investorType,
        message: state.message,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      window.localStorage.setItem('pchabridge:interests', JSON.stringify([entry, ...prev]))
    } catch {
      // ignore
    }

    setSubmitted(true)
  }

  if (!isOpen) {
    return (
      <Button size="lg" className="w-full" disabled>
        모집 마감
      </Button>
    )
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
        <h3 className="mt-2 text-base font-bold text-emerald-900">투자 신청 접수 완료!</h3>
        <p className="mt-1 text-sm text-emerald-800">
          영업일 기준 2일 이내 담당 매니저가 연락드립니다.
        </p>
        <button
          type="button"
          onClick={() => { setSubmitted(false); setOpen(false) }}
          className="mt-3 text-xs text-emerald-700 underline hover:text-emerald-900"
        >
          닫기
        </button>
      </div>
    )
  }

  if (!open) {
    return (
      <div className="space-y-2">
        <Button
          size="lg"
          className="w-full"
          onClick={() => setOpen(true)}
        >
          투자 신청
        </Button>
        <p className="text-center text-xs text-gray-500">
          최소 {formatNumber(minInvestment)}만원 · 예상 ROI +{expectedROI}%/년 · 마감 {closeDate}
        </p>
      </div>
    )
  }

  return (
    <Card className="border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]/20">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">{brandName} 투자 신청</h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-gray-400 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {/* 이름 */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              이름 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={state.name}
              onChange={(e) => setState((p) => ({ ...p, name: e.target.value }))}
              placeholder="홍길동"
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          {/* 연락처 */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              연락처 <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={state.phone}
              onChange={(e) => setState((p) => ({ ...p, phone: e.target.value }))}
              placeholder="010-1234-5678"
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              이메일 <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={state.email}
              onChange={(e) => setState((p) => ({ ...p, email: e.target.value }))}
              placeholder="name@example.com"
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          {/* 투자 금액 */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              투자 예정 금액 (만원) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={state.amount}
              onChange={(e) => setState((p) => ({ ...p, amount: e.target.value }))}
              min={minInvestment}
              step={100}
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
            <p className="mt-0.5 text-xs text-gray-400">최소 {formatNumber(minInvestment)}만원</p>
          </div>

          {/* 투자자 유형 */}
          <div>
            <label className="block text-xs font-medium text-gray-700">투자자 유형</label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {INVESTOR_TYPES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setState((p) => ({ ...p, investorType: t.key }))}
                  className={
                    'rounded-full border px-2.5 py-1 text-xs transition-colors ' +
                    (state.investorType === t.key
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400')
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 메시지 */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              투자 배경 / 질문 <span className="text-xs font-normal text-gray-400">(선택)</span>
            </label>
            <textarea
              value={state.message}
              onChange={(e) => setState((p) => ({ ...p, message: e.target.value }))}
              placeholder="투자 이유나 IR 관련 질문을 남겨주세요."
              rows={2}
              className="mt-1 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          {/* 동의 */}
          <label className="flex items-start gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={state.agreed}
              onChange={(e) => setState((p) => ({ ...p, agreed: e.target.checked }))}
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
            />
            <span>
              투자 검토 진행을 위해 위 정보가 브랜드 본사와 amakers 매니저에게 공유되는 것에 동의합니다.
            </span>
          </label>

          <Button
            type="submit"
            size="md"
            className="w-full gap-1"
            disabled={!isValid}
          >
            <Send className="h-3.5 w-3.5" />
            투자 신청 제출
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
