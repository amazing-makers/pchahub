import type { Metadata } from 'next'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '모임',
  description: '장사노트 오프라인 모임 목록. 지역·유형별로 참여하세요.',
  path: '/meetings',
})

import { Calendar, Plus, Search } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { MEETINGS, MEETING_TYPE_LABEL, type MeetingType } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'
import { MeetingCard } from '@/components/meeting-card'
import { MobileFilterToggle } from '@/components/mobile-filter-toggle'

const TYPES: Array<{ value: '' | MeetingType;

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '장사노트', url: 'https://jangsanote.amakers.co.kr' },
    { name: '오프라인 모임', url: 'https://jangsanote.amakers.co.kr/meetings' },
  ],
}) label: string }> = [
  { value: '', label: '전체' },
  { value: 'offline', label: '오프라인' },
  { value: 'online', label: '온라인' },
  { value: 'hybrid', label: '온·오프 동시' },
]

const REGIONS = ['전국', '서울', '경기', '부산', '대구', '대전', '광주', '울산']

interface MeetingsPageProps {
  searchParams: { type?: string; region?: string; status?: string; q?: string }
}

export default function MeetingsPage({ searchParams }: MeetingsPageProps) {
  const { type = '', region = '전국', status = 'upcoming', q } = searchParams
  const needle = q?.toLowerCase().trim() ?? ''

  let results = MEETINGS.slice()
  if (status !== 'all') results = results.filter((m) => m.status === status)
  if (type) results = results.filter((m) => m.type === type)
  if (region && region !== '전국') results = results.filter((m) => m.region === region)
  if (needle) {
    results = results.filter(
      (m) =>
        m.title.toLowerCase().includes(needle) ||
        m.description.toLowerCase().includes(needle) ||
        m.location.toLowerCase().includes(needle) ||
        m.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }
  results.sort((a, b) => a.date.localeCompare(b.date))

  const listJsonLd = buildItemListJsonLd({
    url: 'https://jangsanote.amakers.co.kr/meetings',
    items: results.slice(0, 20).map((m) => ({ name: m.title, url: `https://jangsanote.amakers.co.kr/meetings/${m.id}` })),
  })

  const upcomingCount = MEETINGS.filter((m) => m.status === 'upcoming').length
  const totalParticipants = MEETINGS.reduce((s, m) => s + m.currentParticipants, 0)
  const freeCount = MEETINGS.filter((m) => m.isFree).length
  const regionCount = new Set(MEETINGS.map((m) => m.region)).size

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="inline-flex items-center gap-2 text-h3 font-bold text-gray-900">
                <Calendar className="h-6 w-6 text-amber-500" />
                모임
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                전국 자영업·가맹점주 + 전문가가 직접 여는 오프라인·온라인 모임. 무료부터 유료 강연까지.
              </p>
            </div>
            <a href="/meetings/new">
              <Button size="md" className="gap-1">
                <Plus className="h-4 w-4" />
                모임 만들기
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 통계 스트립 */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-4">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{upcomingCount}개</span>
              <span className="text-[11px] font-semibold text-gray-700">모집 중</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{formatNumber(totalParticipants)}명</span>
              <span className="text-[11px] font-semibold text-gray-700">누적 참여자</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{freeCount}개</span>
              <span className="text-[11px] font-semibold text-gray-700">무료 모임</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{regionCount}개</span>
              <span className="text-[11px] font-semibold text-gray-700">지역 커버</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {/* 모바일 필터 */}
        <div className="mb-4">
          <MobileFilterToggle>
            <div className="space-y-4">
              <FilterGroup title="유형">
                <div className="space-y-1">
                  {TYPES.map((t) => (
                    <FilterLink
                      key={t.value || 'all'}
                      href={makeHref(searchParams, { type: t.value })}
                      active={(t.value === '' && !type) || type === t.value}
                    >
                      {t.label}
                    </FilterLink>
                  ))}
                </div>
              </FilterGroup>
              <FilterGroup title="지역">
                <div className="space-y-1">
                  {REGIONS.map((r) => (
                    <FilterLink
                      key={r}
                      href={makeHref(searchParams, { region: r })}
                      active={(r === '전국' && !region) || region === r}
                    >
                      {r}
                    </FilterLink>
                  ))}
                </div>
              </FilterGroup>
              <FilterGroup title="상태">
                <div className="space-y-1">
                  <FilterLink href={makeHref(searchParams, { status: 'upcoming' })} active={status === 'upcoming'}>예정된 모임</FilterLink>
                  <FilterLink href={makeHref(searchParams, { status: 'all' })} active={status === 'all'}>전체 (마감 포함)</FilterLink>
                </div>
              </FilterGroup>
            </div>
          </MobileFilterToggle>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden space-y-5 lg:block lg:sticky lg:top-20 lg:self-start">
            <FilterGroup title="유형">
              <div className="space-y-1">
                {TYPES.map((t) => (
                  <FilterLink
                    key={t.value || 'all'}
                    href={makeHref(searchParams, { type: t.value })}
                    active={(t.value === '' && !type) || type === t.value}
                  >
                    {t.label}
                  </FilterLink>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="지역">
              <div className="space-y-1">
                {REGIONS.map((r) => (
                  <FilterLink
                    key={r}
                    href={makeHref(searchParams, { region: r })}
                    active={(r === '전국' && !region) || region === r}
                  >
                    {r}
                  </FilterLink>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="상태">
              <div className="space-y-1">
                <FilterLink
                  href={makeHref(searchParams, { status: 'upcoming' })}
                  active={status === 'upcoming'}
                >
                  예정된 모임
                </FilterLink>
                <FilterLink
                  href={makeHref(searchParams, { status: 'all' })}
                  active={status === 'all'}
                >
                  전체 (마감 포함)
                </FilterLink>
              </div>
            </FilterGroup>

            <Card className="border-gray-200 bg-amber-50">
              <CardContent className="p-4 text-xs">
                <div className="font-semibold text-amber-900">모임 운영 규칙</div>
                <ul className="mt-2 space-y-1 text-amber-800">
                  <li>· 점주 + 예비 점주 + 전문가 자유 참여</li>
                  <li>· 본사 마케팅·홍보 목적은 금지</li>
                  <li>· 회비는 운영비 충당 한도 내</li>
                </ul>
              </CardContent>
            </Card>
          </aside>

          <div>
            {/* 검색 */}
            <form method="GET" action="/meetings" className="mb-4 flex gap-2">
              {type && <input type="hidden" name="type" value={type} />}
              {region && region !== '전국' && <input type="hidden" name="region" value={region} />}
              {status && status !== 'upcoming' && <input type="hidden" name="status" value={status} />}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  name="q"
                  type="search"
                  defaultValue={q ?? ''}
                  placeholder="모임 제목, 장소, 태그 검색…"
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                style={{ background: 'var(--brand-primary)' }}
              >
                검색
              </button>
              {q && (
                <a
                  href={makeHref({ type, region, status }, {})}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  초기화
                </a>
              )}
            </form>
            <div className="mb-3 text-sm font-semibold text-gray-700">{results.length}건</div>
            {results.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-sm text-gray-500">
                  조건에 맞는 모임이 없습니다. 필터를 줄여 다시 시도해보세요.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {results.map((m) => (
                  <MeetingCard key={m.id} meeting={m} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">모임 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 오프라인 모임·지역별 네트워킹 행사·특별 강연 소식을 격주로 알려드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
                placeholder="이메일 주소"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                구독하기
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}

type MeetingsFilters = Omit<MeetingsPageProps['searchParams'], 'q'>

function makeHref(current: MeetingsFilters, changes: Partial<MeetingsFilters>) {
  const next = { ...current, ...changes }
  const params = new URLSearchParams()
  if (next.type) params.set('type', next.type)
  if (next.region && next.region !== '전국') params.set('region', next.region)
  if (next.status && next.status !== 'upcoming') params.set('status', next.status)
  const qs = params.toString()
  return qs ? `/meetings?${qs}` : '/meetings'
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={
        'block rounded-md px-3 py-1.5 text-sm transition-colors ' +
        (active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100')
      }
    >
      {children}
    </a>
  )
}
