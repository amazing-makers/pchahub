'use client'

import { useEffect, useState } from 'react'
import { Building2, FileText, PencilLine } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'

interface QuoteEntry {
  id: string
  category: string
  area: string
  region: string
  district: string
  budgetLevel: string
  timeline: string
  preselectedContractor: string
  contactName: string
  status: string
  createdAt: string
}

interface ContractorEntry {
  id: string
  companyName: string
  region: string
  managerName: string
  status: string
  createdAt: string
}

const BUDGET_LABEL: Record<string, string> = {
  low: '평당 70-90만원',
  mid: '평당 90-120만원',
  high: '평당 120-150만원',
  top: '평당 150만원+',
  flex: '비교 희망',
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
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
  const [quotes, setQuotes] = useState<QuoteEntry[]>([])
  const [applications, setApplications] = useState<ContractorEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('gongganhansu:quotes')
      if (raw) setQuotes(JSON.parse(raw) as QuoteEntry[])
    } catch { /* ignore */ }
    try {
      const raw = window.localStorage.getItem('gongganhansu:contractor-applications')
      if (raw) setApplications(JSON.parse(raw) as ContractorEntry[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 animate-pulse">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard icon={FileText} label="견적 요청" value={`${quotes.length}건`} />
        <StatCard icon={PencilLine} label="시공사 등록 신청" value={`${applications.length}건`} />
      </div>

      {/* Quote requests */}
      <section>
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">견적 요청 내역</h2>
        {quotes.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="py-10 text-center text-sm text-gray-400">
              아직 견적 요청 내역이 없습니다.{' '}
              <a href="/quote" className="font-medium text-[var(--brand-primary)] hover:underline">
                견적 요청하기 →
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {quotes.map((item) => (
              <Card key={item.id} className="border-gray-200">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      {item.region} {item.district} · {item.area}평 인테리어
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {item.category} · {BUDGET_LABEL[item.budgetLevel] ?? item.budgetLevel} ·{' '}
                      {item.createdAt}
                    </div>
                  </div>
                  <Badge variant="warning">접수 완료</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Contractor applications */}
      {applications.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">시공사 등록 신청</h2>
          <div className="space-y-3">
            {applications.map((item) => (
              <Card key={item.id} className="border-gray-200">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900">{item.companyName}</div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {item.region} · 담당자 {item.managerName} · {item.createdAt}
                    </div>
                  </div>
                  <Badge variant="warning">심사 중</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
