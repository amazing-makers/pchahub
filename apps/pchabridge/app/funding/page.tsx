import type { Metadata } from 'next'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchabridge', {
  title: '펀딩',
  description: '매장 운영 자금 및 크라우드 펀딩 라운드 목록.',
  path: '/funding',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차브릿지', url: 'https://pchabridge.amakers.co.kr' },
    { name: '투자 라운드', url: 'https://pchabridge.amakers.co.kr/funding' },
  ],
})

import { Search } from 'lucide-react'
import { RoundCardWithWatch } from '@/components/round-card-with-watch'
import { BRANDS, ROUNDS, daysUntil } from '@/lib/mock-data'

type SortKey = 'latest' | 'closing' | 'target'

interface FundingPageProps {
  searchParams: { sort?: string; q?: string }
}

export default function FundingPage({ searchParams }: FundingPageProps) {
  const sort = (searchParams.sort ?? 'latest') as SortKey
  const { q } = searchParams
  const needle = q?.toLowerCase().trim() ?? ''

  // All funding rounds (for stats panel — unaffected by search)
  const allFund = ROUNDS.filter((r) => r.type === 'store-fund' || r.type === 'crowd')

  // Filtered by search query
  let fund = allFund
  if (needle) {
    fund = fund.filter(
      (r) =>
        r.hook.toLowerCase().includes(needle) ||
        r.tags.some((t) => t.toLowerCase().includes(needle)) ||
        (BRANDS.find((b) => b.id === r.brandId)?.name ?? '').toLowerCase().includes(needle),
    )
  }

  const sorted = fund.slice().sort((a, b) => {
    if (sort === 'closing') return daysUntil(a.closeDate) - daysUntil(b.closeDate)
    if (sort === 'target') return b.targetAmount - a.targetAmount
    // latest — keep original order (mock data is newest first by convention)
    return 0
  })

  const totalAmount = allFund.reduce((s, r) => s + r.targetAmount, 0)
  const totalStr =
    totalAmount >= 10000
      ? `${Math.round(totalAmount / 10000)}억`
      : `${totalAmount.toLocaleString()}만원`

  const minInvest = allFund.length ? Math.min(...allFund.map((r) => r.minInvestment)) : 0
  const minInvestStr =
    minInvest >= 10000
      ? `${Math.round(minInvest / 10000)}억`
      : `${minInvest.toLocaleString()}만원`

  const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
    { key: 'latest', label: '최신순' },
    { key: 'closing', label: '마감임박순' },
    { key: 'target', label: '목표액 높은순' },
  ]

  const listJsonLd = buildItemListJsonLd({
    url: 'https://pchabridge.amakers.co.kr/funding',
    items: sorted.slice(0, 20).map((r) => ({ name: r.hook, url: `https://pchabridge.amakers.co.kr/investments/${r.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">다점포 펀딩 + 크라우드</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            본사 직영점 2 ~ 5개 동시 오픈에 자금 참여하거나, 30만원부터 시작하는 크라우드펀딩.
            소액 투자자 대상.
          </p>
          <form method="GET" action="/funding" className="mt-4 flex max-w-md gap-2">
            <input type="hidden" name="sort" value={sort} />
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="브랜드명, 태그 검색…"
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              검색
            </button>
            {q && (
              <a
                href={`/funding?sort=${sort}`}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>
        </div>
      </section>

      {/* 통계 스트립 */}
      {!q && (
        <div className="border-b border-gray-100 bg-white">
          <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {[
              { value: `${allFund.length}건`, label: '모집 중 라운드' },
              { value: totalStr, label: '총 목표 모집액' },
              { value: minInvestStr, label: '최소 참여 금액' },
              { value: `${allFund.filter((r) => r.type === 'crowd').length}건`, label: '크라우드 펀딩' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-4">
                <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto py-8">
        {/* 정렬 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            {q ? (
              <>
                <span className="font-medium text-gray-900">&ldquo;{q}&rdquo;</span> 검색 결과{' '}
                {fund.length}건
              </>
            ) : (
              <>{fund.length}건</>
            )}
          </div>
          <div className="flex gap-2">
            {SORT_OPTIONS.map((opt) => (
              <a
                key={opt.key}
                href={`/funding?sort=${opt.key}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
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
          <p className="text-center text-sm text-gray-500">
            {q ? `"${q}" 검색 결과가 없습니다.` : '현재 모집 중인 라운드가 없습니다.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((r) => (
              <RoundCardWithWatch key={r.id} round={r} />
            ))}
          </div>
        )}
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">펀딩 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 크라우드펀딩·다점포펀드·투자 기회를 메일로 먼저 알려드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
                placeholder="이메일 주소"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                구독하기
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}
