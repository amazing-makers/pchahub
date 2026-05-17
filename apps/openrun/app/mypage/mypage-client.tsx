'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Megaphone } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

interface ContactEntry {
  id: string
  role: 'hq' | 'franchisee'
  brandName: string
  contactName: string
  services: string[]
  budget: string
  timeline: string
  status: string
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

function StatCard({ icon: Icon, label, value }: { icon: typeof Megaphone; label: string; value: string }) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <Icon className="h-4 w-4 text-gray-400" />
        <div className="mt-2 text-xs text-gray-500">{label}</div>
        <div className="mt-0.5 text-base font-semibold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  )
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  '검토 중': { label: '검토 중', className: 'bg-amber-100 text-amber-700' },
  '진행 중': { label: '진행 중', className: 'bg-blue-100 text-blue-700' },
  '완료':    { label: '완료',    className: 'bg-emerald-100 text-emerald-700' },
}

function InquiryBadge({ status }: { status: string }) {
  const cfg = STATUS_BADGE[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

export function MyPageClient() {
  const [contacts, setContacts] = useState<ContactEntry[]>([])
  const [inquiries, setInquiries] = useState<CampaignInquiry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('openrun:contacts')
      if (raw) setContacts(JSON.parse(raw) as ContactEntry[])
    } catch { /* ignore */ }
    try {
      const raw = window.localStorage.getItem('openrun:inquiries')
      if (raw) setInquiries(JSON.parse(raw) as CampaignInquiry[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  // Build a quick status lookup by id for coloring the contacts list
  const statusById = Object.fromEntries(inquiries.map((q) => [q.id, q.status]))

  if (!hydrated) {
    return (
      <div className="h-24 rounded-xl bg-gray-100 animate-pulse" />
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard icon={Megaphone} label="캠페인 의뢰" value={`${contacts.length}건`} />
      </div>

      {/* Contact submissions */}
      <section>
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">캠페인 의뢰 내역</h2>
        {contacts.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="py-10 text-center text-sm text-gray-400">
              아직 캠페인 의뢰 내역이 없습니다.{' '}
              <a href="/contact" className="font-medium text-[var(--brand-primary)] hover:underline">
                의뢰 시작하기 →
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {contacts.map((item) => (
              <Card key={item.id} className="border-gray-200">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900">{item.brandName}</div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {item.role === 'hq' ? '본사' : '가맹점주'} ·{' '}
                      {BUDGET_LABEL[item.budget] ?? item.budget} ·{' '}
                      {TIMELINE_LABEL[item.timeline] ?? item.timeline} · {item.createdAt}
                    </div>
                    {item.services.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.services.map((s) => (
                          <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <InquiryBadge status={statusById[item.id] ?? '검토 중'} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Campaign inquiry tracking (openrun:inquiries) */}
      <section>
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">진행 상태 추적</h2>
        {inquiries.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="py-10 text-center text-sm text-gray-400">
              접수된 의뢰가 없습니다.{' '}
              <a href="/contact" className="font-medium text-[var(--brand-primary)] hover:underline">
                의뢰하기 →
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {inquiries.map((item) => (
              <Card key={item.id} className="border-gray-200">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900">{item.brandName}</div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {item.service || '-'} · {item.submittedAt}
                    </div>
                  </div>
                  <InquiryBadge status={item.status} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
