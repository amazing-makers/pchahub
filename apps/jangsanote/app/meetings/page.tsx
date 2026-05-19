import type { Metadata } from 'next'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '모임',
  description: '장사노트 오프라인 모임 목록. 지역·유형별로 참여하세요.',
  path: '/meetings',
})

import { Calendar, Plus, Search } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { MEETINGS, MEETING_TYPE_LABEL, type MeetingType } from '@/lib/mock-data'
import { MeetingCard } from '@/components/meeting-card'

const TYPES: Array<{ value: '' | MeetingType; label: string }> = [
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

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
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

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
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
            {/* Search bar */}
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
