import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ArrowLeft, Calendar, CheckCircle2, MapPin, Star, Users } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import {
  campaignById,
  CAMPAIGN_STATUS_COLOR,
  CAMPAIGN_STATUS_LABEL,
  CAMPAIGN_TYPE_COLOR,
  CAMPAIGN_TYPE_LABEL,
} from '@/lib/mock-experiences'
import { storeById } from '@/lib/mock-data'
import { ExperienceApplyForm } from './apply-form'

interface Props {
  params: { id: string }
}

export function generateMetadata({ params }: Props): Metadata {
  const c = campaignById(params.id)
  if (!c) return {}
  return buildPageMetadata('bestplace', {
    title: `${c.title} — 체험단·기자단`,
    description: `${c.storeName} ${CAMPAIGN_TYPE_LABEL[c.type]} 모집. 혜택: ${c.benefits[0]}`,
    path: `/experiences/${c.id}`,
  })
}

export default function ExperienceDetailPage({ params }: Props) {
  const campaign = campaignById(params.id)
  if (!campaign) notFound()

  const store = storeById(campaign.storeId)
  const isOpen = campaign.status === 'open'
  const competitionRate = (campaign.appliedCount / campaign.totalSlots).toFixed(1)

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '베스트플레이스', url: 'https://bestplace.amakers.co.kr' },
      { name: '체험단·기자단', url: 'https://bestplace.amakers.co.kr/experiences' },
      { name: campaign.title, url: `https://bestplace.amakers.co.kr/experiences/${campaign.id}` },
    ],
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />

      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/experiences" className="inline-flex items-center gap-1 hover:text-gray-900">
              <ArrowLeft className="h-3.5 w-3.5" /> 체험단·기자단
            </a>
            <span className="mx-1">/</span>
            <span className="text-gray-700 line-clamp-1">{campaign.title}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-start gap-3">
            <div className="flex flex-wrap gap-1.5">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                style={{ background: CAMPAIGN_TYPE_COLOR[campaign.type] }}
              >
                {CAMPAIGN_TYPE_LABEL[campaign.type]}
              </span>
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                style={{ background: CAMPAIGN_STATUS_COLOR[campaign.status] }}
              >
                {CAMPAIGN_STATUS_LABEL[campaign.status]}
              </span>
            </div>
          </div>

          <h1 className="mt-3 text-h3 font-bold text-gray-900">{campaign.title}</h1>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {campaign.storeName} · {campaign.region} {campaign.district}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> 신청 마감 {campaign.applicationDeadline}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {campaign.appliedCount}명 지원 / {campaign.totalSlots}명 선발 (경쟁률 {competitionRate}:1)
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left: details */}
          <div className="space-y-5">
            {/* Description */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-sm font-semibold text-gray-900">캠페인 소개</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{campaign.description}</p>
              </CardContent>
            </Card>

            {/* Activity period */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-sm font-semibold text-gray-900">활동 기간</h2>
                <p className="mt-3 text-sm text-gray-700">{campaign.activityPeriod}</p>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-sm font-semibold text-gray-900">제공 혜택</h2>
                <ul className="mt-3 space-y-2">
                  {campaign.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--brand-primary)' }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Missions */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-sm font-semibold text-gray-900">수행 미션</h2>
                <ul className="mt-3 space-y-2">
                  {campaign.missions.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span
                        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ background: 'var(--brand-primary)' }}
                      >
                        {i + 1}
                      </span>
                      {m}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-sm font-semibold text-gray-900">지원 조건</h2>
                <ul className="mt-3 space-y-2">
                  {campaign.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      {r}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Store info */}
            {store && (
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-sm font-semibold text-gray-900">매장 정보</h2>
                  <div className="mt-3 flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
                      style={{ background: campaign.thumbnailColor }}
                    >
                      {campaign.brandName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{store.name}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-sm text-gray-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {store.rating} · 리뷰 {store.reviewCount}건 · {store.address}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <a
                      href={`/stores/${store.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium hover:opacity-80"
                      style={{ color: 'var(--brand-primary)' }}
                    >
                      매장 상세 보기 <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: apply form */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  <div
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white"
                    style={{ background: CAMPAIGN_TYPE_COLOR[campaign.type] }}
                  >
                    {CAMPAIGN_TYPE_LABEL[campaign.type].charAt(0)}
                  </div>
                  <div className="mt-3 text-lg font-bold text-gray-900">
                    {isOpen ? `${campaign.totalSlots}명 선발` : CAMPAIGN_STATUS_LABEL[campaign.status]}
                  </div>
                  <div className="text-sm text-gray-500">
                    {isOpen ? `${campaign.appliedCount}명 지원 중` : '모집이 마감되었습니다'}
                  </div>
                </div>

                {isOpen && (
                  <>
                    {/* Progress */}
                    <div className="mt-4">
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((campaign.appliedCount / (campaign.totalSlots * 4)) * 100, 100)}%`,
                            background: CAMPAIGN_TYPE_COLOR[campaign.type],
                          }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-gray-400">
                        <span>신청 마감 {campaign.applicationDeadline}</span>
                        <span>경쟁률 {competitionRate}:1</span>
                      </div>
                    </div>
                    <ExperienceApplyForm campaignId={campaign.id} campaignType={campaign.type} />
                  </>
                )}

                {!isOpen && campaign.status === 'ongoing' && (
                  <div className="mt-4 rounded-xl bg-blue-50 p-4 text-center text-sm text-blue-700">
                    현재 선발된 참여자들이 활동 중입니다.
                  </div>
                )}

                {!isOpen && campaign.status === 'completed' && (
                  <div className="mt-4 rounded-xl bg-gray-100 p-4 text-center text-sm text-gray-500">
                    캠페인이 완료되었습니다.
                    <br />
                    <a href="/experiences" className="mt-2 inline-block text-xs font-medium underline">
                      진행중인 다른 캠페인 보기
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Back link */}
            <div className="mt-3 text-center">
              <a href="/experiences" className="text-xs text-gray-400 hover:text-gray-700">
                ← 전체 캠페인 목록으로
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
