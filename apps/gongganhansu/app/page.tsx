import type { Metadata } from 'next'
import { buildOrganizationJsonLd, buildPageMetadata, buildWebSiteJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('gongganhansu', {
  title: '공간의한수 — F&B 매장 인테리어·시공사 매칭',
  description: '같은 평수인데 견적은 천차만별. 검증된 F&B 시공사 견적을 나란히 비교하고, 실제 시공 갤러리와 평당 단가까지 확인한 뒤 무료로 견적받으세요.',
  path: '/',
})

import { ArrowRight, Calculator, CheckCircle2, Search, Sparkles, Wrench } from 'lucide-react'
import { Button, Card, CardContent, NewsletterForm } from '@amakers/ui'
import { platformColors, type PlatformKey } from '@amakers/design-system'
import { SavedContractorsSection } from '@/components/saved-contractors-section'
import { RecentlyViewedContractors } from '@/components/recently-viewed-contractors'
import { RecentlyViewedInsights } from '@/components/recently-viewed-insights'
import { RecentlyViewedPortfolio } from '@/components/recently-viewed-portfolio'
import { SavedPortfolioSection } from '@/components/saved-portfolio-section'
import { ContractorCard } from '@/components/contractor-card'
import { PortfolioCard } from '@/components/portfolio-card'
import { InsightCard } from '@/components/insight-card'
import {
  CATEGORIES,
  CONTRACTORS,
  FEATURED_CONTRACTORS,
  FEATURED_INSIGHTS,
  FEATURED_PORTFOLIO,
  PORTFOLIO,
} from '@/lib/mock-data'

const otherPlatforms = (
  Object.entries(platformColors) as Array<[PlatformKey, (typeof platformColors)[PlatformKey]]>
).filter(([key]) => key !== 'gongganhansu')

const TRUST = [
  { icon: CheckCircle2, label: '검증된 시공사만 등록', color: 'text-emerald-500' },
  { icon: Sparkles, label: 'SNS 노출 효과 데이터', color: 'text-amber-500' },
  { icon: Wrench, label: '시공 일수 보장제 옵션', color: 'text-blue-500' },
]

export default function HomePage() {
  // 핵심 지표 계산
  const uniqueRegions = Array.from(new Set(PORTFOLIO.map((p) => p.region))).length
  const avgBudgetPerPyeong = PORTFOLIO.length
    ? Math.round(
        PORTFOLIO.reduce((s, p) => s + Math.round(p.budget / Math.max(p.area, 1)), 0) /
          PORTFOLIO.length,
      )
    : 0
  const STATS_ITEMS = [
    { label: '시공 사례', value: `${PORTFOLIO.length}건`, sub: '전체 포트폴리오' },
    { label: '검증 시공사', value: `${CONTRACTORS.length}곳`, sub: '등록 시공사' },
    { label: '커버 지역', value: `${uniqueRegions}개 지역`, sub: '서비스 가능' },
    { label: '평균 평당 단가', value: `${avgBudgetPerPyeong}만원`, sub: '전체 사례 평균' },
  ]

  const orgJsonLd = buildOrganizationJsonLd({
    name: '공간의한수',
    url: 'https://gongganhansu.amakers.co.kr',
    description: 'F&B 매장 시공 전문 플랫폼. 검증된 시공사 매칭, 실제 시공 갤러리, 평당 단가 인사이트까지.',
  })
  const siteJsonLd = buildWebSiteJsonLd({
    name: '공간의한수',
    url: 'https://gongganhansu.amakers.co.kr',
    searchUrlTemplate: 'https://gongganhansu.amakers.co.kr/search?q={search_term_string}',
  })
  return (
    <main>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={siteJsonLd} />
      {/* Hero — slate gradient */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand-primary)' }}
            >
              공간의한수 · gongganhansu.kr
            </p>
            <h1 className="mt-4 text-hero font-bold text-gray-900">
              같은 평수,
              <br />
              견적은 천차만별
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              검증된 F&B 시공사 견적을 나란히 비교하고, 실제 시공 갤러리와 평당 단가까지
              <br className="hidden sm:inline" />
              확인한 뒤 결정하세요.
            </p>
            {/* 검색창 */}
            <form action="/search" method="get" className="mt-8 flex w-full max-w-xl mx-auto overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md focus-within:ring-2 focus-within:ring-[var(--brand-primary)]">
              <Search className="m-3.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden />
              <input
                name="q"
                type="search"
                placeholder="업종·지역·시공사 검색 (예: 카페 서울 홍대)"
                className="flex-1 bg-transparent py-3 pr-2 text-sm text-gray-900 placeholder-gray-400 outline-none"
              />
              <button
                type="submit"
                className="m-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ background: 'var(--brand-primary)' }}
              >
                검색
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a href="/quote">
                <Button size="lg">무료 견적 받기</Button>
              </a>
              <a href="/gallery">
                <Button size="lg" variant="outline" className="gap-1">
                  매장 갤러리 둘러보기 <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              {TRUST.map((t) => (
                <span key={t.label} className="inline-flex items-center gap-1.5">
                  <t.icon className={`h-4 w-4 ${t.color}`} />
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 지표 스트립 */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-5">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {STATS_ITEMS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5 px-4 py-3 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{s.value}</span>
                <span className="text-[11px] font-semibold text-gray-700">{s.label}</span>
                <span className="text-[10px] text-gray-400">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 저장한 시공사 — 클라이언트 전용, localStorage 기반 */}
      <SavedContractorsSection />

      {/* 최근 본 시공사 — 클라이언트 전용 */}
      <RecentlyViewedContractors />

      {/* 최근 본 인사이트 — 클라이언트 전용 */}
      <RecentlyViewedInsights />

      {/* 최근 본 포트폴리오 — 클라이언트 전용 */}
      <RecentlyViewedPortfolio />

      <SavedPortfolioSection />

      {/* Featured portfolio */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">대표 시공 사례</h2>
            <p className="mt-1 text-sm text-gray-500">F&B 매장 시공의 실제 결과물</p>
          </div>
          <a
            href="/gallery"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 갤러리 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PORTFOLIO.map((p) => (
            <PortfolioCard key={p.id} item={p} />
          ))}
        </div>
      </section>

      {/* Recommended contractors */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">추천 시공사</h2>
            <p className="mt-1 text-sm text-gray-500">검증된 F&B 시공 전문 시공사</p>
          </div>
          <a
            href="/contractors"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 시공사 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_CONTRACTORS.map((c) => (
            <ContractorCard key={c.id} contractor={c} />
          ))}
        </div>
      </section>

      {/* Insights */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">한 수 인사이트</h2>
            <p className="mt-1 text-sm text-gray-500">단가·디자인·시공 관리 전문 분석</p>
          </div>
          <a
            href="/insights"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 인사이트 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_INSIGHTS.map((i) => (
            <InsightCard key={i.id} insight={i} />
          ))}
        </div>
      </section>

      {/* 단가 계산기 CTA */}
      <section className="container mx-auto pt-section">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="grid lg:grid-cols-[1fr_auto]">
            <div className="p-8">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  <Calculator className="h-5 w-5" />
                </div>
                <span
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  단가 계산기
                </span>
              </div>
              <h2 className="mt-3 text-h3 font-bold text-gray-900">
                내 매장, 얼마나 들까요?
              </h2>
              <p className="mt-2 max-w-lg text-sm text-gray-500">
                업종·면적·시공 등급만 선택하면 예상 비용과 항목별 내역을 바로 확인할 수 있습니다.
                견적 요청 전 미리 예산을 가늠해 보세요.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/calculator"
                  className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  <Calculator className="h-4 w-4" /> 계산해보기
                </a>
                <a
                  href="/quote"
                  className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  무료 견적 받기 <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="hidden items-center justify-center bg-gray-50 p-10 lg:flex">
              <div className="text-center">
                <div className="text-4xl font-black text-gray-200">20평</div>
                <div className="mt-1 text-sm text-gray-400">카페 스탠다드</div>
                <div className="mt-3 text-2xl font-black" style={{ color: 'var(--brand-primary)' }}>
                  6,400만원
                </div>
                <div className="mt-0.5 text-xs text-gray-400">예상 견적 (±15%)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto pt-section">
        <Card className="border-gray-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardContent className="p-10">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-h2 font-bold">3 ~ 5개 시공사 견적 비교</h2>
                <p className="mt-3 max-w-2xl text-gray-300">
                  매장 카테고리·면적·지역·예산만 입력하시면 적합한 시공사 3 ~ 5곳의 견적을 영업일
                  기준 48시간 내에 받아보실 수 있습니다.
                </p>
              </div>
              <a href="/quote">
                <Button size="lg" className="gap-1">
                  무료 견적 시작 <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">시공 인사이트 뉴스레터</h2>
            <p className="mt-2 text-sm text-gray-500">인테리어 트렌드·비용 절감 팁·시공 사례를 매주 받아보세요.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>

      {/* Other platforms */}
      <section className="container mx-auto py-section">
        <div className="mb-4">
          <h2 className="text-h4 font-semibold text-gray-900">amakers의 다른 플랫폼</h2>
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
