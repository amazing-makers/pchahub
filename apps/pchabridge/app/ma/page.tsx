import type { Metadata } from 'next'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchabridge', {
  title: 'M&A 매물',
  description: '프랜차이즈 인수·합병 매물 목록. 브랜드·지역별로 찾아보세요.',
  path: '/ma',
})

import { MACard } from '@/components/ma-card'
import { MA_LISTINGS } from '@/lib/mock-data'
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
  searchParams: { dealType?: string }
}

export default function MAPage({ searchParams }: MAPageProps) {
  const { dealType } = searchParams

  const filtered = dealType
    ? MA_LISTINGS.filter((m) => DEAL_TYPE_MAP[m.id] === dealType)
    : MA_LISTINGS

  const open = filtered.filter((m) => m.status === 'open')
  const underNeg = filtered.filter((m) => m.status === 'under-negotiation')

  const listJsonLd = buildItemListJsonLd({
    url: 'https://pchabridge.kr/ma',
    items: filtered.slice(0, 20).map((m) => ({ name: m.rationale, url: `https://pchabridge.kr/ma/${m.id}` })),
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

          {/* Deal-type filter chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="/ma"
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
                  href={`/ma?dealType=${encodeURIComponent(t)}`}
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
            <p className="text-sm font-medium text-gray-500">해당 거래 유형의 매물이 없습니다.</p>
            <a
              href="/ma"
              className="mt-4 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              전체 매물 보기
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
