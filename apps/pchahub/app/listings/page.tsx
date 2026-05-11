import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { CATEGORIES } from '@/lib/mock-data'
import { LISTINGS } from '@/lib/mock-listings'

interface ListingsPageProps {
  searchParams: { category?: string }
}

export default function ListingsPage({ searchParams }: ListingsPageProps) {
  const active = searchParams.category
  const filtered = active ? LISTINGS.filter((l) => l.fitCategories.includes(active)) : LISTINGS

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">가맹 입점 매물</h1>
          <p className="mt-1 text-sm text-gray-500">
            프차허브가 협력 부동산 플랫폼{' '}
            <a href="https://themyungdang.kr" className="text-gray-900 underline">
              더명당
            </a>
            에서 가맹 운영에 적합한 매물을 큐레이션합니다. 전체 매물은 더명당에서 확인하세요.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="mb-5 flex flex-wrap gap-2">
          <FilterChip href="/listings" active={!active}>
            전체
          </FilterChip>
          {CATEGORIES.map((c) => {
            const count = LISTINGS.filter((l) => l.fitCategories.includes(c.key)).length
            if (count === 0) return null
            return (
              <FilterChip
                key={c.key}
                href={`/listings?category=${c.key}`}
                active={active === c.key}
              >
                {c.label} ({count})
              </FilterChip>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-gray-500">
              해당 업종 매물이 없습니다. 필터를 변경해보세요.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((l) => (
              <a
                key={l.id}
                href={`https://themyungdang.kr/listings/${l.id}`}
                className="group block"
              >
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-base font-semibold text-gray-900">{l.title}</div>
                        <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {l.region} {l.district} · {l.area}평
                        </div>
                      </div>
                      {l.verified && (
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
                          aria-label="검증 매물"
                        />
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 text-xs">
                      <div>
                        <div className="text-gray-500">권리금</div>
                        <div className="mt-0.5 font-semibold text-gray-900">
                          {l.rightFee === 0 ? '없음' : `${formatNumber(l.rightFee)}만`}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">보증금</div>
                        <div className="mt-0.5 font-semibold text-gray-900">
                          {formatNumber(l.deposit)}만
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">월세</div>
                        <div className="mt-0.5 font-semibold text-gray-900">
                          {formatNumber(l.monthlyRent)}만
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {l.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                      일 평균 유동인구 약 {formatNumber(l.footTraffic)}명 · 입점 가능{' '}
                      {l.availableFrom}
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center">
          <div className="text-sm text-gray-500">전국 매물 검색은 더명당에서</div>
          <h2 className="mt-1 text-h4 font-bold text-gray-900">상권 분석부터 거래까지</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
            더명당은 amakers의 부동산 전문 플랫폼입니다. 양도·신규임대·매각 매물 외에 상권 분석,
            안전 거래 기능을 제공합니다.
          </p>
          <a
            href="https://themyungdang.kr"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            더명당에서 전체 매물 보기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </main>
  )
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={
        'rounded-full px-3 py-1.5 text-sm transition-colors ' +
        (active
          ? 'bg-gray-900 text-white'
          : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300')
      }
    >
      {children}
    </a>
  )
}
