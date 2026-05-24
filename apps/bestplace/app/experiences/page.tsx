import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ArrowRight, BookOpen, Camera, Megaphone, Sparkles, Users } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { CampaignCard } from '@/components/campaign-card'
import {
  CAMPAIGNS,
  CAMPAIGN_TYPE_COLOR,
  CAMPAIGN_TYPE_LABEL,
  type CampaignStatus,
  type CampaignType,
} from '@/lib/mock-experiences'

export const metadata: Metadata = buildPageMetadata('bestplace', {
  title: '체험단·기자단 — 베스트플레이스',
  description: '베스트플레이스 인증 매장의 체험단·기자단·SNS서포터즈에 지원하고 무료 체험 혜택을 받아보세요.',
  path: '/experiences',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '베스트플레이스', url: 'https://bestplace.amakers.co.kr' },
    { name: '체험단·기자단', url: 'https://bestplace.amakers.co.kr/experiences' },
  ],
})

const TYPE_ICONS = {
  experience: Sparkles,
  press: BookOpen,
  sns: Camera,
}

const HOW_IT_WORKS = [
  {
    step: 1,
    title: '캠페인 탐색',
    body: '관심 있는 매장의 체험단·기자단·SNS서포터즈 캠페인을 확인합니다.',
    icon: Megaphone,
  },
  {
    step: 2,
    title: '지원서 제출',
    body: '지원 조건 확인 후 SNS 계정·지원 동기를 간단히 작성해 제출합니다.',
    icon: Users,
  },
  {
    step: 3,
    title: '선발 통보',
    body: '마감 후 2~3일 이내 선발 결과를 이메일로 받아봅니다.',
    icon: Sparkles,
  },
  {
    step: 4,
    title: '미션 수행 + 혜택',
    body: '매장 방문 후 정해진 미션을 완료하면 모든 혜택을 받을 수 있습니다.',
    icon: ArrowRight,
  },
]

interface SearchParams {
  type?: string
  status?: string
}

export default function ExperiencesPage({ searchParams }: { searchParams: SearchParams }) {
  const typeFilter = (searchParams.type as CampaignType | undefined) ?? 'all'
  const statusFilter = (searchParams.status as CampaignStatus | undefined) ?? 'all'

  const filtered = CAMPAIGNS.filter((c) => {
    const typeOk = typeFilter === 'all' || c.type === typeFilter
    const statusOk = statusFilter === 'all' || c.status === statusFilter
    return typeOk && statusOk
  })

  const openCount = CAMPAIGNS.filter((c) => c.status === 'open').length
  const ongoingCount = CAMPAIGNS.filter((c) => c.status === 'ongoing').length

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-violet-50 to-white">
        <div className="container mx-auto py-section">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            체험단 · 기자단 · SNS서포터즈
          </p>
          <h1 className="mt-4 text-h2 font-bold text-gray-900">
            베스트 매장을 먼저 경험하고
            <br />
            혜택도 받아가세요
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            베스트플레이스 인증 매장이 진행하는 체험단·기자단·SNS서포터즈 캠페인에 지원하고,
            무료 식음료 체험과 원고료 혜택을 받아보세요.
          </p>

          {/* Type quick links */}
          <div className="mt-8 flex flex-wrap gap-3">
            {(['experience', 'press', 'sns'] as CampaignType[]).map((t) => {
              const Icon = TYPE_ICONS[t]
              return (
                <a
                  key={t}
                  href={`/experiences?type=${t}`}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: CAMPAIGN_TYPE_COLOR[t] }}
                >
                  <Icon className="h-4 w-4" />
                  {CAMPAIGN_TYPE_LABEL[t]}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[
              { value: `${CAMPAIGNS.length}개`, label: '전체 캠페인' },
              { value: `${openCount}개`, label: '현재 모집중' },
              { value: `${ongoingCount}개`, label: '활동 진행중' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-4">
                <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">참여 방법</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {HOW_IT_WORKS.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.step} className="flex items-start gap-3">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: 'var(--brand-primary)' }}
                  >
                    {s.step}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{s.title}</div>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{s.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="container mx-auto py-section">
        {/* Filter bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Type filter */}
          <div className="flex flex-wrap gap-1.5">
            {([['all', '전체'], ['experience', '체험단'], ['press', '기자단'], ['sns', 'SNS서포터즈']] as [string, string][]).map(
              ([val, label]) => (
                <a
                  key={val}
                  href={`/experiences?type=${val}${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`}
                  className={
                    'rounded-full border px-3 py-1 text-xs font-semibold transition-colors ' +
                    (typeFilter === val
                      ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300')
                  }
                >
                  {label}
                </a>
              )
            )}
          </div>
          <div className="h-4 w-px bg-gray-200" />
          {/* Status filter */}
          <div className="flex flex-wrap gap-1.5">
            {([['all', '전체'], ['open', '모집중'], ['ongoing', '활동중'], ['completed', '완료']] as [string, string][]).map(
              ([val, label]) => (
                <a
                  key={val}
                  href={`/experiences?status=${val}${typeFilter !== 'all' ? `&type=${typeFilter}` : ''}`}
                  className={
                    'rounded-full border px-3 py-1 text-xs font-semibold transition-colors ' +
                    (statusFilter === val
                      ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300')
                  }
                >
                  {label}
                </a>
              )
            )}
          </div>
          <span className="ml-auto text-sm text-gray-500">{filtered.length}개</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <Megaphone className="mx-auto h-10 w-10 opacity-30" />
            <p className="mt-4 text-sm">해당 조건의 캠페인이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </section>

      {/* 매장 오너 CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <Card className="border-gray-200 bg-gray-900 text-white">
            <CardContent className="p-10">
              <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
                <div>
                  <p
                    className="text-sm font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    매장 오너를 위한 서비스
                  </p>
                  <h2 className="mt-3 text-h2 font-bold">
                    우리 매장도 체험단·기자단을
                    <br />
                    운영해보세요
                  </h2>
                  <p className="mt-3 max-w-xl text-gray-300">
                    베스트플레이스 인증 매장이라면 체험단·기자단 캠페인을 직접 개설할 수 있습니다.
                    진성 리뷰어들이 실제 방문해 콘텐츠를 만들어드립니다.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href="/stores/new"
                    className="rounded-md px-5 py-2.5 text-center text-sm font-semibold text-gray-900"
                    style={{ background: 'var(--brand-primary)' }}
                  >
                    매장 등록하기
                  </a>
                  <a
                    href="/stores"
                    className="rounded-md bg-white/10 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-white/20"
                  >
                    인증 매장 보기
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
