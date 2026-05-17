import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchabridge', {
  title: '펀딩',
  description: '매장 운영 자금 및 크라우드 펀딩 라운드 목록.',
  path: '/funding',
})

import { RoundCard } from '@/components/round-card'
import { ROUNDS, daysUntil } from '@/lib/mock-data'

type SortKey = 'latest' | 'closing' | 'target'

interface FundingPageProps {
  searchParams: { sort?: string }
}

export default function FundingPage({ searchParams }: FundingPageProps) {
  const sort = (searchParams.sort ?? 'latest') as SortKey

  const fund = ROUNDS.filter((r) => r.type === 'store-fund' || r.type === 'crowd')

  const sorted = fund.slice().sort((a, b) => {
    if (sort === 'closing') return daysUntil(a.closeDate) - daysUntil(b.closeDate)
    if (sort === 'target') return b.targetAmount - a.targetAmount
    // latest — keep original order (mock data is newest first by convention)
    return 0
  })

  const totalAmount = fund.reduce((s, r) => s + r.targetAmount, 0)
  const totalStr =
    totalAmount >= 10000
      ? `${Math.round(totalAmount / 10000)}억`
      : `${totalAmount.toLocaleString()}만원`

  const minInvest = fund.length
    ? Math.min(...fund.map((r) => r.minInvestment))
    : 0
  const minInvestStr =
    minInvest >= 10000
      ? `${Math.round(minInvest / 10000)}억`
      : `${minInvest.toLocaleString()}만원`

  const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
    { key: 'latest', label: '최신순' },
    { key: 'closing', label: '마감임박순' },
    { key: 'target', label: '목표액 높은순' },
  ]

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">다점포 펀딩 + 크라우드</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            본사 직영점 2 ~ 5개 동시 오픈에 자금 참여하거나, 30만원부터 시작하는 크라우드펀딩.
            소액 투자자 대상.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {/* 펀딩 현황 */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700">전체 펀딩 현황</h2>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-black text-gray-900">{fund.length}건</div>
              <div className="text-xs text-gray-500">모집 중 라운드</div>
            </div>
            <div>
              <div className="text-xl font-black text-gray-900">{totalStr}</div>
              <div className="text-xs text-gray-500">총 목표 모집액</div>
            </div>
            <div>
              <div className="text-xl font-black text-gray-900">{minInvestStr}</div>
              <div className="text-xs text-gray-500">최소 참여 금액</div>
            </div>
          </div>
        </div>

        {/* 정렬 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">{fund.length}건</div>
          <div className="flex gap-2">
            {SORT_OPTIONS.map((opt) => (
              <a
                key={opt.key}
                href={`/funding?sort=${opt.key}`}
                className={
                  'rounded-md px-3 py-1 text-sm transition-colors ' +
                  (sort === opt.key
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100')
                }
              >
                {opt.label}
              </a>
            ))}
          </div>
        </div>

        {sorted.length === 0 ? (
          <p className="text-center text-sm text-gray-500">현재 모집 중인 라운드가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((r) => (
              <RoundCard key={r.id} round={r} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
