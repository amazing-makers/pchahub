import type { Metadata } from 'next'
import { HandCoins, Plus } from 'lucide-react'
import { Card, CardContent, NewsletterForm } from '@amakers/ui'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { SupportCard } from '@/components/support-card'
import { CommunitySupportFeed } from '@/components/community-support-feed'
import { SUPPORT_TYPE_LABEL, type SupportType } from '@/lib/hub-data'
import { getSupports, getHubDataSource } from '@/lib/sources/hub-source'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '지원·이벤트 정보',
  description: '소상공인·자영업자를 위한 정부·지자체 지원사업, 보조금, 공모전, 이벤트를 마감일 순으로 한곳에. 놓치기 쉬운 지원금을 챙기세요.',
  path: '/support',
})

const TYPE_FILTERS: Array<{ key: string; label: string }> = [
  { key: 'all', label: '전체' },
  { key: 'support', label: SUPPORT_TYPE_LABEL.support },
  { key: 'subsidy', label: SUPPORT_TYPE_LABEL.subsidy },
  { key: 'contest', label: SUPPORT_TYPE_LABEL.contest },
  { key: 'event', label: SUPPORT_TYPE_LABEL.event },
]

interface SupportPageProps {
  searchParams: { type?: string }
}

export default async function SupportPage({ searchParams }: SupportPageProps) {
  const active = TYPE_FILTERS.some((t) => t.key === searchParams.type) ? searchParams.type! : 'all'
  const today = new Date().toISOString().slice(0, 10)
  const all = (await getSupports()).sort((a, b) => {
    const aOpen = a.applyEnd >= today
    const bOpen = b.applyEnd >= today
    if (aOpen !== bOpen) return aOpen ? -1 : 1
    return a.applyEnd.localeCompare(b.applyEnd)
  })
  const items = active === 'all' ? all : all.filter((s) => s.type === (active as SupportType))
  const dataSource = getHubDataSource()

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '장사노트', url: 'https://jangsanote.amakers.co.kr' },
      { name: '지원·이벤트', url: 'https://jangsanote.amakers.co.kr/support' },
    ],
  })
  const listJsonLd = buildItemListJsonLd({
    url: 'https://jangsanote.amakers.co.kr/support',
    items: items.slice(0, 20).map((s) => ({ name: s.title, url: s.link })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={listJsonLd} />

      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="inline-flex items-center gap-2 text-h3 font-bold text-gray-900">
                <HandCoins className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
                지원·이벤트
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                정부·지자체 지원사업, 보조금, 공모전, 이벤트를 마감일 순으로 모았습니다. 놓치기 쉬운 지원금을 챙기세요.
              </p>
            </div>
            <a
              href="/support/new"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              <Plus className="h-4 w-4" />
              제보하기
            </a>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {TYPE_FILTERS.map((t) => {
              const isActive = t.key === active
              return (
                <a
                  key={t.key}
                  href={t.key === 'all' ? '/support' : `/support?type=${t.key}`}
                  className={
                    'rounded-full px-3 py-1 text-xs font-medium transition-colors ' +
                    (isActive ? 'text-white' : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300')
                  }
                  style={isActive ? { background: 'var(--brand-primary)' } : undefined}
                >
                  {t.label}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CommunitySupportFeed typeFilter={active} />
          {items.map((s) => (
            <SupportCard key={s.id} support={s} />
          ))}
        </div>
        {items.length === 0 && (
          <Card className="mt-4">
            <CardContent className="p-10 text-center text-sm text-gray-500">
              해당 유형의 등록된 정보가 없습니다. 알고 있는 지원·이벤트를 제보해보세요.
            </CardContent>
          </Card>
        )}
        <p className="mt-6 text-center text-xs text-gray-400">
          데이터 출처: {dataSource === 'api' ? '공공데이터포털(data.go.kr) + amakers 큐레이션 + 점주 제보' : 'amakers 큐레이션 + 점주 제보'}
          <br />
          ※ 지원 내용·일정은 주관기관 사정에 따라 변경될 수 있으니 신청 전 공식 사이트에서 확인하세요.
        </p>
      </div>

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">지원사업 마감 전에 알림 받기</h2>
            <p className="mt-2 text-sm text-gray-500">새 지원사업·보조금·공모 소식과 마감 임박 알림을 격주로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}
