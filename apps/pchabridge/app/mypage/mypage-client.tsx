'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Briefcase, Calendar, FileText, PlusCircle, TrendingUp } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { brandById, daysUntil, progressPercent, ROUND_TYPE_LABEL, roundById } from '@/lib/mock-data'

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

interface InvestmentRegEntry {
  id: string
  brandName: string
  category: string
  roundType: string
  targetAmount: string
  createdAt: string
  status: string
}

interface WatchedRound {
  roundId: string
  addedAt: string
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
  const [investmentRegs, setInvestmentRegs] = useState<InvestmentRegEntry[]>([])
  const [watchlist, setWatchlist] = useState<WatchedRound[]>([])
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
    try {
      const raw = window.localStorage.getItem('pchabridge:investment-registrations')
      if (raw) setInvestmentRegs(JSON.parse(raw) as InvestmentRegEntry[])
    } catch { /* ignore */ }
    try {
      const raw = window.localStorage.getItem('pchabridge:watchlist')
      if (raw) setWatchlist(JSON.parse(raw) as WatchedRound[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  const totalAmount = interests.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0)

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard icon={TrendingUp} label="투자 신청" value={`${interests.length}건`} />
        <StatCard icon={FileText} label="IR 자료 신청" value={`${irRequests.length}건`} />
        <StatCard icon={Briefcase} label="M&A 문의/자문" value={`${maRequests.length + maConsults.length}건`} />
        <StatCard icon={PlusCircle} label="투자 유치 등록" value={`${investmentRegs.length}건`} />
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

      {/* 투자 유치 등록 내역 */}
      {investmentRegs.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">투자 유치 등록 신청 내역</h2>
          <div className="space-y-3">
            {investmentRegs.map((item) => (
              <Card key={item.id} className="border-gray-200">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900">{item.brandName}</div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {item.category} · {item.roundType} · 목표 {item.targetAmount} · {item.createdAt}
                    </div>
                  </div>
                  <Badge variant="warning">검토 중</Badge>
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

      {/* 관심 투자 라운드 */}
      <section>
        <h2 className="mb-4 text-h4 font-semibold text-gray-900 inline-flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-amber-500" />
          관심 투자 라운드
        </h2>
        {watchlist.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="py-10 text-center text-sm text-gray-400">
              관심 라운드가 없습니다.{' '}
              <a href="/investments" className="font-medium text-[var(--brand-primary)] hover:underline">
                라운드 둘러보기 →
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {watchlist.map((entry) => {
              const round = roundById(entry.roundId)
              if (!round) return null
              const brand = brandById(round.brandId)
              const progress = progressPercent(round)
              const days = daysUntil(round.closeDate)
              return (
                <Card key={entry.roundId} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <a
                          href={`/investments/${round.id}`}
                          className="text-sm font-semibold text-gray-900 hover:underline"
                        >
                          {brand?.name ?? '브랜드'} · {ROUND_TYPE_LABEL[round.type]}
                        </a>
                        <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{round.hook}</p>
                      </div>
                      <span className="shrink-0 text-xs text-gray-400">{entry.addedAt}</span>
                    </div>
                    {/* mini progress */}
                    <div className="mt-3">
                      <div className="flex items-end justify-between text-xs">
                        <span className="text-gray-500">
                          {formatNumber(round.currentAmount)}만 / {formatNumber(round.targetAmount)}만
                        </span>
                        <span className="font-semibold" style={{ color: 'var(--brand-primary)' }}>
                          {progress}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${progress}%`, background: 'var(--brand-primary)' }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-0.5">
                        <TrendingUp className="h-3 w-3" />
                        +{round.expectedAnnualROI}% ROI
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <Calendar className="h-3 w-3" />
                        {days > 0 ? `${days}일 남음` : '마감'}
                      </span>
                      <span>최소 {formatNumber(round.minInvestment)}만</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
