import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { Badge, BrandLogo, Card, CardContent, MobileCTA, NewsletterForm } from '@amakers/ui'
import {
  buildBreadcrumbsJsonLd,
  buildInvestmentJsonLd,
  buildPageMetadata,
  JsonLd,
} from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import {
  brandById,
  daysUntil,
  progressPercent,
  ROUND_STATUS_COLOR,
  ROUND_STATUS_LABEL,
  ROUND_TYPE_LABEL,
  ROUNDS,
  roundById,
} from '@/lib/mock-data'
import { RoundCard } from '@/components/round-card'
import { WatchButton } from '../watch-button'
import { InvestForm } from './invest-form'
import { IrRequestButton } from './ir-request-button'
import { ShareRoundButton } from './share-round-button'
import { RoundViewTracker } from './round-view-tracker'

export function generateStaticParams() {
  return ROUNDS.map((r) => ({ id: r.id }))
}

interface RoundDetailProps {
  params: { id: string }
}

export function generateMetadata({ params }: RoundDetailProps): Metadata {
  const round = roundById(params.id)
  if (!round) return {}
  const brand = brandById(round.brandId)
  return buildPageMetadata('pchabridge', {
    title: `${brand?.name ?? '브랜드'} ${ROUND_TYPE_LABEL[round.type]} — ${ROUND_STATUS_LABEL[round.status]}`,
    description: `${round.hook} · 목표 ${formatNumber(round.targetAmount)}만 · 현재 ${formatNumber(round.currentAmount)}만 · 예상 ROI ${round.expectedAnnualROI}% · 마감 ${round.closeDate}.`,
    path: `/investments/${round.id}`,
  })
}

export default function RoundDetailPage({ params }: RoundDetailProps) {
  const round = roundById(params.id)
  if (!round) notFound()
  const brand = brandById(round.brandId)
  const progress = progressPercent(round)
  const days = daysUntil(round.closeDate)
  const related = ROUNDS.filter((r) => r.id !== round.id && r.status === 'open').slice(0, 3)
  const maxUseShare = Math.max(...round.useOfFunds.map((u) => u.share), 1)

  const roundUrl = `https://pchabridge.amakers.co.kr/investments/${round.id}`
  const investmentJsonLd = buildInvestmentJsonLd({
    name: `${brand?.name ?? '브랜드'} ${ROUND_TYPE_LABEL[round.type]}`,
    description: round.hook,
    url: roundUrl,
    targetAmount: round.targetAmount,
    expectedRoi: round.expectedAnnualROI,
    closeDate: round.closeDate,
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '투자 라운드', url: 'https://pchabridge.amakers.co.kr/investments' },
      { name: ROUND_TYPE_LABEL[round.type], url: `https://pchabridge.amakers.co.kr/investments?type=${round.type}` },
      { name: brand?.name ?? '라운드', url: roundUrl },
    ],
  })

  return (
    <main className="bg-gray-50">
      <RoundViewTracker roundId={round.id} />
      <JsonLd data={investmentJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/investments" className="hover:text-gray-900">투자 라운드</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{brand?.name ?? '라운드'}</span>
          </nav>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">{ROUND_TYPE_LABEL[round.type]}</Badge>
                <Badge variant={ROUND_STATUS_COLOR[round.status]}>
                  {ROUND_STATUS_LABEL[round.status]}
                </Badge>
                {round.featured && <Badge variant="warning">주목</Badge>}
              </div>

              <div className="mt-4 flex items-start gap-4">
                {brand && (
                  <BrandLogo brand={brand} size="lg" bordered />
                )}
                <div className="min-w-0 flex-1">
                  <h1 className="text-h2 font-bold text-gray-900">
                    {brand?.name ?? '브랜드'} {ROUND_TYPE_LABEL[round.type]}
                  </h1>
                  <div className="mt-1 text-sm text-gray-500">
                    {brand?.categoryLabel} · 매장 {brand?.storeCount}개 ·{' '}
                    {brand?.foundedYear}년 설립
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <WatchButton roundId={round.id} />
                  <ShareRoundButton roundLabel={`${brand?.name ?? '브랜드'} ${ROUND_TYPE_LABEL[round.type]}`} />
                </div>
              </div>

              <p className="mt-4 text-base text-gray-700">{round.hook}</p>
            </div>

            <aside id="cta">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <div>
                    <div className="text-xs text-gray-500">목표 / 현재</div>
                    <div className="mt-1 text-base font-bold text-gray-900">
                      {formatNumber(round.currentAmount)}만
                      <span className="text-sm font-medium text-gray-500">
                        {' '}/ {formatNumber(round.targetAmount)}만
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${progress}%`, background: 'var(--brand-primary)' }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">{progress}% 달성</div>
                  </div>

                  <div className="space-y-1.5 rounded-lg bg-gray-50 p-3 text-sm">
                    <Row label="최소 투자" value={`${formatNumber(round.minInvestment)}만원`} />
                    {round.valuation > 0 && (
                      <Row label="기업가치 (Pre)" value={`${formatNumber(round.valuation)}만`} />
                    )}
                    <Row
                      label="예상 ROI"
                      value={
                        <span className="text-emerald-600">+{round.expectedAnnualROI}% / 년</span>
                      }
                    />
                    <Row label="마감일" value={round.closeDate} />
                    <Row
                      label="잔여 일수"
                      value={days > 0 ? `${days}일` : '마감'}
                    />
                  </div>

                  <InvestForm
                    roundId={round.id}
                    brandName={brand?.name ?? '브랜드'}
                    minInvestment={round.minInvestment}
                    expectedROI={round.expectedAnnualROI}
                    closeDate={round.closeDate}
                    isOpen={round.status === 'open'}
                  />
                  {round.status === 'open' && (
                    <IrRequestButton
                      roundId={round.id}
                      brandName={brand?.name ?? '브랜드'}
                    />
                  )}
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-6">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-h4 font-semibold text-gray-900">투자 제안</h2>
            <article className="mt-4 space-y-4 text-base leading-relaxed text-gray-800">
              {round.pitch.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-h4 font-semibold text-gray-900">핵심 지표</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {round.highlights.map((h) => (
                  <div key={h.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-xs text-gray-500">{h.label}</div>
                    <div className="mt-1 text-base font-bold text-gray-900">{h.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {round.useOfFunds.length > 0 && (
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-h4 font-semibold text-gray-900">자금 사용처</h2>
                <div className="mt-4 space-y-2.5">
                  {round.useOfFunds.map((u) => (
                    <div key={u.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{u.label}</span>
                        <span className="font-semibold text-gray-900">{u.share}%</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(u.share / maxUseShare) * 100}%`,
                            background: 'var(--brand-primary)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {round.risks.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900">
                <AlertCircle className="h-4 w-4" />
                투자 위험 요인
              </div>
              <ul className="mt-3 space-y-2 text-sm text-amber-800">
                {round.risks.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" />
                    {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {related.length > 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-h4 font-semibold text-gray-900">다른 모집 중 라운드</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <RoundCard key={r.id} round={r} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>

      {/* 뉴스레터 CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h4 font-bold text-gray-900">프랜차이즈 투자 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 투자 라운드 오픈·M&A 기회·가맹 투자 인사이트를 격주로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>

      <MobileCTA label="투자 문의하기" href="#cta" />
    </main>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-semibold text-gray-900">{value}</span>
    </div>
  )
}
