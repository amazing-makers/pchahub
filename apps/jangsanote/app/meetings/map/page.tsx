import type { Metadata } from 'next'
import { Calendar, List, MapPin } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { MEETINGS, MEETING_TYPE_LABEL, type MockMeeting } from '@/lib/mock-data'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '모임 지역 지도',
  description: '전국 자영업·가맹점주 모임을 지역별로 한눈에. 내 지역 모임을 찾아보세요.',
  path: '/meetings/map',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '장사노트', url: 'https://jangsanote.amakers.co.kr' },
    { name: '모임', url: 'https://jangsanote.amakers.co.kr/meetings' },
    { name: '지역 지도', url: 'https://jangsanote.amakers.co.kr/meetings/map' },
  ],
})

// Korea region grid — approximate geographic layout
// Each cell: { region, col, row } (1-indexed CSS grid)
const REGION_GRID = [
  { region: '인천', col: 1, row: 2 },
  { region: '서울', col: 2, row: 2 },
  { region: '강원', col: 3, row: 2 },
  { region: '경기', col: 2, row: 3 },
  { region: '충북', col: 2, row: 4 },
  { region: '충남', col: 1, row: 4 },
  { region: '대전', col: 2, row: 5 },
  { region: '경북', col: 3, row: 4 },
  { region: '전북', col: 1, row: 5 },
  { region: '대구', col: 3, row: 5 },
  { region: '전남', col: 1, row: 6 },
  { region: '광주', col: 1, row: 7 },
  { region: '경남', col: 2, row: 6 },
  { region: '울산', col: 3, row: 6 },
  { region: '부산', col: 3, row: 7 },
  { region: '제주', col: 1, row: 9 },
]

const TYPE_ICON: Record<string, string> = {
  offline: '📍',
  online: '💻',
  hybrid: '🔀',
}

interface MapPageProps {
  searchParams: { region?: string }
}

export default function MeetingsMapPage({ searchParams }: MapPageProps) {
  const selectedRegion = searchParams.region ?? ''

  // Group meetings by region
  const upcomingMeetings = MEETINGS.filter((m) => m.status === 'upcoming')
  const byRegion = new Map<string, MockMeeting[]>()
  for (const m of upcomingMeetings) {
    const list = byRegion.get(m.region) ?? []
    list.push(m)
    byRegion.set(m.region, list)
  }

  const maxCols = Math.max(...REGION_GRID.map((r) => r.col))
  const maxRows = Math.max(...REGION_GRID.map((r) => r.row))

  const displayMeetings = selectedRegion
    ? upcomingMeetings.filter((m) => m.region === selectedRegion)
    : upcomingMeetings

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />

      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="inline-flex items-center gap-2 text-h3 font-bold text-gray-900">
                <MapPin className="h-6 w-6 text-amber-500" />
                모임 지역 지도
              </h1>
              <p className="mt-1 text-sm text-gray-500">전국 모임을 지역별로 탐색합니다. 셀을 클릭해 해당 지역 모임을 확인하세요.</p>
            </div>
            <a
              href="/meetings"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <List className="h-4 w-4" />
              목록 보기
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Korea grid map */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              지역별 분포
            </div>
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
                gridTemplateRows: `repeat(${maxRows}, auto)`,
              }}
            >
              {REGION_GRID.map(({ region, col, row }) => {
                const meetings = byRegion.get(region) ?? []
                const isActive = selectedRegion === region
                const hasAny = meetings.length > 0
                return (
                  <a
                    key={region}
                    href={isActive ? '/meetings/map' : `/meetings/map?region=${encodeURIComponent(region)}`}
                    className={
                      'flex flex-col items-center justify-center rounded-lg border px-2 py-2.5 text-center text-xs transition-colors ' +
                      (isActive
                        ? 'text-white shadow-md'
                        : hasAny
                          ? 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                          : 'border-gray-100 bg-gray-50 text-gray-400 cursor-default')
                    }
                    style={isActive
                      ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)', gridColumn: col, gridRow: row }
                      : { gridColumn: col, gridRow: row }}
                  >
                    <span className="font-semibold leading-tight">{region}</span>
                    {hasAny && (
                      <span className={`mt-0.5 text-[10px] font-bold ${isActive ? 'text-white/80' : 'text-amber-500'}`}>
                        {meetings.length}건
                      </span>
                    )}
                  </a>
                )
              })}
            </div>

            {/* Stats */}
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-600">
              <div className="font-semibold text-gray-800 mb-2">전국 현황</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>예정 모임</span>
                  <span className="font-bold text-gray-900">{upcomingMeetings.length}건</span>
                </div>
                <div className="flex justify-between">
                  <span>오프라인</span>
                  <span className="font-bold text-gray-900">{upcomingMeetings.filter((m) => m.type === 'offline').length}건</span>
                </div>
                <div className="flex justify-between">
                  <span>온라인·하이브리드</span>
                  <span className="font-bold text-gray-900">{upcomingMeetings.filter((m) => m.type !== 'offline').length}건</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meeting list for selected region */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-h4 font-bold text-gray-900">
                {selectedRegion ? `${selectedRegion} 모임` : '전국 모임'}
              </h2>
              <span className="text-sm text-gray-500">{displayMeetings.length}건</span>
            </div>

            {displayMeetings.length === 0 ? (
              <Card className="border-dashed border-gray-200">
                <CardContent className="py-12 text-center">
                  <MapPin className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-3 text-sm text-gray-500">
                    {selectedRegion ? `${selectedRegion}에 예정된 모임이 없습니다.` : '예정된 모임이 없습니다.'}
                  </p>
                  <a
                    href="/meetings/new"
                    className="mt-3 inline-block rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    모임 만들기
                  </a>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {displayMeetings.map((m) => (
                  <a
                    key={m.id}
                    href={`/meetings/${m.id}`}
                    className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-xl">
                      {TYPE_ICON[m.type] ?? '📍'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 line-clamp-1">{m.title}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {m.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {m.date} {m.startTime}
                        </span>
                        <span>{MEETING_TYPE_LABEL[m.type]}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className={`text-sm font-bold ${m.isFree ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {m.isFree ? '무료' : `${m.feeWon.toLocaleString()}만원`}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-400">
                        {m.currentParticipants}/{m.maxParticipants}명
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
