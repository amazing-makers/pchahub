import { Calendar, TrendingUp } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import {
  brandById,
  daysUntil,
  progressPercent,
  ROUND_STATUS_COLOR,
  ROUND_STATUS_LABEL,
  ROUND_TYPE_LABEL,
  type MockInvestmentRound,
} from '@/lib/mock-data'

interface RoundCardProps {
  round: MockInvestmentRound
}

export function RoundCard({ round }: RoundCardProps) {
  const brand = brandById(round.brandId)
  const progress = progressPercent(round)
  const days = daysUntil(round.closeDate)

  return (
    <a href={`/investments/${round.id}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="primary">{ROUND_TYPE_LABEL[round.type]}</Badge>
            <Badge variant={ROUND_STATUS_COLOR[round.status]}>
              {ROUND_STATUS_LABEL[round.status]}
            </Badge>
          </div>

          <div className="mt-4 flex items-start gap-3">
            {brand && (
              <span
                className="h-12 w-12 shrink-0 rounded-xl"
                style={{ background: brand.logoColor }}
                aria-hidden
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="text-base font-bold text-gray-900">{brand?.name ?? '브랜드'}</div>
              <div className="mt-0.5 text-xs text-gray-500">
                {brand?.categoryLabel} · 매장 {brand?.storeCount}개
              </div>
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-gray-700">{round.hook}</p>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-end justify-between text-xs">
              <div>
                <span className="font-bold text-gray-900">
                  {formatNumber(round.currentAmount)}만
                </span>
                <span className="text-gray-500"> / {formatNumber(round.targetAmount)}만</span>
              </div>
              <span className="font-semibold" style={{ color: 'var(--brand-primary)' }}>
                {progress}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${progress}%`, background: 'var(--brand-primary)' }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-xs">
            <div>
              <div className="text-gray-500">최소 투자</div>
              <div className="mt-0.5 font-semibold text-gray-900">
                {formatNumber(round.minInvestment)}만
              </div>
            </div>
            <div>
              <div className="text-gray-500 inline-flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                예상 ROI
              </div>
              <div className="mt-0.5 font-semibold text-emerald-600">
                +{round.expectedAnnualROI}%
              </div>
            </div>
            <div>
              <div className="text-gray-500 inline-flex items-center gap-0.5">
                <Calendar className="h-3 w-3" />
                마감
              </div>
              <div className="mt-0.5 font-semibold text-gray-900">
                {days > 0 ? `${days}일` : '마감'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
