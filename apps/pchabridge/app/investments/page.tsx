import type { Metadata } from 'next'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchabridge', {
  title: '투자 라운드',
  description: '프랜차이즈 투자 라운드 목록. 투자 유형·모집 상태별로 찾아보세요.',
  path: '/investments',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차브릿지', url: 'https://pchabridge.amakers.co.kr' },
    { name: '투자 현황', url: 'https://pchabridge.amakers.co.kr/investments' },
  ],
})

import { ArrowRight, BookOpen, MapPin, Search, Store } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { RoundCardWithWatch } from '@/components/round-card-with-watch'
import { BRANDS, ROUND_TYPE_LABEL, ROUNDS, type RoundType } from '@/lib/mock-data'

const SORT_OPTIONS = [
  { key: 'featured',  label: '추천 순' },
  { key: 'roi',       label: '수익률 높은 순' },
  { key: 'deadline',  label: '마감 임박 순' },
  { key: 'amount',    label: '목표금액 적은 순' },
  { key: 'progress',  label: '달성률 높은 순' },
] as const
type SortKey = typeof SORT_OPTIONS[number]['key']

interface InvestmentsPageProps {
  searchParams: { type?: string; status?: string; q?: string; sort?: string }
}

export default function InvestmentsPage({ searchParams }: InvestmentsPageProps) {
  const { type, status = 'open', q, sort = 'featured' } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'featured') as SortKey
  const needle = q?.toLowerCase().trim() ?? ''
  let rounds = ROUNDS.slice()
  if (status === 'open') rounds = rounds.filter((r) => r.status === 'open' || r.status === 'closing-soon')
  if (status === 'completed') rounds = rounds.filter((r) => r.status === 'completed')
  if (type) rounds = rounds.filter((r) => r.type === type)
  if (needle) {
    rounds = rounds.filter(
      (r) =>
        r.hook.toLowerCase().includes(needle) ||
        r.tags.some((t) => t.toLowerCase().includes(needle)) ||
        (BRANDS.find((b) => b.id === r.brandId)?.name ?? '').toLowerCase().includes(needle),
    )
  }

  // 정렬 적용
  rounds = [...rounds].sort((a, b) => {
    switch (activeSort) {
      case 'roi':
        return b.expectedAnnualROI - a.expectedAnnualROI
      case 'deadline':
        return a.closeDate.localeCompare(b.closeDate)
      case 'amount':
        return a.targetAmount - b.targetAmount
      case 'progress': {
        const pa = Math.min(100, (a.currentAmount / Math.max(a.targetAmount, 1)) * 100)
        const pb = Math.min(100, (b.currentAmount / Math.max(b.targetAmount, 1)) * 100)
        return pb - pa
      }
      default: // featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    }
  })

  const TYPES: Array<RoundType | ''> = ['', 'seed', 'series-a', 'series-b', 'crowd', 'store-fund']

  const listJsonLd = buildItemListJsonLd({
    url: 'https://pchabridge.amakers.co.kr/investments',
    items: rounds.slice(0, 20).map((r) => ({ name: r.hook, url: `https://pchabridge.amakers.co.kr/investments/${r.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">투자 라운드</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Seed부터 Series B, 다점포 펀딩, 크라우드까지. 모집 중·임박·완료 라운드 모두 확인.
          </p>

          {/* Search bar */}
          <form method="GET" action="/investments" className="mt-5 flex max-w-md gap-2">
            {type && <input type="hidden" name="type" value={type} />}
            {status !== 'open' && <input type="hidden" name="status" value={status} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                aria-label="브랜드, 라운드 키워드 검색…"
                placeholder="브랜드, 라운드 키워드 검색…"
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
                href={type ? `/investments?type=${type}&status=${status}` : `/investments?status=${status}`}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <a
                key={t || 'all'}
                href={t ? `/investments?type=${t}&status=${status}${q ? `&q=${encodeURIComponent(q)}` : ''}` : `/investments?status=${status}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
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
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="flex-1 text-sm text-gray-700">
            {q ? (
              <>
                <span className="font-medium text-gray-900">&ldquo;{q}&rdquo;</span> 검색 결과{' '}
                {rounds.length}건
              </>
            ) : (
              <>{rounds.length}건</>
            )}
          </div>
          {/* 상태 필터 */}
          <div className="flex gap-2 text-sm">
            {[
              { key: 'open', label: '모집 중' },
              { key: 'completed', label: '완료' },
              { key: 'all', label: '전체' },
            ].map((s) => (
              <a
                key={s.key}
                href={
                  type
                    ? `/investments?type=${type}&status=${s.key}${activeSort !== 'featured' ? `&sort=${activeSort}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`
                    : `/investments?status=${s.key}${activeSort !== 'featured' ? `&sort=${activeSort}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`
                }
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
          {/* 정렬 */}
          <div className="flex flex-wrap gap-1.5">
            {SORT_OPTIONS.map((o) => (
              <a
                key={o.key}
                href={`/investments?${new URLSearchParams({
                  ...(type ? { type } : {}),
                  status,
                  sort: o.key,
                  ...(q ? { q } : {}),
                }).toString()}`}
                className={
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors ' +
                  (activeSort === o.key
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300')
                }
              >
                {o.label}
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

      {/* amakers 생태계 크로스링크 */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-6">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">amakers에서 더 알아보기</div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <a href="https://pchahub.amakers.co.kr/brands" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-indigo-500" />가맹 브랜드 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themyungdang.amakers.co.kr/listings" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-500" />창업 매물 찾기</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themanual.amakers.co.kr/courses" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-amber-500" />창업 운영 강의</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://jangsanote.amakers.co.kr" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-rose-500" />점주 커뮤니티</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">투자 인사이트를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 투자 라운드·본사 모집 소식·시장 동향을 메일로 알려드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
                aria-label="이메일 주소"
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
