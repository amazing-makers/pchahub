'use client'

import { useEffect, useState } from 'react'
import { Briefcase, FileText, TrendingUp } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'

interface InterestEntry {
  id: string
  roundId: string
  brandName: string
  amount: string
  investorType: string
  status: string
  createdAt: string
}

interface MaEntry {
  id: string
  listingId: string
  brandName: string
  company: string
  capital: string
  investorType: string
  status: string
  createdAt: string
}

interface IrEntry {
  id: string
  roundId: string
  brandName: string
  name: string
  email: string
  createdAt: string
  status: string
}

interface MaConsultEntry {
  id: string
  listingId: string
  brandName: string
  name: string
  role: string
  createdAt: string
  status: string
}

const INVESTOR_TYPE_LABEL: Record<string, string> = {
  individual: '개인 투자자',
  angel: '엔젤 투자자',
  vc: 'VC/기관',
  'franchise-owner': '점주 (다점포)',
  pe: 'PE / 사모펀드',
  strategic: '전략적 투자자',
  operator: '다점포 운영자',
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Briefcase; label: string; value: string }) {
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
  const [interests, setInterests] = useState<InterestEntry[]>([])
  const [maRequests, setMaRequests] = useState<MaEntry[]>([])
  const [irRequests, setIrRequests] = useState<IrEntry[]>([])
  const [maConsults, setMaConsults] = useState<MaConsultEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('pchabridge:interests')
      if (raw) setInterests(JSON.parse(raw) as InterestEntry[])
    } catch { /* ignore */ }
    try {
      const raw = window.localStorage.getItem('pchabridge:ma-requests')
      if (raw) setMaRequests(JSON.parse(raw) as MaEntry[])
    } catch { /* ignore */ }
    try {
      const raw = window.localStorage.getItem('pchabridge:ir-requests')
      if (raw) setIrRequests(JSON.parse(raw) as IrEntry[])
    } catch { /* ignore */ }
    try {
      const raw = window.localStorage.getItem('pchabridge:ma-consults')
      if (raw) setMaConsults(JSON.parse(raw) as MaConsultEntry[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  const totalAmount = interests.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0)

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={TrendingUp} label="투자 신청" value={`${interests.length}건`} />
        <StatCard icon={FileText} label="IR 자료 신청" value={`${irRequests.length}건`} />
        <StatCard icon={Briefcase} label="M&A 문의/자문" value={`${maRequests.length + maConsults.length}건`} />
        <StatCard
          icon={FileText}
          label="신청 금액 합계"
          value={totalAmount > 0 ? `${formatNumber(totalAmount)}만` : '-'}
        />
      </div>

      {/* Investment applications */}
      <section>
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">투자 신청 내역</h2>
        {interests.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="py-10 text-center text-sm text-gray-400">
              아직 투자 신청 내역이 없습니다.{' '}
              <a href="/investments" className="font-medium text-[var(--brand-primary)] hover:underline">
                라운드 둘러보기 →
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {interests.map((item) => (
              <Card key={item.id} className="border-gray-200">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <a
                      href={`/investments/${item.roundId}`}
                      className="text-sm font-semibold text-gray-900 hover:underline"
                    >
                      {item.brandName}
                    </a>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {INVESTOR_TYPE_LABEL[item.investorType] ?? item.investorType} ·{' '}
                      {formatNumber(parseFloat(item.amount))}만원 · {item.createdAt}
                    </div>
                  </div>
                  <Badge variant="warning">접수 완료</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* M&A requests */}
      <section>
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">M&A NDA 요청 내역</h2>
        {maRequests.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="py-10 text-center text-sm text-gray-400">
              아직 M&A 문의 내역이 없습니다.{' '}
              <a href="/ma" className="font-medium text-[var(--brand-primary)] hover:underline">
                M&A 매물 보기 →
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {maRequests.map((item) => (
              <Card key={item.id} className="border-gray-200">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <a
                      href={`/ma/${item.listingId}`}
                      className="text-sm font-semibold text-gray-900 hover:underline"
                    >
                      {item.brandName}
                    </a>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {INVESTOR_TYPE_LABEL[item.investorType] ?? item.investorType}
                      {item.company ? ` · ${item.company}` : ''} · {item.createdAt}
                    </div>
                  </div>
                  <Badge variant="warning">NDA 요청</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* IR 자료 신청 내역 */}
      {irRequests.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">IR 자료 신청 내역</h2>
          <div className="space-y-3">
            {irRequests.map((item) => (
              <Card key={item.id} className="border-gray-200">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <a
                      href={`/investments/${item.roundId}`}
                      className="text-sm font-semibold text-gray-900 hover:underline"
                    >
                      {item.brandName} IR 자료
                    </a>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {item.email} · {item.createdAt}
                    </div>
                  </div>
                  <Badge variant="default">발송 대기</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* M&A 자문 신청 내역 */}
      {maConsults.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">M&A 자문 신청 내역</h2>
          <div className="space-y-3">
            {maConsults.map((item) => (
              <Card key={item.id} className="border-gray-200">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <a
                      href={`/ma/${item.listingId}`}
                      className="text-sm font-semibold text-gray-900 hover:underline"
                    >
                      {item.brandName} 자문
                    </a>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {item.role ? `${item.role} · ` : ''}{item.createdAt}
                    </div>
                  </div>
                  <Badge variant="warning">검토 중</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
