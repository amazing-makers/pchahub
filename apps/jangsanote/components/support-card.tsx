import { Building2, CalendarClock, Coins, ExternalLink, Users } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { daysUntil, SUPPORT_TYPE_LABEL, type MockSupport } from '@/lib/hub-data'
import { ScrapButton } from './scrap-button'

interface SupportCardProps {
  support: MockSupport
}

const TYPE_VARIANT: Record<MockSupport['type'], 'primary' | 'warning' | 'default'> = {
  support: 'primary',
  subsidy: 'warning',
  contest: 'default',
  event: 'default',
}

export function SupportCard({ support }: SupportCardProps) {
  const d = daysUntil(support.applyEnd)
  const closed = d < 0
  return (
    <a
      href={support.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-2">
            <Badge variant={TYPE_VARIANT[support.type]}>{SUPPORT_TYPE_LABEL[support.type]}</Badge>
            <div className="flex items-center gap-2">
              {closed ? (
                <Badge variant="default">마감</Badge>
              ) : (
                <span
                  className={
                    'inline-flex items-center gap-1 text-xs font-semibold ' +
                    (d <= 7 ? 'text-rose-600' : 'text-gray-500')
                  }
                >
                  <CalendarClock className="h-3.5 w-3.5" />
                  {d === 0 ? '오늘 마감' : `D-${d}`}
                </span>
              )}
              <ScrapButton bucket="support" id={support.id} />
            </div>
          </div>

          <h3 className="mt-3 line-clamp-2 inline-flex items-start gap-1 text-base font-semibold text-gray-900">
            {support.title}
            <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-300" />
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">{support.summary}</p>

          <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-xs text-gray-600">
            <div className="inline-flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="truncate">{support.agency}</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="truncate">{support.target}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 font-semibold text-gray-900">
              <Coins className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span className="truncate">{support.amount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
