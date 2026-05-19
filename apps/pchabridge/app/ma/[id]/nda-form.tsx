'use client'

import { useState } from 'react'
import { CheckCircle2, FileText, Lock, Mail, Send, X } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

interface NdaFormProps {
  listingId: string
  brandName: string
  ndaRequired: boolean
}

interface FormState {
  name: string
  company: string
  phone: string
  email: string
  investorType: string
  capital: string
  agreed: boolean
}

const INVESTOR_TYPES = [
  { key: 'individual', label: '개인 (전략적 인수)' },
  { key: 'pe', label: 'PE / 사모펀드' },
  { key: 'strategic', label: '전략적 투자자 (동종업계)' },
  { key: 'operator', label: '다점포 운영자' },
]

export function NdaForm({ listingId, brandName, ndaRequired }: NdaFormProps) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<FormState>({
    name: '',
    company: '',
    phone: '',
    email: '',
    investorType: 'individual',
    capital: '',
    agreed: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const isValid =
    state.name.trim() &&
    state.phone.trim() &&
    state.email.trim() &&
    state.capital.trim() &&
    state.agreed

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    try {
      const raw = window.localStorage.getItem('pchabridge:ma-requests')
      const prev: object[] = raw ? (JSON.parse(raw) as object[]) : []
      const entry = {
        id: `ma-${Date.now()}`,
        listingId,
        brandName,
        ...state,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      window.localStorage.setItem('pchabridge:ma-requests', JSON.stringify([entry, ...prev]))
    } catch {
      // ignore
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
        <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-600" />
        <h3 className="mt-2 text-base font-bold text-emerald-900">NDA 요청 완료</h3>
        <p className="mt-1 text-sm text-emerald-800">
          영업일 기준 2일 이내 NDA 서류와 상세 자료를 이메일로 보내드립니다.
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
      <Button size="lg" className="w-full gap-1" onClick={() => setOpen(true)}>
        <FileText className="h-4 w-4" />
        {ndaRequired ? 'NDA 체결 + 상세 자료 요청' : '상세 자료 요청'}
      </Button>
    )
  }

  return (
    <Card className="border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]/20">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">
            {brandName} {ndaRequired ? 'NDA + 자료 요청' : '상세 자료 요청'}
          </h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-gray-400 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {ndaRequired && (
          <>
            {/* NDA 프로세스 단계 표시 */}
            <div className="mb-5 flex items-center gap-0">
              {[
                { icon: FileText, label: '정보 제출', step: 1 },
                { icon: Mail,     label: 'NDA 수신',  step: 2 },
                { icon: Lock,     label: '자료 열람',  step: 3 },
              ].map(({ icon: Icon, label, step }, idx, arr) => (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={
                        'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ' +
                        (step === 1
                          ? 'bg-[var(--brand-primary)] text-white'
                          : 'bg-gray-100 text-gray-400')
                      }
                    >
                      {step === 1 ? <Icon className="h-3.5 w-3.5" /> : step}
                    </div>
                    <span className={
                      'text-[10px] font-medium ' +
                      (step === 1 ? 'text-gray-900' : 'text-gray-400')
                    }>
                      {label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="mb-3 h-px flex-1 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              ① 아래 정보를 제출하면 ② 영업일 2일 내 NDA 서류를 이메일로 받습니다. ③ 서명 완료 후 상세 자료가 공개됩니다.
            </p>
          </>
        )}

        <form onSubmit={submit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                이름 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={state.name}
                onChange={(e) => setState((p) => ({ ...p, name: e.target.value }))}
                required
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">회사 / 펀드명</label>
              <input
                type="text"
                value={state.company}
                onChange={(e) => setState((p) => ({ ...p, company: e.target.value }))}
                placeholder="없으면 개인으로 기재"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>
          </div>

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

          <div>
            <label className="block text-xs font-medium text-gray-700">
              이메일 <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={state.email}
              onChange={(e) => setState((p) => ({ ...p, email: e.target.value }))}
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              가용 자본 (만원) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={state.capital}
              onChange={(e) => setState((p) => ({ ...p, capital: e.target.value }))}
              placeholder="예) 20억 → 200,000"
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">인수자 유형</label>
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

          <label className="flex items-start gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={state.agreed}
              onChange={(e) => setState((p) => ({ ...p, agreed: e.target.checked }))}
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
            />
            <span>
              {ndaRequired
                ? '제출 후 NDA 서류를 이메일로 받아 서명하면 상세 자료가 제공됨을 확인합니다.'
                : '제출한 정보가 본사 측에 공유됨에 동의합니다.'}
            </span>
          </label>

          <Button
            type="submit"
            size="md"
            className="w-full gap-1"
            disabled={!isValid}
          >
            <Send className="h-3.5 w-3.5" />
            {ndaRequired ? 'NDA 요청 제출' : '자료 요청 제출'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
