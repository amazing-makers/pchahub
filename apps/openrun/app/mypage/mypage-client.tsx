'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Megaphone } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'

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

export function MyPageClient() {
  const [contacts, setContacts] = useState<ContactEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('openrun:contacts')
      if (raw) setContacts(JSON.parse(raw) as ContactEntry[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

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
                  <Badge variant="warning">접수 완료</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
