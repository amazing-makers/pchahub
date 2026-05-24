import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ArrowRight, CalendarDays, ChevronRight, Sparkles, Star, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import {
  CURRENT_MONTHLY_BEST,
  MONTH_LABEL,
  PAST_MONTHLY_BESTS,
} from '@/lib/mock-monthly-best'
import { CATEGORIES } from '@/lib/mock-data'

export const metadata: Metadata = buildPageMetadata('bestplace', {
  title: `${CURRENT_MONTHLY_BEST.month}월 이달의 베스트 — 베스트플레이스`,
  description: `${CURRENT_MONTHLY_BEST.year}년 ${CURRENT_MONTHLY_BEST.month}월 카테고리별 베스트 매장. 이달 가장 많이 방문하고 리뷰가 늘어난 매장들을 확인하세요.`,
  path: '/monthly-best',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '베스트플레이스', url: 'https://bestplace.amakers.co.kr' },
    { name: '이달의 베스트', url: 'https://bestplace.amakers.co.kr/monthly-best' },
  ],
})

const SELECTION_CRITERIA = [
  { label: '이달 방문객 증가', desc: '전월 대비 방문객 증가율', weight: '35%' },
  { label: '신규 리뷰 수', desc: '해당 월 신규 작성 리뷰', weight: '25%' },
  { label: '평점 유지', desc: '4.5 이상 유지 여부', weight: '20%' },
  { label: 'SNS 버즈량', desc: '해시태그·언급 급증 여부', weight: '20%' },
]

interface SearchParams { cat?: string }

export default function MonthlyBestPage({ searchParams }: { searchParams: SearchParams }) {
  const { year, month, entries } = CURRENT_MONTHLY_BEST
  const catFilter = searchParams.cat ?? 'all'

  const categories = Array.from(new Set(entries.map((e) => e.category))).map((c) => ({
    key: c,
    label: entries.find((e) => e.category === c)!.categoryLabel,
  }))

  const filtered = catFilter === 'all' ? entries : entries.filter((e) => e.category === catFilter)
  const rank1 = entries.filter((e) => e.rank === 1)

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-amber-50 to-white">
        <div className="container mx-auto py-section">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider"
                style={{ color: 'var(--brand-primary)' }}
              >
                <CalendarDays className="h-4 w-4" />
                {year}년 {MONTH_LABEL[month]} 이달의 베스트
              </p>
              <h1 className="mt-4 text-h2 font-bold text-gray-900">
                이달 가장 잘나가는
                <br />
                매장을 확인하세요
              </h1>
              <p className="mt-3 max-w-xl text-gray-600">
                방문객 증가율·신규 리뷰·SNS 버즈를 종합해 매월 카테고리별 베스트 매장을 선정합니다.
                연간 어워드와는 별개로, 이달의 핫한 매장을 가장 빠르게 확인할 수 있습니다.
              </p>
            </div>
            {/* Past months */}
            <div className="hidden flex-col gap-2 lg:flex">
              <p className="text-xs font-semibold text-gray-400">이전 달</p>
              {PAST_MONTHLY_BESTS.slice(0, 3).map((p) => (
                <a
                  key={`${p.year}-${p.month}`}
                  href={`/monthly-best?month=${p.month}`}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:border-gray-300 hover:text-gray-900"
                >
                  {p.year}.{String(p.month).padStart(2, '0')}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[
              { value: `${entries.length}개`, label: '이달 선정 매장' },
              { value: `${rank1.length}개`, label: '카테고리 1위' },
              { value: formatNumber(entries.reduce((s, e) => s + parseInt(e.metrics[0].value.replace(/[^0-9]/g, '')), 0)), label: '이달 총 방문객' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-4">
                <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 이달의 1위 spotlight */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
            <Sparkles className="h-5 w-5 text-amber-500" />
            {MONTH_LABEL[month]} 카테고리 1위
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rank1.map((entry) => (
            <a
              key={entry.storeId}
              href={`/stores/${entry.storeId}`}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
            >
              {/* Color header */}
              <div
                className="flex h-20 items-end px-5 pb-3"
                style={{
                  background: `linear-gradient(135deg, ${entry.thumbnailColor}cc, ${entry.thumbnailColor}66)`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white backdrop-blur-sm">
                    1위
                  </span>
                  <span className="text-sm font-semibold text-white">{entry.categoryLabel}</span>
                  {entry.isNew && (
                    <span className="rounded-full bg-white/30 px-2 py-0.5 text-[10px] font-semibold text-white">
                      NEW
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-gray-400">{entry.brandName}</div>
                <div className="mt-1 text-base font-bold text-gray-900 group-hover:text-[var(--brand-primary)] transition-colors">
                  {entry.storeName}
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {entry.metrics[2]?.value} · {entry.region} {entry.district}
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">{entry.reason}</p>
                <div className="mt-3 flex gap-3">
                  {entry.metrics.slice(0, 2).map((m) => (
                    <div key={m.label}>
                      <div className="text-xs font-bold text-gray-900">{m.value}</div>
                      <div className="text-[10px] text-gray-400">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Full list with category filter */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <h2 className="flex items-center gap-2 text-h3 font-semibold text-gray-900">
            <TrendingUp className="h-5 w-5 text-gray-400" />
            전체 선정 매장
          </h2>
          <div className="ml-auto flex flex-wrap gap-1.5">
            <a
              href="/monthly-best"
              className={
                'rounded-full border px-3 py-1 text-xs font-semibold ' +
                (catFilter === 'all'
                  ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300')
              }
            >
              전체
            </a>
            {categories.map((c) => (
              <a
                key={c.key}
                href={`/monthly-best?cat=${c.key}`}
                className={
                  'rounded-full border px-3 py-1 text-xs font-semibold ' +
                  (catFilter === c.key
                    ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300')
                }
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((entry) => (
            <a
              key={entry.storeId}
              href={`/stores/${entry.storeId}`}
              className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
            >
              {/* Rank badge */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                style={{ background: entry.thumbnailColor }}
              >
                {entry.rank}위
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{entry.brandName}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                    style={{ background: entry.thumbnailColor + '99' }}
                  >
                    {entry.categoryLabel}
                  </span>
                  {entry.isNew && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      NEW
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] transition-colors">
                  {entry.storeName}
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-gray-500">{entry.reason}</p>
              </div>

              {/* Metrics */}
              <div className="hidden shrink-0 items-center gap-4 sm:flex">
                {entry.metrics.map((m) => (
                  <div key={m.label} className="text-right">
                    <div className="text-sm font-bold text-gray-900">{m.value}</div>
                    <div className="text-[10px] text-gray-400">{m.label}</div>
                  </div>
                ))}
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-gray-500" />
            </a>
          ))}
        </div>
      </section>

      {/* Selection criteria */}
      <section className="container mx-auto py-section">
        <Card className="border-gray-200">
          <CardContent className="p-8">
            <h2 className="text-base font-semibold text-gray-900">선정 기준</h2>
            <p className="mt-1 text-sm text-gray-500">이달의 베스트는 아래 4가지 지표를 종합해 산정합니다.</p>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {SELECTION_CRITERIA.map((c) => (
                <div key={c.label} className="rounded-xl bg-gray-50 p-4">
                  <div className="text-lg font-black" style={{ color: 'var(--brand-primary)' }}>
                    {c.weight}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">{c.label}</div>
                  <p className="mt-1 text-xs text-gray-500">{c.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA — 연간 어워드 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">연간 베스트도 확인하세요</p>
              <h2 className="mt-1 text-h3 font-bold text-gray-900">2026 베스트플레이스 어워드</h2>
            </div>
            <a
              href="/awards/2026"
              className="inline-flex items-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              어워드 보기 <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
