'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, Clock, Megaphone } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'

const STORAGE_KEY_CONTACTS  = 'openrun:contacts'
const STORAGE_KEY_INQUIRIES = 'openrun:inquiries'

interface ContactEntry {
  id: string
  role: 'hq' | 'franchisee'
  brandName: string
  contactName: string
  services: string[]
  budget: string
  timeline: string
  status?: string
  createdAt: string
}

interface CampaignInquiry {
  id: string
  service: string
  brandName: string
  status: string
  submittedAt: string
}

const BUDGET_LABEL: Record<string, string> = {
  'under-500': '500만원 이하',
  '500-1500': '500 ~ 1,500만원',
  '1500-3000': '1,500 ~ 3,000만원',
  '3000-plus': '3,000만원+',
  flexible: '유연하게 검토',
}

const TIMELINE_LABEL: Record<string, string> = {
  urgent: '2주 이내',
  soon: '1개월 이내',
  planning: '분기 단위',
  exploring: '검토 단계',
}

const CAMPAIGN_STAGES = [
  { key: '검토 중',   label: '의뢰 접수',    desc: '담당 매니저가 검토 중입니다.' },
  { key: '기획 중',   label: '기획 진행',    desc: '캠페인 기획안을 준비 중입니다.' },
  { key: '제안 완료', label: '제안서 발송',  desc: '기획안과 견적서를 발송했습니다.' },
  { key: '진행 중',   label: '캠페인 실행',  desc: '캠페인이 실행되고 있습니다.' },
  { key: '완료',      label: '완료·정산',    desc: '성과 보고서와 정산이 완료됩니다.' },
]

function getStageIdx(status: string): number {
  const idx = CAMPAIGN_STAGES.findIndex((s) => s.key === status)
  return idx >= 0 ? idx : 0
}

export function CampaignsClient() {
  const [contacts, setContacts]   = useState<ContactEntry[]>([])
  const [inquiries, setInquiries] = useState<CampaignInquiry[]>([])
  const [hydrated, setHydrated]   = useState(false)
  const [selected, setSelected]   = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_CONTACTS)
      if (raw) setContacts(JSON.parse(raw) as ContactEntry[])
    } catch { /* ignore */ }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_INQUIRIES)
      if (raw) setInquiries(JSON.parse(raw) as CampaignInquiry[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  // Merge: contacts + any matching inquiry status
  const merged = contacts.map((c) => {
    const inq = inquiries.find((i) => i.id === c.id || i.brandName === c.brandName)
    return { ...c, status: inq?.status ?? c.status ?? '검토 중' }
  })

  if (!hydrated) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2].map((i) => <div key={i} className="h-40 rounded-xl bg-gray-100" />)}
      </div>
    )
  }

  if (merged.length === 0) {
    return (
      <Card className="border-dashed border-gray-200">
        <CardContent className="p-12 text-center">
          <Megaphone className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-4 text-sm font-medium text-gray-600">아직 의뢰한 캠페인이 없습니다</p>
          <p className="mt-1 text-xs text-gray-400">
            간단한 폼을 작성하면 24시간 이내 기획안을 보내드립니다.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Megaphone className="h-4 w-4" />
            캠페인 의뢰하기
          </a>
        </CardContent>
      </Card>
    )
  }

  const active   = merged.filter((c) => c.status !== '완료' && c.status !== '취소')
  const done     = merged.filter((c) => c.status === '완료' || c.status === '취소')

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{merged.length}</div>
          <div className="mt-1 text-xs text-gray-500">전체 의뢰</div>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">{active.length}</div>
          <div className="mt-1 text-xs text-blue-700">진행 중</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-900">{done.filter(c => c.status === '완료').length}</div>
          <div className="mt-1 text-xs text-emerald-700">완료</div>
        </div>
      </div>

      {/* Active campaigns */}
      {active.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">진행 중인 캠페인</h2>
          <div className="space-y-4">
            {active.map((c) => (
              <CampaignCard
                key={c.id}
                contact={c}
                expanded={selected === c.id}
                onToggle={() => setSelected(selected === c.id ? null : c.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed campaigns */}
      {done.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">완료된 캠페인</h2>
          <div className="space-y-3">
            {done.map((c) => (
              <Card key={c.id} className="border-gray-200 opacity-75">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900">{c.brandName}</div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {c.role === 'hq' ? '본사' : '가맹점주'} · {BUDGET_LABEL[c.budget] ?? c.budget} · {c.createdAt}
                    </div>
                  </div>
                  <Badge variant={c.status === '완료' ? 'primary' : 'error'}>
                    {c.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <a
        href="/contact"
        className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-4 text-sm text-gray-500 transition-colors hover:border-[var(--brand-primary)]/40 hover:text-[var(--brand-primary)]"
      >
        <Megaphone className="h-4 w-4" />
        새 캠페인 의뢰하기
      </a>
    </div>
  )
}

function CampaignCard({
  contact,
  expanded,
  onToggle,
}: {
  contact: ContactEntry & { status: string }
  expanded: boolean
  onToggle: () => void
}) {
  const stageIdx = getStageIdx(contact.status)

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-5">
        {/* Header */}
        <button
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-gray-900">{contact.brandName}</span>
              <Badge variant="default">{contact.role === 'hq' ? '본사' : '가맹점주'}</Badge>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {BUDGET_LABEL[contact.budget] ?? contact.budget} · {TIMELINE_LABEL[contact.timeline] ?? contact.timeline} · {contact.createdAt}
            </div>
            {contact.services.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {contact.services.map((s) => (
                  <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="shrink-0 text-xs text-gray-400">{expanded ? '▲' : '▼'} 단계 보기</span>
        </button>

        {/* Progress timeline */}
        {expanded && (
          <div className="mt-5 border-t border-gray-100 pt-5">
            <div className="relative">
              {/* Connector line */}
              <div className="absolute left-3.5 top-4 h-full w-px -translate-x-1/2 bg-gray-200" />
              <div className="space-y-5">
                {CAMPAIGN_STAGES.map((stage, i) => {
                  const done = i < stageIdx
                  const current = i === stageIdx
                  return (
                    <div key={stage.key} className="relative flex items-start gap-4">
                      <div className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                        done    ? 'border-emerald-500 bg-emerald-500' :
                        current ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]' :
                                  'border-gray-200 bg-white'
                      }`}>
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        ) : current ? (
                          <Clock className="h-3.5 w-3.5 text-white" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-gray-300" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className={`text-sm font-semibold ${
                          done ? 'text-emerald-700' : current ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {stage.label}
                          {current && (
                            <span className="ml-2 rounded-full bg-[var(--brand-primary)]/10 px-2 py-0.5 text-xs text-[var(--brand-primary)]">
                              현재 단계
                            </span>
                          )}
                        </div>
                        {(done || current) && (
                          <p className="mt-0.5 text-xs text-gray-500">{stage.desc}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
