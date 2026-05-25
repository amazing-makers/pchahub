import type { Metadata } from 'next'
import { buildOrganizationJsonLd, buildPageMetadata, buildWebSiteJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('openrun', {
  title: '오픈런 — 프랜차이즈 그랜드 오픈·가맹 모집 마케팅',
  description: '오픈발은 30일이면 식습니다. SNS·광고·PR 통합 운영으로 오픈부터 가맹 모집·본사 성장까지, ROI로 증명하는 프랜차이즈 마케팅 파트너.',
  path: '/',
})

import { ArrowRight, BarChart3, Search, Target, Zap } from 'lucide-react'
import { Button, Card, CardContent, NewsletterForm } from '@amakers/ui'
import { platformColors, type PlatformKey } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import { ServiceCard } from '@/components/service-card'
import { CaseCard } from '@/components/case-card'
import { InsightCard } from '@/components/insight-card'
import { Testimonials } from '@/components/testimonials'
import { SavedCasesSection } from '@/components/saved-cases-section'
import { RecentlyViewedCases } from '@/components/recently-viewed-cases'
import { FEATURED_PORTFOLIO, SERVICES, STATS, TESTIMONIALS } from '@/lib/mock-data'
import { FEATURED_INSIGHTS } from '@/lib/mock-insights'

const otherPlatforms = (
  Object.entries(platformColors) as Array<[PlatformKey, (typeof platformColors)[PlatformKey]]>
).filter(([key]) => key !== 'openrun')

const STAT_BLOCKS = [
  { label: '누적 캠페인', value: `${formatNumber(STATS.campaigns)}건` },
  { label: '평균 ROI', value: `${STATS.averageROI}%` },
  { label: '협업 본사', value: `${STATS.partneredHQ}개` },
  { label: '그랜드 오픈 성공률', value: `${STATS.grandOpenSuccess}%` },
]

const SIGNALS = [
  { icon: Target, label: '검증된 본사·매장 매칭', color: 'text-orange-500' },
  { icon: BarChart3, label: '월간 ROI 리포트', color: 'text-emerald-500' },
  { icon: Zap, label: '오픈 7일 전 셋업 시작', color: 'text-blue-500' },
]

export default function HomePage() {
  const orgJsonLd = buildOrganizationJsonLd({
    name: '오픈런',
    url: 'https://openrun.amakers.co.kr',
    description: '오픈 30일·가맹 모집 6개월·본사 12개월 통합 마케팅. SNS·광고·PR을 통합 운영해 ROI를 책임지는 프랜차이즈 마케팅 파트너.',
  })
  const siteJsonLd = buildWebSiteJsonLd({
    name: '오픈런',
    url: 'https://openrun.amakers.co.kr',
    searchUrlTemplate: 'https://openrun.amakers.co.kr/search?q={search_term_string}',
  })
  return (
    <main>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={siteJsonLd} />
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto py-section">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            오픈런 · openrun.kr
          </p>
          <h1 className="mt-4 text-hero font-bold">
            오픈발은
            <br />
            30일이면 식습니다
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300">
            그 다음을 준비해야 매출이 이어집니다. SNS + 광고 + PR을 통합 운영해
            오픈부터 가맹 모집, 본사 성장까지 ROI로 증명하는 마케팅 파트너.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/contact">
              <Button size="lg">캠페인 의뢰하기</Button>
            </a>
            <a href="/portfolio">
              <Button size="lg" variant="ghost" className="gap-1 text-white hover:bg-white/10">
                사례 보기 <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STAT_BLOCKS.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black tracking-tight">{s.value}</div>
                <div className="mt-0.5 text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-10">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-gray-600">
            {SIGNALS.map((s) => (
              <span key={s.label} className="inline-flex items-center gap-1.5">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <SavedCasesSection />
      <RecentlyViewedCases />

      <section className="container mx-auto py-section">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            서비스
          </p>
          <h2 className="mt-3 text-h2 font-bold text-gray-900">3가지 통합 캠페인</h2>
          <p className="mt-3 text-gray-600">
            점주·본사·브랜드 각자의 타이밍에 맞는 마케팅. 단발성 광고가 아닌 통합 운영입니다.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {SERVICES.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-h2 font-bold text-gray-900">대표 사례</h2>
              <p className="mt-1 text-sm text-gray-500">캠페인이 만든 실제 매출·노출 변화</p>
            </div>
            <a
              href="/portfolio"
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              전체 사례 <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          {/* 사례 검색 */}
          <form action="/search" method="get" className="mb-6 flex max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[var(--brand-primary)]">
            <Search className="m-3 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
            <input
              name="q"
              type="search"
              placeholder="업종·서비스·캠페인 유형 검색"
              className="flex-1 bg-transparent py-2.5 pr-2 text-sm text-gray-900 placeholder-gray-400 outline-none"
            />
            <button
              type="submit"
              className="m-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              검색
            </button>
          </form>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {FEATURED_PORTFOLIO.map((c) => (
              <CaseCard key={c.id} case={c} />
            ))}
          </div>
        </div>
      </section>

      {/* 인사이트 */}
      <section className="container mx-auto py-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h2 font-bold text-gray-900">마케팅 인사이트</h2>
            <p className="mt-1 text-sm text-gray-500">480개 캠페인 데이터 기반 실전 가이드</p>
          </div>
          <a href="/insights" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            전체 인사이트 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURED_INSIGHTS.slice(0, 3).map((i) => (
            <InsightCard key={i.id} insight={i} />
          ))}
        </div>
      </section>

      <section className="container mx-auto py-section">
        <h2 className="mb-8 text-h2 font-bold text-gray-900">고객 후기</h2>
        <Testimonials testimonials={TESTIMONIALS} />
      </section>

      <section className="container mx-auto pb-section">
        <Card className="border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <CardContent className="p-10 text-center">
            <h2 className="text-h2 font-bold">캠페인 의뢰는 24시간 이내 답변</h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-300">
              간단한 폼을 채워주시면 영업일 기준 24시간 이내 캠페인 기획안 + 예산 안내를 받아보실 수
              있습니다.
            </p>
            <div className="mt-6">
              <a href="/contact">
                <Button size="lg" className="gap-1">
                  캠페인 의뢰 시작 <ArrowRight className="h-4 w-4" />
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">마케팅 인사이트를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 사례·캠페인 팁·업종별 마케팅 동향을 격주로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto pb-section">
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
