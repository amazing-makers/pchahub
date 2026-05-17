'use client'

import { useEffect, useState } from 'react'
import { Bookmark, BookmarkCheck, Building2, FileText, PencilLine } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { PORTFOLIO, portfolioById, CATEGORIES, CONTRACTORS, contractorById } from '@/lib/mock-data'
import type { MockPortfolioItem, MockContractor } from '@/lib/mock-data'

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
  const [savedPortfolios, setSavedPortfolios] = useState<MockPortfolioItem[]>([])
  const [savedContractors, setSavedContractors] = useState<MockContractor[]>([])
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
    try {
      const raw = window.localStorage.getItem('gongganhansu:savedPortfolios')
      const ids: string[] = raw ? JSON.parse(raw) : []
      const items = ids.map((id) => portfolioById(id)).filter((p): p is MockPortfolioItem => p !== undefined)
      setSavedPortfolios(items)
    } catch { /* ignore */ }
    try {
      const raw = window.localStorage.getItem('gongganhansu:savedContractors')
      const ids: string[] = raw ? JSON.parse(raw) : []
      const items = ids.map((id) => contractorById(id)).filter((c): c is MockContractor => c !== undefined)
      setSavedContractors(items)
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={FileText} label="견적 요청" value={`${quotes.length}건`} />
        <StatCard icon={PencilLine} label="시공사 등록 신청" value={`${applications.length}건`} />
        <StatCard icon={Bookmark} label="저장한 사례" value={`${savedPortfolios.length}건`} />
        <StatCard icon={BookmarkCheck} label="저장한 시공사" value={`${savedContractors.length}건`} />
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

      {/* Saved portfolios */}
      {savedPortfolios.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">저장한 시공 사례</h2>
          <div className="space-y-3">
            {savedPortfolios.map((item) => {
              const cat = CATEGORIES.find((c) => c.key === item.category)
              return (
                <a key={item.id} href={`/gallery/${item.id}`} className="block">
                  <Card className="border-gray-200 transition-shadow hover:shadow-md">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                        <div className="mt-0.5 text-xs text-gray-500">
                          {cat?.label ?? item.category} · {item.area}평 · 예산 {item.budget.toLocaleString()}만
                        </div>
                      </div>
                      <Bookmark className="h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
                    </CardContent>
                  </Card>
                </a>
              )
            })}
          </div>
        </section>
      )}

      {/* Saved contractors */}
      {savedContractors.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">저장한 시공사</h2>
          <div className="space-y-3">
            {savedContractors.map((c) => {
              const specialtyLabels = c.specialties
                .map((s) => CATEGORIES.find((cat) => cat.key === s)?.label ?? s)
                .join(' · ')
              return (
                <a key={c.id} href={`/contractors/${c.id}`} className="block">
                  <Card className="border-gray-200 transition-shadow hover:shadow-md">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                        <div className="mt-0.5 text-xs text-gray-500">
                          {c.region} · {specialtyLabels}
                        </div>
                      </div>
                      <BookmarkCheck className="h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
                    </CardContent>
                  </Card>
                </a>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
