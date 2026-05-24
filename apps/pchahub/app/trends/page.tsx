import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ArrowDown, ArrowUp, BarChart2, ChevronRight, TrendingUp } from 'lucide-react'
import { Badge, Card, CardContent, NewsletterForm } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import {
  CATEGORY_TRENDS,
  REGION_SHARES,
  TREND_INSIGHTS,
  YEAR_STATS,
} from '@/lib/trends-data'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '가맹 시장 트렌드 — 공정위 데이터 기반 업종별·지역별 분석',
  description: '공정위 정보공개서 기반 가맹 시장 현황. 카테고리별 성장률, 평균 창업비 변화, 지역별 점포 분포를 한눈에 확인하세요.',
  path: '/trends',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차허브', url: 'https://pchahub.amakers.co.kr' },
    { name: '시장 트렌드', url: 'https://pchahub.amakers.co.kr/trends' },
  ],
})

const latestYear = YEAR_STATS[YEAR_STATS.length - 1]
const prevYear = YEAR_STATS[YEAR_STATS.length - 2]
const brandGrowth = (((latestYear.totalBrands - prevYear.totalBrands) / prevYear.totalBrands) * 100).toFixed(1)
const storeGrowth = (((latestYear.totalStores - prevYear.totalStores) / prevYear.totalStores) * 100).toFixed(1)
const costGrowth = (((latestYear.avgStartupCost - prevYear.avgStartupCost) / prevYear.avgStartupCost) * 100).toFixed(1)

// bar chart max
const maxGrowth = Math.max(...CATEGORY_TRENDS.filter(c => c.growthRate > 0).map(c => c.growthRate))
const maxShare = Math.max(...REGION_SHARES.map(r => r.share))

export default function TrendsPage() {
  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />

      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-10">
          <nav className="mb-4 flex items-center gap-1 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-900">홈</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">시장 트렌드</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2">
                <TrendingUp className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
                <h1 className="text-h2 font-bold text-gray-900">가맹 시장 트렌드</h1>
              </div>
              <p className="mt-2 max-w-2xl text-gray-600">
                공정거래위원회 정보공개서 기반 업종별·지역별 가맹 시장 현황.
                창업 전 시장 흐름을 데이터로 확인하세요.
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              기준: 2024년 공정위 데이터
            </span>
          </div>
        </div>
      </section>

      {/* 연도별 핵심 지표 */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          {[
            {
              label: '등록 브랜드 수',
              value: `${formatNumber(latestYear.totalBrands)}개`,
              change: `+${brandGrowth}%`,
              up: true,
            },
            {
              label: '전체 점포 수',
              value: `${formatNumber(latestYear.totalStores)}점`,
              change: `+${storeGrowth}%`,
              up: true,
            },
            {
              label: '평균 창업비',
              value: `${formatNumber(latestYear.avgStartupCost)}만원`,
              change: `+${costGrowth}%`,
              up: false,
            },
            {
              label: '신규 브랜드',
              value: `${formatNumber(latestYear.newBrands)}개`,
              change: `전년比 -${Math.round(((768 - latestYear.newBrands) / 768) * 100)}%`,
              up: false,
            },
          ].map(({ label, value, change, up }) => (
            <div key={label} className="px-6 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-black tracking-tight text-gray-900">{value}</p>
              <p className={`mt-0.5 flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-rose-500'}`}>
                {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {change} (전년 대비)
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto space-y-12 py-10">

        {/* 주목 트렌드 인사이트 */}
        <section>
          <h2 className="mb-5 text-h4 font-semibold text-gray-900">지금 주목할 시장 신호</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TREND_INSIGHTS.map((insight) => (
              <Card key={insight.title} className="border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        insight.direction === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                      }`}
                    >
                      {insight.direction === 'up' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-900">{insight.title}</h3>
                        <Badge variant="secondary" className="text-[10px]">{insight.tag}</Badge>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{insight.body}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 업종별 성장률 바 차트 */}
        <section>
          <div className="mb-5 flex items-center gap-2">
            <BarChart2 className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
            <h2 className="text-h4 font-semibold text-gray-900">업종별 점포 수 성장률 (2023→2024)</h2>
          </div>
          <Card className="border-gray-200">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {[...CATEGORY_TRENDS]
                  .sort((a, b) => b.growthRate - a.growthRate)
                  .map((cat) => {
                    const isPositive = cat.growthRate >= 0
                    const barWidth = isPositive
                      ? `${(cat.growthRate / maxGrowth) * 100}%`
                      : `${(Math.abs(cat.growthRate) / maxGrowth) * 60}%`
                    return (
                      <div key={cat.category} className="flex items-center gap-4 px-5 py-3.5">
                        <span className="w-5 text-base" aria-hidden>{cat.emoji}</span>
                        <span className="w-28 shrink-0 text-sm font-medium text-gray-800">{cat.category}</span>
                        <div className="flex flex-1 items-center gap-2">
                          <div className="flex-1 overflow-hidden rounded-full bg-gray-100 h-2.5">
                            <div
                              className={`h-full rounded-full transition-all ${isPositive ? 'bg-emerald-400' : 'bg-rose-400'}`}
                              style={{ width: barWidth }}
                            />
                          </div>
                          <span
                            className={`w-14 text-right text-sm font-bold ${
                              isPositive ? 'text-emerald-600' : 'text-rose-500'
                            }`}
                          >
                            {isPositive ? '+' : ''}{cat.growthRate}%
                          </span>
                        </div>
                        <span className="hidden w-20 text-right text-xs text-gray-400 sm:block">
                          {formatNumber(cat.storeCount)}점
                        </span>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 업종별 평균 창업비 비교 */}
        <section>
          <h2 className="mb-5 text-h4 font-semibold text-gray-900">업종별 평균 창업비 비교</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...CATEGORY_TRENDS]
              .sort((a, b) => a.avgStartupCost - b.avgStartupCost)
              .map((cat) => (
                <Card key={cat.category} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl" aria-hidden>{cat.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{cat.category}</p>
                        <p className="text-xs text-gray-500">평균 창업비</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-black text-gray-900">
                          {formatNumber(cat.avgStartupCost)}만
                        </p>
                        <p className="text-[10px] text-gray-400">
                          폐업률 {cat.closureRate}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 overflow-hidden rounded-full bg-gray-100 h-1.5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(cat.avgStartupCost / 18400) * 100}%`,
                          background: 'var(--brand-primary)',
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>

        {/* 지역별 점포 분포 */}
        <section>
          <h2 className="mb-5 text-h4 font-semibold text-gray-900">지역별 점포 분포</h2>
          <Card className="border-gray-200">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {REGION_SHARES.map((r) => (
                  <div key={r.region} className="flex items-center gap-4 px-5 py-3">
                    <a
                      href={`/regions/${r.region}`}
                      className="w-10 shrink-0 text-sm font-semibold text-gray-800 hover:underline"
                      style={{ color: 'var(--brand-primary)' }}
                    >
                      {r.region}
                    </a>
                    <div className="flex flex-1 items-center gap-2">
                      <div className="flex-1 overflow-hidden rounded-full bg-gray-100 h-2">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(r.share / maxShare) * 100}%`,
                            background: 'var(--brand-primary)',
                            opacity: 0.65,
                          }}
                        />
                      </div>
                      <span className="w-10 text-right text-sm font-bold text-gray-700">
                        {r.share}%
                      </span>
                    </div>
                    <span className="hidden w-24 text-right text-xs text-gray-400 sm:block">
                      {formatNumber(r.storeCount)}점
                    </span>
                    <span
                      className={`w-14 text-right text-xs font-semibold ${
                        r.growth >= 10 ? 'text-emerald-600' : r.growth >= 5 ? 'text-emerald-500' : 'text-gray-500'
                      }`}
                    >
                      +{r.growth}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <p className="mt-2 text-xs text-gray-400">* 성장률: 2023→2024 점포 수 기준</p>
        </section>

        {/* 연도별 추이 테이블 */}
        <section>
          <h2 className="mb-5 text-h4 font-semibold text-gray-900">연도별 시장 규모 추이</h2>
          <Card className="border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    {['연도', '등록 브랜드', '전체 점포', '평균 창업비', '신규 진입', '폐업'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {YEAR_STATS.map((ys) => (
                    <tr key={ys.year} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3.5 font-bold text-gray-900">{ys.year}</td>
                      <td className="px-5 py-3.5 text-gray-700">{formatNumber(ys.totalBrands)}개</td>
                      <td className="px-5 py-3.5 text-gray-700">{formatNumber(ys.totalStores)}점</td>
                      <td className="px-5 py-3.5 text-gray-700">{formatNumber(ys.avgStartupCost)}만원</td>
                      <td className="px-5 py-3.5 text-emerald-600 font-medium">+{formatNumber(ys.newBrands)}</td>
                      <td className="px-5 py-3.5 text-rose-500 font-medium">-{formatNumber(ys.exitedBrands)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <p className="mt-2 text-xs text-gray-400">출처: 공정거래위원회 가맹사업거래 정보공개서 (가공·재구성)</p>
        </section>

        {/* CTA */}
        <section className="rounded-3xl border border-gray-200 bg-white px-8 py-10">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
                트렌드를 확인했다면
              </p>
              <h2 className="mt-2 text-h3 font-bold text-gray-900">내 조건에 맞는 브랜드 찾기</h2>
              <p className="mt-2 text-gray-600">
                성장 중인 업종 중에서 자본·지역·수익 목표에 맞는 브랜드를 스캐너로 바로 찾아보세요.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a href="/scanner" className="flex-1">
                <button
                  className="w-full rounded-xl px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  창업 스캐너 시작
                </button>
              </a>
              <a href="/brands" className="flex-1">
                <button className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                  브랜드 전체 검색
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* 뉴스레터 */}
        <section className="rounded-3xl border border-gray-100 bg-gray-50 px-8 py-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            Newsletter
          </p>
          <h2 className="mt-2 text-h4 font-bold text-gray-900">분기별 시장 트렌드 리포트 받기</h2>
          <p className="mt-1 text-sm text-gray-500">업종별 성장률·창업비 변화·지역 동향을 정리해서 보내드립니다.</p>
          <NewsletterForm />
          <p className="mt-2 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
        </section>
      </div>
    </main>
  )
}
