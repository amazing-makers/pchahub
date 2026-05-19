'use client'

import { useEffect, useState } from 'react'
import { Calendar, CheckCircle2, Clock, MessageCircle, Trash2, XCircle } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'

interface Consultation {
  id: string
  mentorId: string
  mentorName: string
  name: string
  phone: string
  topic: string
  question: string
  date?: string
  time?: string
  status: string
  createdAt: string
}

const TOPIC_LABEL: Record<string, string> = {
  startup: '창업 준비',
  ops: '매장 운영',
  finance: '세무·회계',
  legal: '법률·계약',
  marketing: '마케팅',
  interior: '인테리어',
  other: '기타',
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'primary' | 'warning' | 'error'; icon: typeof Clock }> = {
  pending:   { label: '예약 접수', variant: 'warning', icon: Clock },
  confirmed: { label: '확정',      variant: 'primary', icon: CheckCircle2 },
  done:      { label: '완료',      variant: 'default', icon: CheckCircle2 },
  cancelled: { label: '취소',      variant: 'error',   icon: XCircle },
}

export function ConsultationsClient() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('themanual:consultations')
      if (raw) setConsultations(JSON.parse(raw) as Consultation[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  function handleCancel(id: string) {
    setConsultations((prev) => {
      const updated = prev.map((c) => c.id === id ? { ...c, status: 'cancelled' } : c)
      window.localStorage.setItem('themanual:consultations', JSON.stringify(updated))
      return updated
    })
  }

  function handleDelete(id: string) {
    setConsultations((prev) => {
      const updated = prev.filter((c) => c.id !== id)
      window.localStorage.setItem('themanual:consultations', JSON.stringify(updated))
      return updated
    })
  }

  if (!hydrated) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  if (consultations.length === 0) {
    return (
      <Card className="border-dashed border-gray-200">
        <CardContent className="p-12 text-center">
          <MessageCircle className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-4 text-base font-medium text-gray-600">아직 예약한 상담이 없습니다</p>
          <p className="mt-1 text-sm text-gray-400">
            멘토 상세 페이지에서 &apos;예약하기&apos; 버튼을 눌러 예약하세요.
          </p>
          <a
            href="/mentors"
            className="mt-6 inline-flex rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            멘토 찾기
          </a>
        </CardContent>
      </Card>
    )
  }

  const upcoming = consultations.filter((c) => c.status !== 'done' && c.status !== 'cancelled')
  const past     = consultations.filter((c) => c.status === 'done' || c.status === 'cancelled')

  return (
    <div className="space-y-8">
      {/* Summary bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="전체 예약" value={`${consultations.length}건`} color="gray" />
        <SummaryCard label="예약 접수" value={`${consultations.filter(c => c.status === 'pending').length}건`} color="amber" />
        <SummaryCard label="완료" value={`${consultations.filter(c => c.status === 'done').length}건`} color="emerald" />
        <SummaryCard label="취소" value={`${consultations.filter(c => c.status === 'cancelled').length}건`} color="red" />
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">예정 상담</h2>
          <div className="space-y-3">
            {upcoming.map((c) => (
              <ConsultationCard
                key={c.id}
                consultation={c}
                onCancel={() => handleCancel(c.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">지난 상담</h2>
          <div className="space-y-3">
            {past.map((c) => (
              <ConsultationCard
                key={c.id}
                consultation={c}
                onDelete={() => handleDelete(c.id)}
              />
            ))}
          </div>
        </section>
      )}

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-5 text-sm">
          <div className="font-semibold text-amber-900">예약 확정 안내</div>
          <p className="mt-1 text-amber-800">
            예약 접수 후 멘토 확인 시 카카오톡 또는 이메일로 확정 안내를 드립니다. (실제 서비스 오픈 전 mock 데이터)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function ConsultationCard({
  consultation: c,
  onCancel,
  onDelete,
}: {
  consultation: Consultation
  onCancel?: () => void
  onDelete?: () => void
}) {
  const statusCfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG['pending']!
  const StatusIcon = statusCfg.icon

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <a
                href={`/mentors/${c.mentorId}`}
                className="text-base font-semibold text-gray-900 hover:underline"
              >
                {c.mentorName} 멘토
              </a>
              <Badge variant={statusCfg.variant}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusCfg.label}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <span>주제 · {TOPIC_LABEL[c.topic] ?? c.topic}</span>
              {c.date && (
                <span className="inline-flex items-center gap-1 font-medium text-gray-700">
                  <Calendar className="h-3 w-3" />
                  {c.date} {c.time ?? ''}
                </span>
              )}
              <span>신청일 · {c.createdAt}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onCancel && c.status === 'pending' && (
              <button
                onClick={onCancel}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                예약 취소
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                title="삭제"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {c.question && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              상담 질문
            </div>
            <p className="line-clamp-2">{c.question}</p>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
          <span>{c.name} · {c.phone}</span>
          <a
            href={`/mentors/${c.mentorId}/book`}
            className="text-[var(--brand-primary)] hover:underline"
          >
            다시 예약하기 →
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: 'gray' | 'amber' | 'emerald' | 'red' }) {
  const colorClass = {
    gray:    'bg-gray-50 border-gray-200 text-gray-900',
    amber:   'bg-amber-50 border-amber-200 text-amber-900',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    red:     'bg-red-50 border-red-200 text-red-900',
  }[color]

  return (
    <div className={`rounded-xl border p-4 ${colorClass}`}>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  )
}
