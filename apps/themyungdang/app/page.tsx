import type { Metadata } from 'next'
import { buildOrganizationJsonLd, buildPageMetadata, buildWebSiteJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('themyungdang', {
  title: '더명당 — 프랜차이즈 가맹 입점 매물·권리금 거래',
  description: '목 좋은 자리는 먼저 찾는 사람이 잡습니다. 전국 가맹 입점 매물·신규임대·상권 분석을 한눈에. amakers 안전 거래로 권리금 분쟁 걱정 없이 거래하세요.',
  path: '/',
})

import dynamic from 'next/dynamic'
import { ArrowRight, CheckCircle2, Eye, Map, Shield, Sparkles, TrendingUp } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { platformColors, type PlatformKey } from '@amakers/design-system'
import { SearchBar } from '@/components/search-bar'
import { ListingCard } from '@/components/listing-card'
import { AreaChip } from '@/components/area-chip'
import {
  AREAS,
  FEATURED_LISTINGS,
  LISTING_CATEGORIES,
  LISTINGS,
  listingsByArea,
  popularListings,
} from '@/lib/mock-data'

import { ListingSectionSkeleton } from '@/components/skeletons'
import { SavedListingsSection } from '@/components/saved-listings-section'

const RecentlyViewedSection = dynamic(
  () => import('@/components/recently-viewed').then((m) => m.RecentlyViewedSection),
  { ssr: false, loading: () => <ListingSectionSkeleton count={3} /> },
)

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

  // ── 핵심 지표 계산 ────────────────────────────────────────────────────────
  const activeListings  = LISTINGS.filter(l => l.status === 'active')
  const transferCount   = activeListings.filter(l => l.type === 'transfer').length
  const newSpaceCount   = activeListings.filter(l => l.type === 'new').length
  const avgRent         = Math.round(
    activeListings.filter(l => l.monthlyRent > 0).reduce((s, l) => s + l.monthlyRent, 0) /
    Math.max(activeListings.filter(l => l.monthlyRent > 0).length, 1),
  )
  const areasCount = AREAS.filter(a => a.lat != null).length

  const METRICS = [
    { label: '총 매물',    value: `${activeListings.length}건`,   sub: '현재 등록 중' },
    { label: '양도 매물',  value: `${transferCount}건`,           sub: '권리금 포함' },
    { label: '신규 임대',  value: `${newSpaceCount}건`,           sub: '바로 입점 가능' },
    { label: '상권 분석',  value: `${areasCount}개 상권`,         sub: '전국 주요 상권' },
    { label: '평균 월세',  value: `${avgRent}만원`,               sub: '전체 매물 평균' },
  ]

  // ── 업종별 검색 카테고리 ──────────────────────────────────────────────────
  const CATEGORY_ICONS: Record<string, string> = {
    chicken: '🍗', cafe: '☕', korean: '🍲', japanese: '🍣',
    snack: '🥙', dessert: '🧁', beverage: '🧋', bar: '🍺',
    convenience: '🏪', education: '📚',
  }

  const orgJsonLd = buildOrganizationJsonLd({
    name: '더명당',
    url: 'https://themyungdang.amakers.co.kr',
    description: '전국 프랜차이즈 가맹 입점 매물 플랫폼. 권리금 양도·신규임대·상권 분석. amakers 안전 거래로 권리금 분쟁 위험을 줄이세요.',
  })
  const siteJsonLd = buildWebSiteJsonLd({
    name: '더명당',
    url: 'https://themyungdang.amakers.co.kr',
    searchUrlTemplate: 'https://themyungdang.amakers.co.kr/search?q={search_term_string}',
  })
  return (
    <main>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={siteJsonLd} />
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
              목 좋은 자리,
              <br />
              남보다 먼저
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              검증된 가맹 입점 매물만 모았습니다. 권리금·보증금·월세부터 상권 분석까지
              <br className="hidden sm:inline" />확인하고 안전하게 거래하세요.
            </p>
            <div className="mt-10 space-y-3">
              <SearchBar />
              <div className="flex items-center justify-center gap-3">
                <a
                  href="/listings/map"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-900 hover:shadow-md"
                >
                  <Map className="h-4 w-4 text-gray-500" />
                  지도로 매물 찾기
                </a>
                <a
                  href="/areas"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-900 hover:shadow-md"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  상권 분석 보기
                </a>
              </div>
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

      {/* ── 핵심 지표 바 ──────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-5">
          <div className="grid grid-cols-3 divide-x divide-gray-100 sm:grid-cols-5">
            {METRICS.map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-0.5 px-4 py-2 text-center first:pl-0 last:pr-0">
                <span className="text-xl font-black tracking-tight text-gray-900">{m.value}</span>
                <span className="text-[11px] font-semibold text-gray-700">{m.label}</span>
                <span className="text-[10px] text-gray-400">{m.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 업종별 빠른 검색 ───────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-gray-50 py-5">
        <div className="container mx-auto">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">업종별 빠른 검색</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {LISTING_CATEGORIES.map((cat) => (
              <a
                key={cat.key}
                href={`/listings?fitCategory=${cat.key}`}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white"
              >
                <span>{CATEGORY_ICONS[cat.key] ?? '🏪'}</span>
                {cat.label}
                <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500 group-hover:bg-white/20">
                  {cat.brandRefCount}
                </span>
              </a>
            ))}
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

      {/* Recently viewed — client island, no-ops on SSR */}
      <RecentlyViewedSection />

      {/* Saved listings — client island */}
      <SavedListingsSection />

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

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">새 매물 알림을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">관심 지역 신규 매물·상권 리포트·가격 동향을 메일로 알려드립니다.</p>
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
