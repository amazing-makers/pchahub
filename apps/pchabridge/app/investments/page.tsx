import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchabridge', {
  title: '투자 라운드',
  description: '프랜차이즈 투자 라운드 목록. 투자 유형·모집 상태별로 찾아보세요.',
  path: '/investments',
})

import { RoundCardWithWatch } from '@/components/round-card-with-watch'
import { ROUND_TYPE_LABEL, ROUNDS, type RoundType } from '@/lib/mock-data'

interface InvestmentsPageProps {
  searchParams: { type?: string; status?: string }
}

export default function InvestmentsPage({ searchParams }: InvestmentsPageProps) {
  const { type, status = 'open' } = searchParams
  let rounds = ROUNDS.slice()
  if (status === 'open') rounds = rounds.filter((r) => r.status === 'open' || r.status === 'closing-soon')
  if (status === 'completed') rounds = rounds.filter((r) => r.status === 'completed')
  if (type) rounds = rounds.filter((r) => r.type === type)

  const TYPES: Array<RoundType | ''> = ['', 'seed', 'series-a', 'series-b', 'crowd', 'store-fund']

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">투자 라운드</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Seed부터 Series B, 다점포 펀딩, 크라우드까지. 모집 중·임박·완료 라운드 모두 확인.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <a
                key={t || 'all'}
                href={t ? `/investments?type=${t}&status=${status}` : `/investments?status=${status}`}
                className={
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                  ((!t && !type) || type === t
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                }
              >
                {t === '' ? '전체 유형' : ROUND_TYPE_LABEL[t]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 핵심 지표 */}
      {(() => {
        const openRoundsList = ROUNDS.filter((r) => r.status === 'open' || r.status === 'closing-soon')
        const totalRounds = ROUNDS.length
        const openRounds = openRoundsList.length
        const totalAmountMan = openRoundsList.reduce((s, r) => s + r.targetAmount, 0)
        // targetAmount is in 만원; convert to 억 if >= 10000만원
        const totalAmountStr =
          totalAmountMan >= 10000
            ? `${Math.round(totalAmountMan / 10000)}억`
            : `${totalAmountMan.toLocaleString()}만원`
        const avgReturn = openRoundsList.length
          ? openRoundsList.reduce((s, r) => s + r.expectedAnnualROI, 0) / openRoundsList.length
          : 0
        const avgReturnStr = avgReturn % 1 === 0 ? String(avgReturn) : avgReturn.toFixed(1)
        return (
          <section className="border-b border-gray-100 bg-white">
            <div className="container mx-auto py-4">
              <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
                <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                  <span className="text-xl font-black tracking-tight text-gray-900">{totalRounds}건</span>
                  <span className="text-[11px] font-semibold text-gray-700">전체 라운드</span>
                  <span className="text-[10px] text-gray-400">누적 등록</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                  <span className="text-xl font-black tracking-tight text-gray-900">{openRounds}건</span>
                  <span className="text-[11px] font-semibold text-gray-700">모집 중</span>
                  <span className="text-[10px] text-gray-400">현재 진행</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                  <span className="text-xl font-black tracking-tight text-gray-900">{totalAmountStr}</span>
                  <span className="text-[11px] font-semibold text-gray-700">총 모집 목표액</span>
                  <span className="text-[10px] text-gray-400">모집 중 기준</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                  <span className="text-xl font-black tracking-tight text-gray-900">{avgReturnStr}%</span>
                  <span className="text-[11px] font-semibold text-gray-700">평균 기대 수익률</span>
                  <span className="text-[10px] text-gray-400">모집 중 라운드</span>
                </div>
              </div>
            </div>
          </section>
        )
      })()}

      <div className="container mx-auto py-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-gray-700">{rounds.length}건</div>
          <div className="flex gap-2 text-sm">
            {[
              { key: 'open', label: '모집 중' },
              { key: 'completed', label: '완료' },
              { key: 'all', label: '전체' },
            ].map((s) => (
              <a
                key={s.key}
                href={type ? `/investments?type=${type}&status=${s.key}` : `/investments?status=${s.key}`}
                className={
                  'rounded-md px-2 py-1 transition-colors ' +
                  (status === s.key
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100')
                }
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rounds.map((r) => (
            <RoundCardWithWatch key={r.id} round={r} />
          ))}
        </div>
      </div>
    </main>
  )
}
