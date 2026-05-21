import type { Metadata } from 'next'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchabridge', {
  title: 'M&A 매물',
  description: '프랜차이즈 인수·합병 매물 목록. 브랜드·지역별로 찾아보세요.',
  path: '/ma',
})

import { Search } from 'lucide-react'
import { MACard } from '@/components/ma-card'
import { BRANDS, MA_LISTINGS } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'
import { MaWatchButton } from './ma-watch-button'

/** Deal-type label derived from each listing's includes / rationale */
const DEAL_TYPE_MAP: Record<string, string> = {
  ma1: '사업 양도',
  ma2: '지분 매각',
  ma3: '사업 양도',
}

/** All unique deal types present in the data */
const DEAL_TYPES = Array.from(new Set(Object.values(DEAL_TYPE_MAP)))

interface MAPageProps {
  searchParams: { dealType?: string; q?: string }
}

export default function MAPage({ searchParams }: MAPageProps) {
  const { dealType, q } = searchParams
  const needle = q?.toLowerCase().trim() ?? ''

  let filtered = dealType
    ? MA_LISTINGS.filter((m) => DEAL_TYPE_MAP[m.id] === dealType)
    : MA_LISTINGS

  if (needle) {
    filtered = filtered.filter((m) => {
      const brand = BRANDS.find((b) => b.id === m.brandId)
      return (
        m.rationale.toLowerCase().includes(needle) ||
        (brand?.name.toLowerCase().includes(needle) ?? false) ||
        (brand?.categoryLabel.toLowerCase().includes(needle) ?? false) ||
        (DEAL_TYPE_MAP[m.id] ?? '').toLowerCase().includes(needle) ||
        m.includes.some((s) => s.toLowerCase().includes(needle))
      )
    })
  }

  const open = filtered.filter((m) => m.status === 'open')
  const underNeg = filtered.filter((m) => m.status === 'under-negotiation')
  const totalStores = MA_LISTINGS.reduce((s, m) => s + m.storeCount, 0)
  const avgPrice = MA_LISTINGS.length
    ? Math.round(MA_LISTINGS.reduce((s, m) => s + m.askingPrice, 0) / MA_LISTINGS.length)
    : 0

  const listJsonLd = buildItemListJsonLd({
    url: 'https://pchabridge.amakers.co.kr/ma',
    items: filtered.slice(0, 20).map((m) => ({ name: m.rationale, url: `https://pchabridge.amakers.co.kr/ma/${m.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">M&A 매물</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            매각 진행 중인 본사 매물. 상세 자료는 NDA 후 공개됩니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-xs text-gray-500">공개 매물</span>
              <div className="font-bold text-gray-900">{MA_LISTINGS.length}건</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">모집 중</span>
              <div className="font-bold text-gray-900">{open.length}건</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">총 매장 수</span>
              <div className="font-bold text-gray-900">{formatNumber(totalStores)}개</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">평균 매각가</span>
              <div className="font-bold text-gray-900">{formatNumber(avgPrice)}만원</div>
            </div>
          </div>

          {/* Search bar */}
          <form method="GET" action="/ma" className="mt-5 flex max-w-md gap-2">
            {dealType && <input type="hidden" name="dealType" value={dealType} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="브랜드명, 업종, 거래 유형 검색…"
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
                href={dealType ? `/ma?dealType=${encodeURIComponent(dealType)}` : '/ma'}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>

          {/* Deal-type filter chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={q ? `/ma?q=${encodeURIComponent(q)}` : '/ma'}
              className={
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                (!dealType
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
              }
            >
              전체 ({MA_LISTINGS.length})
            </a>
            {DEAL_TYPES.map((t) => {
              const count = MA_LISTINGS.filter((m) => DEAL_TYPE_MAP[m.id] === t).length
              return (
                <a
                  key={t}
                  href={`/ma?dealType=${encodeURIComponent(t)}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                  className={
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                    (dealType === t
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }
                >
                  {t} ({count})
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-8">
        {q && (
          <div className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">&ldquo;{q}&rdquo;</span> 검색 결과{' '}
            {filtered.length}건
          </div>
        )}
        {open.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">공개 매물</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {open.map((m) => (
                <div key={m.id} className="relative">
                  <MACard listing={m} />
                  <div className="absolute right-2 top-2 z-10">
                    <MaWatchButton listingId={m.id} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {underNeg.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">협상 중인 매물</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {underNeg.map((m) => (
                <div key={m.id} className="relative">
                  <MACard listing={m} />
                  <div className="absolute right-2 top-2 z-10">
                    <MaWatchButton listingId={m.id} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {open.length === 0 && underNeg.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-sm font-medium text-gray-500">
            {q ? `"${q}" 검색 결과가 없습니다` : '해당 거래 유형의 매물이 없습니다.'}
          </p>
            <a
              href="/ma"
              className="mt-4 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              전체 매물 보기
            </a>
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">M&amp;A 매물 알림을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 M&A 매물·투자 기회·시장 동향을 메일로 알려드립니다.</p>
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
