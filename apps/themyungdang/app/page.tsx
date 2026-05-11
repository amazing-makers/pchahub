import { ArrowRight, CheckCircle2, Eye, Shield, Sparkles } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { platformColors, type PlatformKey } from '@amakers/design-system'
import { SearchBar } from '@/components/search-bar'
import { ListingCard } from '@/components/listing-card'
import { AreaChip } from '@/components/area-chip'
import {
  AREAS,
  FEATURED_LISTINGS,
  LISTINGS,
  listingsByArea,
  popularListings,
} from '@/lib/mock-data'

const otherPlatforms = (
  Object.entries(platformColors) as Array<[PlatformKey, (typeof platformColors)[PlatformKey]]>
).filter(([key]) => key !== 'themyungdang')

export default function HomePage() {
  const popular = popularListings(6)
  const trustSignals = [
    { icon: CheckCircle2, label: '본인 확인 매물', color: 'text-emerald-500' },
    { icon: Shield, label: '안전 거래 지원', color: 'text-blue-500' },
    { icon: Sparkles, label: '실시간 상권 데이터', color: 'text-amber-500' },
  ]

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand-primary)' }}
            >
              더명당 · themyungdang.kr
            </p>
            <h1 className="mt-4 text-hero font-bold text-gray-900">
              프랜차이즈 입점부터
              <br />
              양도까지
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              검증된 매물만 모았습니다. 권리금·보증금·월세부터 상권 분석까지
              <br className="hidden sm:inline" />한 페이지에서.
            </p>
            <div className="mt-10">
              <SearchBar />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              {trustSignals.map((s) => (
                <span key={s.label} className="inline-flex items-center gap-1.5">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {FEATURED_LISTINGS.length > 0 && (
        <section className="container mx-auto pt-section">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-h3 font-semibold text-gray-900">상단 노출 매물</h2>
              <p className="mt-1 text-sm text-gray-500">광고 · 본인 확인 매물 우선 노출</p>
            </div>
            <a
              href="/listings"
              className="hidden items-center gap-1 text-sm text-gray-600 hover:text-gray-900 sm:inline-flex"
            >
              전체 매물 보기 <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_LISTINGS.map((l) => (
              <ListingCard key={l.id} listing={l} featured />
            ))}
          </div>
        </section>
      )}

      {/* Areas */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">주요 상권 분석</h2>
            <p className="mt-1 text-sm text-gray-500">유동인구·임대료·업종 비중을 상권별로 비교</p>
          </div>
          <a
            href="/areas"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 상권 보기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.slice(0, 8).map((a) => (
            <AreaChip key={a.key} area={a} listingCount={listingsByArea(a.key).length} />
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
              <Eye className="h-6 w-6 text-gray-600" />
              인기 매물
            </h2>
            <p className="mt-1 text-sm text-gray-500">최근 7일 가장 많이 본 매물</p>
          </div>
          <a
            href="/listings"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 보기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      {/* Safe deal */}
      <section className="container mx-auto pt-section">
        <Card className="border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg">
          <CardContent className="p-10">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  Safe Deal · 안전 거래
                </p>
                <h2 className="mt-3 text-h2 font-bold">권리금 거래의 위험을 줄입니다</h2>
                <p className="mt-3 max-w-2xl text-gray-300">
                  매물 실사·계약서 검토·에스크로 결제까지. amakers 안전 거래로 권리금 분쟁과
                  허위 매물 위험을 최소화하세요.
                </p>
                <ul className="mt-5 space-y-1.5 text-sm text-gray-300">
                  {['실사 보고서로 매물 검증', '표준 계약서 + 변호사 검토', '에스크로 결제로 자금 안전 확보'].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div>
                <a href="/safe-deal">
                  <Button size="lg">안전 거래 안내</Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Other platforms */}
      <section className="container mx-auto py-section">
        <div className="mb-4">
          <h2 className="text-h4 font-semibold text-gray-900">amakers의 다른 플랫폼</h2>
          <p className="mt-1 text-sm text-gray-500">
            가맹 정보·상권·교육·투자 — 가맹점 운영 단계별 전문 플랫폼
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          {otherPlatforms.map(([key, p]) => (
            <a key={key} href={`https://${p.domain}`} className="group">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-7 w-7 shrink-0 rounded-md"
                      style={{ background: p.primary }}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-gray-900">
                        {p.name}
                      </div>
                      <div className="truncate text-xs text-gray-500">{p.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
