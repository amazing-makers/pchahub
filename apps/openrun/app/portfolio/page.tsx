import type { Metadata } from 'next'
import { Megaphone, Search } from 'lucide-react'
import { CaseCardWithSave } from '@/components/case-card-with-save'
import { PORTFOLIO, SERVICES, SERVICE_LABEL, type ServiceSlug } from '@/lib/mock-data'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'

export const metadata: Metadata = buildPageMetadata('openrun', {
  title: '캠페인 사례',
  description: '실제 진행한 캠페인과 측정된 결과를 모두 공개합니다.',
  path: '/portfolio',
})

const SORT_OPTIONS = [
  { key: 'featured', label: '추천 순' },
  { key: 'recent', label: '최신 순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

interface PortfolioPageProps {
  searchParams: { service?: string; q?: string; sort?: string }
}

export default function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const service = searchParams.service as ServiceSlug | undefined
  const { q, sort = 'featured' } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'featured') as SortKey
  const needle = q?.toLowerCase().trim() ?? ''
  let cases = service ? PORTFOLIO.filter((c) => c.service === service) : PORTFOLIO
  if (needle) {
    cases = cases.filter(
      (c) =>
        c.client.toLowerCase().includes(needle) ||
        c.hook.toLowerCase().includes(needle) ||
        c.industry.toLowerCase().includes(needle) ||
        c.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }
  cases = [...cases].sort((a, b) => {
    if (activeSort === 'recent') return b.startedAt.localeCompare(a.startedAt)
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  })

  const totalClients = new Set(PORTFOLIO.map((c) => c.client)).size
  const industryCount = new Set(PORTFOLIO.map((c) => c.industry)).size

  const listJsonLd = buildItemListJsonLd({
    url: 'https://openrun.amakers.co.kr/portfolio',
    items: cases.slice(0, 20).map((c) => ({ name: c.hook, url: `https://openrun.amakers.co.kr/portfolio/${c.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">
            {service ? `${SERVICE_LABEL[service]} 사례` : '캠페인 사례'}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            실제 진행한 캠페인과 측정된 결과를 모두 공개합니다.
          </p>
          {/* Search bar */}
          <form method="GET" action="/portfolio" className="mt-5 flex max-w-md gap-2">
            {service && <input type="hidden" name="service" value={service} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="브랜드, 업종, 태그 검색…"
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
                href={service ? `/portfolio?service=${service}` : '/portfolio'}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>

          {/* Service filter chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`/portfolio?${new URLSearchParams({ ...(activeSort !== 'featured' ? { sort: activeSort } : {}), ...(q ? { q } : {}) }).toString()}` || '/portfolio'}
              className={
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                (!service
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
              }
            >
              전체 ({PORTFOLIO.length})
            </a>
            {SERVICES.map((s) => {
              const count = PORTFOLIO.filter((c) => c.service === s.slug).length
              if (count === 0) return null
              return (
                <a
                  key={s.slug}
                  href={`/portfolio?${new URLSearchParams({ service: s.slug, ...(activeSort !== 'featured' ? { sort: activeSort } : {}), ...(q ? { q } : {}) }).toString()}`}
                  className={
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                    (service === s.slug
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }
                >
                  {s.title} ({count})
                </a>
              )
            })}
          </div>
          {/* Sort chips */}
          <div className="mt-2 flex gap-2">
            {SORT_OPTIONS.map((o) => (
              <a
                key={o.key}
                href={`/portfolio?${new URLSearchParams({ ...(service ? { service } : {}), sort: o.key, ...(q ? { q } : {}) }).toString()}`}
                className={
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors ' +
                  (activeSort === o.key
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300')
                }
              >
                {o.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 통계 스트립 */}
      {!service && !q && (
        <div className="border-b border-gray-100 bg-white">
          <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {[
              { value: `${PORTFOLIO.length}건`, label: '캠페인 사례' },
              { value: `${totalClients}개`, label: '참여 브랜드' },
              { value: `${industryCount}개`, label: '업종 범위' },
              { value: `${SERVICES.length}개`, label: '서비스 유형' },
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
        {q && (
          <div className="mb-4 text-sm text-gray-700">
            <span className="font-medium text-gray-900">&ldquo;{q}&rdquo;</span> 검색 결과{' '}
            {cases.length}건
          </div>
        )}
        {cases.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <Megaphone className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-500">
              {q ? `"${q}" 검색 결과가 없습니다` : '해당 서비스의 사례가 없습니다'}
            </p>
            <a
              href="/portfolio"
              className="mt-4 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              전체 사례 보기
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((c) => (
              <CaseCardWithSave key={c.id} case={c} />
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">마케팅 사례를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">그랜드오픈·리뉴얼·본사캠페인 성공 사례와 캠페인 팁을 격주로 보내드립니다.</p>
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
