import { ArrowRight, CheckCircle2, Sparkles, Wrench } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { platformColors, type PlatformKey } from '@amakers/design-system'
import { ContractorCard } from '@/components/contractor-card'
import { PortfolioCard } from '@/components/portfolio-card'
import { InsightCard } from '@/components/insight-card'
import {
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
  return (
    <main>
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
              매장 인테리어의
              <br />
              한 수
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              F&B 매장 시공 전문 시공사 + 매장 갤러리 + 단가 인사이트.
              <br className="hidden sm:inline" />
              평당 단가가 비교 가능해지는 곳.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
