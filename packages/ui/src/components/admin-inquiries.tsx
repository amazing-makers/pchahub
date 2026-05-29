'use client'

import { useState, useTransition } from 'react'

/* ─── Types ─────────────────────────────────────────────────── */
export type InquiryStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

export interface InquiryRow {
  id: string
  platform: string
  type: string
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  status: InquiryStatus
  adminNote?: string | null
  metadata?: Record<string, unknown> | null
  createdAt: Date | string
  resolvedAt?: Date | string | null
}

interface AdminInquiriesProps {
  inquiries: InquiryRow[]
  platform: string
  /** Server action: update status & note */
  onUpdateStatus: (id: string, status: InquiryStatus, adminNote?: string) => Promise<void>
  /** Optional: active tab filter value */
  activeTab?: InquiryStatus | 'ALL'
}

/* ─── Status config ─────────────────────────────────────────── */
const STATUS_CONFIG: Record<InquiryStatus, { label: string; color: string; bg: string }> = {
  PENDING:     { label: '대기 중', color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200'  },
  IN_PROGRESS: { label: '처리 중', color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200'    },
  RESOLVED:    { label: '해결됨',  color: 'text-emerald-700',bg: 'bg-emerald-50 border-emerald-200'},
  CLOSED:      { label: '닫힘',    color: 'text-gray-500',   bg: 'bg-gray-50 border-gray-200'    },
}

const TABS: Array<{ key: InquiryStatus | 'ALL'; label: string }> = [
  { key: 'ALL',         label: '전체' },
  { key: 'PENDING',     label: '대기 중' },
  { key: 'IN_PROGRESS', label: '처리 중' },
  { key: 'RESOLVED',    label: '해결됨' },
  { key: 'CLOSED',      label: '닫힘' },
]

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

/* ─── Inline inquiry detail modal ──────────────────────────── */
function InquiryDetailModal({
  inquiry,
  onClose,
  onUpdate,
}: {
  inquiry: InquiryRow
  onClose: () => void
  onUpdate: (id: string, status: InquiryStatus, adminNote?: string) => Promise<void>
}) {
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status)
  const [note, setNote] = useState(inquiry.adminNote ?? '')
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    startTransition(async () => {
      await onUpdate(inquiry.id, status, note)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  const cfg = STATUS_CONFIG[status]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">{inquiry.subject}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <span>{inquiry.name}</span>
              <span>·</span>
              <span>{inquiry.email}</span>
              {inquiry.phone && <><span>·</span><span>{inquiry.phone}</span></>}
            </div>
          </div>
          <button onClick={onClose} className="ml-3 rounded-lg p-1 text-gray-400 hover:bg-gray-100 flex-shrink-0">
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-50">
              {inquiry.type}
            </span>
            {inquiry.metadata && Object.entries(inquiry.metadata).map(([k, v]) => (
              <span key={k} className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-gray-500 bg-gray-50">
                {k}: {String(v)}
              </span>
            ))}
            <span className="ml-auto text-xs text-gray-400">{fmtDate(inquiry.createdAt)}</span>
          </div>

          {/* Message */}
          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {inquiry.message}
          </div>

          {/* Status update */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">상태 변경</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(STATUS_CONFIG) as InquiryStatus[]).map((s) => {
                const c = STATUS_CONFIG[s]
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                      status === s ? `${c.bg} ${c.color}` : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Admin note */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">내부 메모</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="내부 처리 메모를 입력하세요 (고객에게 노출되지 않음)"
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 p-4">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
            {cfg.label}
          </span>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saved ? '저장됨 ✓' : isPending ? '저장 중…' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Panel ─────────────────────────────────────────────── */
export function AdminInquiriesPanel({
  inquiries,
  platform,
  onUpdateStatus,
  activeTab: initialTab = 'ALL',
}: AdminInquiriesProps) {
  const [tab, setTab] = useState<InquiryStatus | 'ALL'>(initialTab)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<InquiryRow | null>(null)

  const filtered = inquiries.filter((inq) => {
    if (tab !== 'ALL' && inq.status !== tab) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.subject.toLowerCase().includes(q)
      )
    }
    return true
  })

  const counts = Object.fromEntries(
    TABS.map(({ key }) => [
      key,
      key === 'ALL' ? inquiries.length : inquiries.filter((i) => i.status === key).length,
    ])
  ) as Record<InquiryStatus | 'ALL', number>

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">문의 관리</h1>
          <p className="mt-0.5 text-sm text-gray-500">{platform} · 총 {inquiries.length}건</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름·이메일·제목 검색"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 w-52"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={
              'flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ' +
              (tab === key
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700')
            }
          >
            {label}
            <span className={`rounded-full px-1.5 py-0.5 text-xs ${tab === key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-400">
          {search ? '검색 결과가 없습니다' : '문의가 없습니다'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
                <th className="px-4 py-3 text-left">이름</th>
                <th className="px-4 py-3 text-left">제목</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">유형</th>
                <th className="px-4 py-3 text-left">상태</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">접수일</th>
                <th className="px-4 py-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((inq) => {
                const cfg = STATUS_CONFIG[inq.status]
                return (
                  <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{inq.name}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[120px]">{inq.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="line-clamp-1 text-gray-800">{inq.subject}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{inq.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">
                      {fmtDate(inq.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelected(inq)}
                        className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        보기
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <InquiryDetailModal
          inquiry={selected}
          onClose={() => setSelected(null)}
          onUpdate={async (id, status, note) => {
            await onUpdateStatus(id, status, note)
            setSelected((prev) => prev ? { ...prev, status, adminNote: note ?? prev.adminNote } : null)
          }}
        />
      )}
    </div>
  )
}

/* ─── Icon ──────────────────────────────────────────────────── */
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
