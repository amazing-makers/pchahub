import type { Metadata } from 'next'
import { CalendarDays, Plus } from 'lucide-react'
import { Card, CardContent, NewsletterForm } from '@amakers/ui'
import { CommunityFestivalFeed } from '@/components/community-festival-feed'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { FestivalCard } from '@/components/festival-card'
import { FESTIVAL_TYPE_LABEL, type FestivalType } from '@/lib/hub-data'
import { getFestivals } from '@/lib/sources/hub-source'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '축제·박람회 정보',
  description: '창업·외식·지역 박람회와 축제, 플리마켓 일정을 한곳에. 부스 참가·트렌드 파악·신메뉴 테스트 기회를 놓치지 마세요.',
  path: '/festivals',
})

const TYPE_FILTERS: Array<{ key: string; label: string }> = [
  { key: 'all', label: '전체' },
  { key: 'expo', label: FESTIVAL_TYPE_LABEL.expo },
  { key: 'festival', label: FESTIVAL_TYPE_LABEL.festival },
  { key: 'market', label: FESTIVAL_TYPE_LABEL.market },
]

interface FestivalsPageProps {
  searchParams: { type?: string }
}

export default async function FestivalsPage({ searchParams }: FestivalsPageProps) {
  const active = TYPE_FILTERS.some((t) => t.key === searchParams.type) ? searchParams.type! : 'all'
  const all = (await getFestivals()).sort((a, b) => a.startDate.localeCompare(b.startDate))
  const festivals = active === 'all' ? all : all.filter((f) => f.type === (active as FestivalType))

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '장사노트', url: 'https://jangsanote.amakers.co.kr' },
      { name: '축제·박람회', url: 'https://jangsanote.amakers.co.kr/festivals' },
    ],
  })
  const listJsonLd = buildItemListJsonLd({
    url: 'https://jangsanote.amakers.co.kr/festivals',
    items: festivals.slice(0, 20).map((f) => ({ name: f.title, url: f.website })),
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
                <CalendarDays className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
                축제·박람회
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                창업·외식·지역 박람회와 축제, 플리마켓 일정을 모았습니다. 부스 참가·트렌드 파악 기회를 챙기세요.
              </p>
            </div>
            <a
              href="/festivals/new"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              <Plus className="h-4 w-4" />
              행사 제보
            </a>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {TYPE_FILTERS.map((t) => {
              const isActive = t.key === active
              return (
                <a
                  key={t.key}
                  href={t.key === 'all' ? '/festivals' : `/festivals?type=${t.key}`}
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
          <CommunityFestivalFeed typeFilter={active} />
          {festivals.map((f) => (
            <FestivalCard key={f.id} festival={f} />
          ))}
        </div>
        {festivals.length === 0 && (
          <Card className="mt-4">
            <CardContent className="p-10 text-center text-sm text-gray-500">
              해당 유형의 등록된 일정이 없습니다. 알고 있는 행사를 제보해보세요.
            </CardContent>
          </Card>
        )}
      </div>

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">박람회·축제 일정을 미리 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">다가오는 창업·외식 박람회와 지역 축제 소식을 격주로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}
