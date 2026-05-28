import type { Metadata } from 'next'
import { buildOrganizationJsonLd, buildPageMetadata, buildWebSiteJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('openrun', {
  title: '오픈런 — 프랜차이즈 그랜드 오픈·가맹 모집 마케팅',
  description: '오픈발은 30일이면 식습니다. SNS·광고·PR 통합 운영으로 오픈부터 가맹 모집·본사 성장까지, ROI로 증명하는 프랜차이즈 마케팅 파트너.',
  path: '/',
})

import { ArrowRight, BarChart3, Search, Target, Zap } from 'lucide-react'
import { Button, Card, CardContent, NewsletterForm } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { ServiceCard } from '@/components/service-card'
import { CaseCard } from '@/components/case-card'
import { InsightCard } from '@/components/insight-card'
import { Testimonials } from '@/components/testimonials'
import { SavedCasesSection } from '@/components/saved-cases-section'
import { RecentlyViewedCases } from '@/components/recently-viewed-cases'
import { FEATURED_PORTFOLIO, FAQS, PROCESS_STEPS, SERVICES, STATS, TESTIMONIALS } from '@/lib/mock-data'
import { FEATURED_INSIGHTS } from '@/lib/mock-insights'
import { FEATURED_STORIES } from '@/lib/stories-data'

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

      {/* 성공 스토리 */}
      <section className="container mx-auto py-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h2 font-bold text-gray-900">성공 스토리</h2>
            <p className="mt-1 text-sm text-gray-500">업주들이 직접 전하는 오픈 성공 이야기</p>
          </div>
          <a
            href="/stories"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 스토리 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {FEATURED_STORIES.map((story) => {
            const topMetric = story.metrics[0] ?? null
            const INDUSTRY_COLORS: Record<string, string> = {
              카페: 'bg-amber-100 text-amber-800',
              치킨: 'bg-orange-100 text-orange-800',
              한식: 'bg-red-100 text-red-800',
              일식: 'bg-blue-100 text-blue-800',
              분식: 'bg-yellow-100 text-yellow-800',
              디저트: 'bg-pink-100 text-pink-800',
              주점: 'bg-purple-100 text-purple-800',
            }
            const industryColor = INDUSTRY_COLORS[story.industry] ?? 'bg-gray-100 text-gray-700'
            return (
              <a key={story.slug} href={`/stories/${story.slug}`} className="group block">
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold ${industryColor}`}
                    >
                      {story.industry}
                    </span>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-bold leading-snug text-gray-900 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
                      {story.title}
                    </h3>
                    <div className="mt-1.5 text-xs text-gray-500">
                      {story.ownerName} · {story.ownerRegion}
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <span className="text-xs text-gray-500">{topMetric?.label}</span>
                      <span className="text-sm font-black text-gray-900">{topMetric?.value}</span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            )
          })}
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

      {/* 캠페인 진행 방식 */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Process
            </p>
            <h2 className="mt-3 text-h2 font-bold text-gray-900">캠페인 진행 방식</h2>
            <p className="mt-3 text-gray-600">복잡한 절차 없이 4단계로 오픈런 캠페인이 시작됩니다</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-gray-200 bg-white p-6">
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  {s.step}
                </div>
                <h3 className="text-sm font-bold text-gray-900">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 자주 묻는 질문 */}
      <section className="bg-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-h3 font-bold text-gray-900">자주 묻는 질문</h2>
            <div className="mt-8 divide-y divide-gray-100 rounded-2xl border border-gray-100">
              {FAQS.map((f, i) => (
                <details key={i} className="group px-5 py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-gray-900 marker:content-['']">
                    {f.q}
                    <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 체크리스트 티저 */}
      <section className="container mx-auto pt-section">
        <Card className="overflow-hidden border-gray-200">
          <CardContent className="p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  무료 리소스
                </p>
                <h2 className="mt-2 text-h3 font-bold text-gray-900">그랜드 오픈 완전 체크리스트</h2>
                <p className="mt-1 max-w-lg text-sm text-gray-600">
                  D-30부터 D+7까지 6단계 48개 항목. 오픈 전 놓치면 치명적인 것들만 모았습니다. 진행 상태가 자동 저장됩니다.
                </p>
              </div>
              <a
                href="/checklist"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                체크리스트 보기 <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>
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

    </main>
  )
}
