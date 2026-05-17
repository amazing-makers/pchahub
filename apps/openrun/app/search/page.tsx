import { Search } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { PORTFOLIO, SERVICES, SERVICE_LABEL } from '@/lib/mock-data'
import { CaseCard } from '@/components/case-card'

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams.q ?? '').trim()
  const needle = q.toLowerCase()

  const cases = q
    ? PORTFOLIO.filter(
        (c) =>
          c.client.toLowerCase().includes(needle) ||
          c.serviceLabel.toLowerCase().includes(needle) ||
          c.tags.some((t) => t.toLowerCase().includes(needle)) ||
          c.hook.toLowerCase().includes(needle) ||
          c.industry.toLowerCase().includes(needle),
      )
    : []

  const services = q
    ? SERVICES.filter(
        (s) =>
          s.title.toLowerCase().includes(needle) ||
          s.subtitle.toLowerCase().includes(needle) ||
          s.description.toLowerCase().includes(needle),
      )
    : []

  const total = cases.length + services.length

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">검색</h1>
          <form method="get" action="/search" className="mt-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="브랜드명, 서비스, 캠페인 키워드 검색..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-gray-400 focus:outline-none"
                autoFocus={!q}
              />
            </div>
          </form>
          {q && (
            <p className="mt-3 text-sm text-gray-500">
              <span className="font-medium text-gray-900">'{q}'</span> 검색 결과 · 총 {total}건
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-8">
        {!q && (
          <>
            <Card>
              <CardContent className="py-16 text-center">
                <Search className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">브랜드명이나 서비스 키워드로 검색하세요.</p>
              </CardContent>
            </Card>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">빠른 검색</p>
              <div className="flex flex-wrap gap-2">
                {['그랜드 오픈', '가맹 모집', '브랜드 마케팅', '카페', '치킨'].map((keyword) => (
                  <a
                    key={keyword}
                    href={`/search?q=${encodeURIComponent(keyword)}`}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {keyword}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {q && total === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                '<span className="font-medium">{q}</span>'에 대한 결과가 없습니다.
              </p>
              <p className="mt-1 text-xs text-gray-400">다른 키워드로 검색해보세요.</p>
            </CardContent>
          </Card>
        )}

        {cases.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              사례 <span className="text-sm font-normal text-gray-400">({cases.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cases.slice(0, 9).map((c) => (
                <CaseCard key={c.id} case={c} />
              ))}
            </div>
            {cases.length > 9 && (
              <a
                href={`/portfolio`}
                className="mt-3 inline-flex text-sm text-[var(--brand-primary)] hover:underline"
              >
                사례 {cases.length}개 전체보기 →
              </a>
            )}
          </section>
        )}

        {services.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              서비스 <span className="text-sm font-normal text-gray-400">({services.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <a
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-shadow"
                  style={{ borderTop: `4px solid ${s.accentColor}` }}
                >
                  <div className="font-semibold text-gray-900">{s.title}</div>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">{s.subtitle}</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
