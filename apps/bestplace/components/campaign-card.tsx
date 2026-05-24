import { ArrowRight, Calendar, Users } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import {
  CAMPAIGN_STATUS_COLOR,
  CAMPAIGN_STATUS_LABEL,
  CAMPAIGN_TYPE_COLOR,
  CAMPAIGN_TYPE_LABEL,
  type Campaign,
} from '@/lib/mock-experiences'

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const fillRate = Math.round((campaign.appliedCount / (campaign.totalSlots * 4)) * 100)
  const isFull = campaign.appliedCount >= campaign.totalSlots * 4

  return (
    <a href={`/experiences/${campaign.id}`} className="group block">
      <Card className="h-full overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
        {/* Color bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: campaign.thumbnailColor }}
        />
        <CardContent className="p-5">
          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold text-white"
              style={{ background: CAMPAIGN_TYPE_COLOR[campaign.type] }}
            >
              {CAMPAIGN_TYPE_LABEL[campaign.type]}
            </span>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold text-white"
              style={{ background: CAMPAIGN_STATUS_COLOR[campaign.status] }}
            >
              {CAMPAIGN_STATUS_LABEL[campaign.status]}
            </span>
            <span className="ml-auto text-xs text-gray-400">{campaign.categoryLabel} · {campaign.region}</span>
          </div>

          {/* Store + title */}
          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                style={{ background: campaign.thumbnailColor }}
              >
                {campaign.brandName.charAt(0)}
              </span>
              <span className="text-xs text-gray-500">{campaign.storeName}</span>
            </div>
            <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] transition-colors">
              {campaign.title}
            </h3>
          </div>

          {/* Benefits preview */}
          <p className="mt-2 line-clamp-1 text-xs text-gray-500">
            혜택: {campaign.benefits[0]}
          </p>

          {/* Meta */}
          <div className="mt-3 flex flex-col gap-1">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3 shrink-0" />
              마감 {campaign.applicationDeadline}
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="h-3 w-3 shrink-0" />
                {campaign.appliedCount}명 지원 / {campaign.totalSlots}명 선발
              </div>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--brand-primary)]" />
            </div>
          </div>

          {/* Progress bar */}
          {campaign.status === 'open' && (
            <div className="mt-3">
              <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(fillRate, 100)}%`,
                    background: isFull ? '#DC2626' : campaign.thumbnailColor,
                  }}
                />
              </div>
              <p className="mt-1 text-right text-[10px] text-gray-400">
                {isFull ? '경쟁률 높음' : `경쟁률 ${(campaign.appliedCount / campaign.totalSlots).toFixed(1)}:1`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  )
}
