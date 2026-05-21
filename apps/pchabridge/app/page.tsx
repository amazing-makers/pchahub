import type { Metadata } from 'next'
import { buildOrganizationJsonLd, buildPageMetadata, buildWebSiteJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchabridge', {
  title: '프차브릿지 — 프랜차이즈 투자·M&A·다점포 펀딩',
  description: '본사 투자 라운드, M&A 매물, 다점포 펀딩을 한 곳에서. 소액 투자부터 본사 인수까지 프랜차이즈 자본 시장을 연결합니다.',
  path: '/',
})

import { ArrowRight, Shield, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { platformColors, type PlatformKey } from '@amakers/design-system'
import { RoundCard } from '@/components/round-card'
import { MACard } from '@/components/ma-card'
import { WatchedRoundsSection } from '@/components/watched-rounds-section'
import { RecentlyViewedRounds } from '@/components/recently-viewed-rounds'
import { RecentlyViewedMA } from '@/components/recently-viewed-ma'
import { FEATURED_ROUNDS, MA_LISTINGS, ROUNDS, STATS } from '@/lib/mock-data'

const otherPlatforms = (
  Object.entries(platformColors) as Array<[PlatformKey, (typeof platformColors)[PlatformKey]]>
).filter(([key]) => key !== 'pchabridge')

const TRUST = [
  { icon: ShieldCheck, label: '협회 검증 본사만 등록', color: 'text-emerald-400' },
  { icon: Shield, label: '에스크로 자금 관리', color: 'text-blue-400' },
  { icon: TrendingUp, label: 'ROI 추적 시스템', color: 'text-amber-400' },
]

export default function HomePage() {
  const featuredMA = MA_LISTINGS.filter((m) => m.status === 'open').slice(0, 2)
  const recent = [...ROUNDS]
    .filter((r) => r.status === 'open' || r.status === 'closing-soon')
    .slice(0, 6)

  const orgJsonLd = buildOrganizationJsonLd({
    name: '프차브릿지',
    url: 'https://pchabridge.amakers.co.kr',
    description: '본사 투자 라운드, M&A 매물, 다점포 펀딩을 한 곳에서. 소액 투자부터 본사 인수까지 프랜차이즈 자본 시장을 연결합니다.',
  })
  const siteJsonLd = buildWebSiteJsonLd({
    name: '프차브릿지',
    url: 'https://pchabridge.amakers.co.kr',
    searchUrlTemplate: 'https://pchabridge.amakers.co.kr/search?q={search_term_string}',
  })
  return (
    <main>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={siteJsonLd} />
      {/* Hero — dark purple */}
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto py-section">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            프차브릿지 · pchabridge.kr
          </p>
          <h1 className="mt-4 text-hero font-bold">
            본사·매장·투자자를 잇는
            <br />
            프랜차이즈 자본 거래소
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300">
            Seed부터 Series B, 다점포 펀딩, M&A까지. amakers가 검증한 본사만 등록되는 투명한
            프랜차이즈 투자 플랫폼.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/investments">
              <Button size="lg">투자 라운드 둘러보기</Button>
            </a>
            <a href="/ma">
              <Button size="lg" variant="ghost" className="gap-1 text-white hover:bg-white/10">
                M&A 매물 보기 <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="누적 모집 자금" value={STATS.totalRaised} />
            <Stat label="펀딩 본사" value={`${STATS.fundedBrands}개`} />
            <Stat label="평균 ROI" value={`${STATS.averageROI}%`} />
            <Stat label="활성 투자자" value={`${STATS.activeInvestors.toLocaleString()}명`} />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
            {TRUST.map((t) => (
              <span key={t.label} className="inline-flex items-center gap-1.5">
                <t.icon className={`h-4 w-4 ${t.color}`} />
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <WatchedRoundsSection />
      <RecentlyViewedRounds />
      <RecentlyViewedMA />

      {/* Featured rounds */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">주목받는 투자 라운드</h2>
            <p className="mt-1 text-sm text-gray-500">amakers 운영팀이 선정한 라운드</p>
          </div>
          <a
            href="/investments"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 라운드 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED_ROUNDS.map((r) => (
            <RoundCard key={r.id} round={r} />
          ))}
        </div>
      </section>

      {/* Round types explainer */}
      <section className="container mx-auto pt-section">
        <h2 className="mb-6 text-h3 font-semibold text-gray-900">3가지 투자 방식</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: 'Seed · Series',
              audience: '본사 지분 투자자',
              minLabel: '최소 500만원 ~',
              body: '본사 지분을 사들이는 전통적 VC 방식. Seed (초기) · Series A (확장) · Series B (가속).',
              icon: TrendingUp,
              color: '#7C3AED',
            },
            {
              title: '다점포 펀딩',
              audience: '소액 투자자',
              minLabel: '최소 100만원 ~',
              body: '본사가 직접 운영하는 직영점 2 ~ 5개 동시 오픈에 자금 참여. 매장 손익에 비례한 분배.',
              icon: Users,
              color: '#10B981',
            },
            {
              title: '본사 M&A',
              audience: '전략적 인수자',
              minLabel: '최소 10억 ~',
              body: '안정화된 본사 전체 또는 일부 지분 인수. NDA + 실사 + 표준 계약서 amakers 지원.',
              icon: Shield,
              color: '#0EA5E9',
            },
          ].map((opt) => (
            <Card key={opt.title} className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: opt.color }}
                >
                  <opt.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{opt.title}</h3>
                <div className="mt-1 text-xs text-gray-500">
                  {opt.audience} · {opt.minLabel}
                </div>
                <p className="mt-3 text-sm text-gray-700">{opt.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Open rounds */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">모집 중인 라운드</h2>
            <p className="mt-1 text-sm text-gray-500">현재 자금 모집 중인 본사 + 매장</p>
          </div>
          <a
            href="/investments"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 보기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((r) => (
            <RoundCard key={r.id} round={r} />
          ))}
        </div>
      </section>

      {/* M&A */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">M&A 매물</h2>
            <p className="mt-1 text-sm text-gray-500">매각 진행 중인 본사 — NDA 후 상세 자료 공개</p>
          </div>
          <a
            href="/ma"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 M&A 매물 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {featuredMA.map((m) => (
            <MACard key={m.id} listing={m} />
          ))}
        </div>
      </section>

      {/* HQ CTA */}
      <section className="container mx-auto pt-section">
        <Card className="border-gray-200 bg-gradient-to-br from-violet-900 to-violet-700 text-white">
          <CardContent className="p-10">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  본사 모집
                </p>
                <h2 className="mt-3 text-h2 font-bold">자금 조달이 필요한 본사이신가요?</h2>
                <p className="mt-3 max-w-2xl text-violet-100">
                  amakers 검증 + 정보공개서 연동 + IR 자료 호스팅까지. 투자자에게 본사 신뢰성을
                  자동으로 전달합니다.
                </p>
              </div>
              <a href="/investments/register">
                <Button size="lg" className="gap-1">
                  본사 등록 안내 <ArrowRight className="h-4 w-4" />
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">투자 인사이트 뉴스레터</h2>
            <p className="mt-2 text-sm text-gray-500">프랜차이즈 투자 동향·ROI 분석·신규 라운드 소식을 받아보세요.</p>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="mt-0.5 text-xs text-gray-400">{label}</div>
    </div>
  )
}
