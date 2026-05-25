import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { Card, CardContent } from '@amakers/ui'
import { AlertCircle, ArrowUpRight, BarChart2, Info, TrendingDown, TrendingUp } from 'lucide-react'
import {
  AREA_PRICES,
  CATEGORY_INSIGHTS,
  PRICE_GUIDE_CATEGORIES,
  PRICE_STATS,
  TREND_COLOR,
  TREND_LABEL,
  pricesByCategory,
  type AreaPriceRow,
  type TrendDir,
} from '@/lib/mock-price-guide'

export const metadata: Metadata = buildPageMetadata('themyungdang', {
  title: '권리금 시세 가이드 — 상권·업종별 평균 가격',
  description: '전국 주요 상권의 업종별 권리금·보증금·월세 시세를 확인하세요. 카페·치킨·한식·분식·주점 등 업종별 가격 범위와 연간 추이를 제공합니다.',
  path: '/price-guide',
})

interface PriceGuidePageProps {
  searchParams: { cat?: string }
}

function TrendBadge({ trend, pct }: { trend: TrendDir; pct: number }) {
  const color = TREND_COLOR[trend]
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : ArrowUpRight
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color }}>
      <Icon className="h-3 w-3" />
      {pct > 0 ? '+' : ''}{pct}%
    </span>
  )
}

function fmt(n: number) {
  return n >= 10000
    ? `${(n / 10000).toFixed(1)}억`
    : `${n.toLocaleString()}만`
}

function RangeCell({ min, max }: { min: number; max: number }) {
  return (
    <span className="tabular-nums text-sm text-gray-900">
      {fmt(min)} ~ {fmt(max)}
    </span>
  )
}

function AreaRow({ area, catKey }: { area: AreaPriceRow; catKey: string }) {
  const catRow = catKey !== 'all' ? area.byCategory.find((c) => c.key === catKey) : null
  const rightMin = catRow ? catRow.rightFeeMin : area.rightFeeMin
  const rightMax = catRow ? catRow.rightFeeMax : area.rightFeeMax

  return (
    <tr className="border-b border-gray-50 transition-colors hover:bg-gray-50">
      <td className="py-3 pl-4 pr-2">
        <div className="text-sm font-semibold text-gray-900">{area.areaName}</div>
        <div className="text-xs text-gray-400">{area.region}</div>
      </td>
      <td className="px-3 py-3">
        <div className="font-bold text-gray-900">
          <RangeCell min={rightMin} max={rightMax} />
        </div>
        {catRow?.note && (
          <div className="mt-0.5 text-[11px] text-gray-400 line-clamp-1">{catRow.note}</div>
        )}
      </td>
      <td className="hidden px-3 py-3 sm:table-cell">
        <RangeCell min={area.depositMin} max={area.depositMax} />
      </td>
      <td className="hidden px-3 py-3 md:table-cell">
        <span className="tabular-nums text-sm text-gray-900">
          {area.rentPerPyeongMin}~{area.rentPerPyeongMax}만/평
        </span>
      </td>
      <td className="px-3 py-3">
        <TrendBadge trend={area.trend} pct={area.trendPct} />
      </td>
      <td className="hidden px-3 py-3 pr-4 text-right lg:table-cell">
        <span className="text-xs tabular-nums text-gray-500">{area.txCount}건</span>
      </td>
    </tr>
  )
}

export default function PriceGuidePage({ searchParams }: PriceGuidePageProps) {
  const activeCat = searchParams.cat ?? 'all'
  const rows = pricesByCategory(activeCat)
  const insightToShow = activeCat === 'all' ? CATEGORY_INSIGHTS : CATEGORY_INSIGHTS.filter((c) => c.key === activeCat)

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '더명당', url: 'https://themyungdang.amakers.co.kr' },
      { name: '권리금 시세 가이드', url: 'https://themyungdang.amakers.co.kr/price-guide' },
    ],
  })

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white py-section">
        <div className="container mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            시세 가이드 · Price Guide
          </p>
          <h1 className="mt-3 text-h2 font-bold text-gray-900">권리금 시세 가이드</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            전국 주요 상권의 업종별 권리금·보증금·월세 실거래 범위. 내가 보고 있는 매물 가격이
            적정한지 상권·업종 시세와 비교해 보세요.
          </p>

          {/* Key stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: '전국 평균 권리금', value: `${PRICE_STATS.nationalAvgRightFee.toLocaleString()}만원`, sub: '전 업종 평균' },
              { label: '중위 권리금', value: `${PRICE_STATS.nationalMedianRightFee.toLocaleString()}만원`, sub: '상·하위 50%' },
              { label: '연간 변동률', value: `+${PRICE_STATS.yoyChangePct}%`, sub: '전년 대비', accent: true },
              { label: '분석 거래 건수', value: `${PRICE_STATS.totalTransactions.toLocaleString()}건`, sub: '최근 12개월' },
            ].map((s) => (
              <Card key={s.label} className="border-gray-200">
                <CardContent className="p-4">
                  <div
                    className={`text-xl font-black tabular-nums ${s.accent ? '' : 'text-gray-900'}`}
                    style={s.accent ? { color: 'var(--brand-primary)' } : undefined}
                  >
                    {s.value}
                  </div>
                  <div className="mt-0.5 text-xs font-semibold text-gray-700">{s.label}</div>
                  <div className="text-[11px] text-gray-400">{s.sub}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-section space-y-10">
        {/* Category filter */}
        <div>
          <div className="mb-1 text-sm font-semibold text-gray-700">업종별 필터</div>
          <div className="flex flex-wrap gap-2">
            {PRICE_GUIDE_CATEGORIES.map((cat) => {
              const isActive = activeCat === cat.key
              return (
                <a
                  key={cat.key}
                  href={cat.key === 'all' ? '/price-guide' : `/price-guide?cat=${cat.key}`}
                  className="rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors"
                  style={
                    isActive
                      ? { background: 'var(--brand-primary)', color: '#fff', borderColor: 'var(--brand-primary)' }
                      : { background: '#fff', color: '#374151', borderColor: '#e5e7eb' }
                  }
                >
                  {cat.label}
                </a>
              )
            })}
          </div>
        </div>

        {/* Price table */}
        <section>
          <h2 className="text-h4 font-bold text-gray-900">
            {activeCat === 'all'
              ? '전체 상권 시세'
              : `${PRICE_GUIDE_CATEGORIES.find((c) => c.key === activeCat)?.label ?? ''} — 상권별 시세`}
          </h2>
          <p className="mt-1 text-sm text-gray-500">권리금 범위 기준 높은 순 정렬 · 단위: 만원</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
                    <th className="py-3 pl-4 pr-2 text-left">상권</th>
                    <th className="px-3 py-3 text-left">권리금 범위</th>
                    <th className="hidden px-3 py-3 text-left sm:table-cell">보증금 범위</th>
                    <th className="hidden px-3 py-3 text-left md:table-cell">평당 월세</th>
                    <th className="px-3 py-3 text-left">추이</th>
                    <th className="hidden px-3 py-3 pr-4 text-right lg:table-cell">거래량</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((area) => (
                    <AreaRow key={area.areaKey} area={area} catKey={activeCat} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
            <Info className="h-3.5 w-3.5 shrink-0" />
            시세는 최근 12개월 실거래 기반 추정치이며 실제 매물과 차이가 있을 수 있습니다.
          </p>
        </section>

        {/* Category insights */}
        <section>
          <h2 className="text-h4 font-bold text-gray-900">업종별 시세 인사이트</h2>
          <p className="mt-1 text-sm text-gray-500">업종 특성과 투자 시 고려할 점</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insightToShow.map((insight) => {
              const trendColor = TREND_COLOR[insight.trend]
              return (
                <Card key={insight.key} className="border-gray-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-700">
                          {insight.label}
                        </span>
                        <div className="mt-2 text-lg font-black tabular-nums text-gray-900">
                          전국 평균 {insight.avgNational.toLocaleString()}만원
                        </div>
                      </div>
                      <span
                        className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
                        style={{ background: trendColor + '18', color: trendColor }}
                      >
                        {TREND_LABEL[insight.trend]} {Math.abs(insight.trendPct)}%
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-red-50 p-2.5">
                        <div className="text-[10px] font-semibold uppercase text-red-500">최고가 상권</div>
                        <div className="mt-0.5 text-sm font-bold text-gray-900">{insight.premiumAreaName}</div>
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-2.5">
                        <div className="text-[10px] font-semibold uppercase text-emerald-600">저가 상권</div>
                        <div className="mt-0.5 text-sm font-bold text-gray-900">{insight.valueAreaName}</div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-gray-600">{insight.tip}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* How to evaluate */}
        <section>
          <h2 className="text-h4 font-bold text-gray-900">권리금 적정성 판단 기준</h2>
          <p className="mt-1 text-sm text-gray-500">시세를 확인했다면 이 체크리스트로 매물 가격을 검증하세요</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: '월 순이익 대비 회수 기간',
                body: '권리금 ÷ 월 순이익 = 회수 개월 수. 일반적으로 18~30개월이 적정합니다. 36개월 이상이면 협상 여지가 있습니다.',
                warn: false,
              },
              {
                title: '잔여 임대차 기간',
                body: '계약 잔여 기간이 2년 미만이면 권리금 회수 전에 임대차가 종료될 수 있습니다. 잔여 기간이 짧을수록 권리금을 낮추세요.',
                warn: true,
              },
              {
                title: '인테리어 감가상각',
                body: '일반적으로 인테리어는 3년 내 권리금의 30~50%를 차지합니다. 설비 교체 시기와 감가액을 확인하고 협상에 반영하세요.',
                warn: false,
              },
              {
                title: '업종 전환 가능성',
                body: '매물의 업종 제한 조항을 확인하세요. 업종 변경이 제한되면 동일 업종 인수자를 찾아야 해 매도 시 권리금 회수가 어렵습니다.',
                warn: true,
              },
              {
                title: '상권 성장성 체크',
                body: '시세 추이(↑↓)와 주변 개발 계획, 유동인구 추이를 함께 봐야 합니다. 하락세 상권에서는 회수 기간을 보수적으로 계산하세요.',
                warn: false,
              },
              {
                title: 'amakers 안전 거래',
                body: '권리금 거래는 법적 보호가 취약합니다. 실사 보고서·표준 계약서·에스크로 결제를 통해 분쟁 위험을 줄이세요.',
                warn: false,
                cta: { label: '안전 거래 알아보기', href: '/safe-deal' },
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border p-5 ${item.warn ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-white'}`}
              >
                <div className="flex items-start gap-2">
                  {item.warn && <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}
                  {!item.warn && <BarChart2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />}
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">{item.body}</p>
                {item.cta && (
                  <a
                    href={item.cta.href}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    {item.cta.label} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <Card className="border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <CardContent className="p-8">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-h4 font-bold">적정 시세를 확인했다면 매물을 직접 찾아보세요</h2>
                  <p className="mt-1 text-sm text-gray-300">전국 가맹 입점 양도·신규임대 매물 목록</p>
                </div>
                <div className="flex shrink-0 gap-3">
                  <a
                    href="/listings"
                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: 'var(--brand-primary)' }}
                  >
                    매물 목록 보기
                  </a>
                  <a
                    href="/areas"
                    className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/20"
                  >
                    상권 분석
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
