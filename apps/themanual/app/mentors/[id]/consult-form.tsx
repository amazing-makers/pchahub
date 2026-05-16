'use client'

import { useState } from 'react'
import { Check, CheckCircle2, MessageCircle, Send } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'

interface ConsultFormProps {
  mentorId: string
  mentorName: string
  hourlyRate: number
}

const TOPIC_OPTIONS = [
  { key: 'startup', label: '창업 준비' },
  { key: 'ops', label: '매장 운영' },
  { key: 'finance', label: '세무·회계' },
  { key: 'legal', label: '법률·계약' },
  { key: 'marketing', label: '마케팅' },
  { key: 'interior', label: '인테리어' },
  { key: 'other', label: '기타' },
]

interface FormState {
  name: string
  phone: string
  topic: string
  question: string
  agreed: boolean
}

export function ConsultForm({ mentorId, mentorName, hourlyRate }: ConsultFormProps) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<FormState>({
    name: '',
    phone: '',
    topic: 'startup',
    question: '',
    agreed: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const isValid = state.name.trim() && state.phone.trim() && state.agreed && state.question.trim()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    // localStorage 저장
    try {
      const raw = window.localStorage.getItem('themanual:consultations')
      const prev: object[] = raw ? (JSON.parse(raw) as object[]) : []
      const entry = {
        id: `cs-${Date.now()}`,
        mentorId,
        mentorName,
        name: state.name,
        phone: state.phone,
        topic: state.topic,
        question: state.question,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      }
      window.localStorage.setItem(
        'themanual:consultations',
        JSON.stringify([entry, ...prev]),
      )
    } catch {
      // ignore
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-5 text-center">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: 'var(--brand-primary)' }}
          >
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <h3 className="mt-3 text-base font-bold text-gray-900">신청 완료!</h3>
          <p className="mt-1 text-sm text-gray-500">
            {mentorName} 멘토에게 상담 요청을 보냈습니다.
            <br />
            영업일 기준 3일 이내 연락드립니다.
          </p>
          <button
            type="button"
            onClick={() => { setSubmitted(false); setOpen(false) }}
            className="mt-4 text-sm text-gray-500 hover:text-gray-900 underline"
          >
            닫기
          </button>
        </CardContent>
      </Card>
    )
  }

  if (!open) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div>
            <div className="text-xs text-gray-500">시간당 상담료</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">
              {formatNumber(hourlyRate)}
              <span className="text-base font-medium text-gray-500"> 원</span>
            </div>
          </div>
          <Button
            size="lg"
            className="w-full gap-1"
            onClick={() => setOpen(true)}
          >
            <MessageCircle className="h-4 w-4" />
            1:1 상담 신청
          </Button>
          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
            상담은 영업일 기준 3일 이내 매칭됩니다. 매칭 후 일정 조율은 멘토와 직접
            진행합니다.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[var(--brand-primary)] shadow-sm ring-1 ring-[var(--brand-primary)]/20">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">
            {mentorName} 멘토 상담 신청
          </h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
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

          {/* 상담 주제 */}
          <div>
            <label className="block text-xs font-medium text-gray-700">상담 주제</label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {TOPIC_OPTIONS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setState((p) => ({ ...p, topic: t.key }))}
                  className={
                    'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors ' +
                    (state.topic === t.key
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400')
                  }
                >
                  {state.topic === t.key && <Check className="h-3 w-3" />}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 질문 내용 */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              질문 내용 <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={state.question}
              onChange={(e) => setState((p) => ({ ...p, question: e.target.value }))}
              placeholder="상담받고 싶은 구체적인 내용을 적어주세요. 자세할수록 더 잘 도와드릴 수 있습니다."
              rows={3}
              required
              className="mt-1 w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
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
              상담 매칭을 위해 멘토에게 이름·연락처·질문 내용이 전달되는 것에 동의합니다.
            </span>
          </label>

          <Button
            type="submit"
            size="md"
            className="w-full gap-1"
            disabled={!isValid}
          >
            <Send className="h-3.5 w-3.5" />
            상담 신청 보내기
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
