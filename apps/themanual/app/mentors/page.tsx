import { Card, CardContent } from '@amakers/ui'
import { MentorCard } from '@/components/mentor-card'
import { MENTORS } from '@/lib/mock-data'
import { formatNumber } from '@amakers/utils'

interface MentorsPageProps {
  searchParams: {
    q?: string
    specialty?: string
    sort?: string
    featured?: string
  }
}

// 전체 멘토에서 전문 분야 유니크 목록 추출
const ALL_SPECIALTIES = Array.from(
  new Set(MENTORS.flatMap((m) => m.specialties)),
).sort()

const SORT_OPTIONS = [
  { key: 'popular', label: '상담 많은 순' },
  { key: 'rating', label: '평점 높은 순' },
  { key: 'experience', label: '경력 높은 순' },
  { key: 'price-asc', label: '상담료 낮은 순' },
  { key: 'price-desc', label: '상담료 높은 순' },
]

export default function MentorsPage({ searchParams }: MentorsPageProps) {
  const { q, specialty, sort = 'popular', featured } = searchParams

  let results = MENTORS.slice()

  if (featured === '1') results = results.filter((m) => m.featured)

  if (specialty) {
    results = results.filter((m) =>
      m.specialties.some((s) => s === specialty),
    )
  }

  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (m) =>
        m.name.toLowerCase().includes(needle) ||
        m.role.toLowerCase().includes(needle) ||
        m.specialties.some((s) => s.toLowerCase().includes(needle)) ||
        m.bio.toLowerCase().includes(needle),
    )
  }

  results = [...results].sort((a, b) => {
    switch (sort) {
      case 'rating':
        return b.rating - a.rating
      case 'experience':
        return b.yearsOfExperience - a.yearsOfExperience
      case 'price-asc':
        return a.hourlyRate - b.hourlyRate
      case 'price-desc':
        return b.hourlyRate - a.hourlyRate
      default: // popular
        return b.totalConsultations - a.totalConsultations
    }
  })

  const featuredCount = MENTORS.filter((m) => m.featured).length

  return (
    <main className="bg-gray-50">
      {/* 헤더 */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">멘토 상담</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            현직 점주·세무사·변호사·마케터가 1:1로 상담합니다.
            강의로 해결 안 되는 구체적인 고민에 답을 받으세요.
          </p>
          <div className="mt-5 flex flex-wrap gap-6 text-sm">
            <Stat label="총 멘토" value={`${MENTORS.length}명`} />
            <Stat
              label="누적 상담"
              value={`${formatNumber(MENTORS.reduce((s, m) => s + m.totalConsultations, 0))}회`}
            />
            <Stat
              label="평균 평점"
              value={(MENTORS.reduce((s, m) => s + m.rating, 0) / MENTORS.length).toFixed(1)}
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* 사이드바 필터 */}
          <aside className="space-y-6">
            {/* 검색 */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                검색
              </div>
              <form className="mt-2" action="/mentors" method="GET">
                {specialty && <input type="hidden" name="specialty" value={specialty} />}
                {featured && <input type="hidden" name="featured" value={featured} />}
                {sort !== 'popular' && <input type="hidden" name="sort" value={sort} />}
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="이름·분야·키워드"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
              </form>
            </div>

            {/* 추천 필터 */}
            <FilterGroup title="구분">
              <FilterLink href={makeHref(searchParams, { featured: undefined })} active={!featured}>
                전체 멘토 ({MENTORS.length})
              </FilterLink>
              <FilterLink href={makeHref(searchParams, { featured: '1' })} active={featured === '1'}>
                추천 멘토 ({featuredCount})
              </FilterLink>
            </FilterGroup>

            {/* 전문 분야 */}
            <FilterGroup title="전문 분야">
              <FilterLink
                href={makeHref(searchParams, { specialty: undefined })}
                active={!specialty}
              >
                전체
              </FilterLink>
              {ALL_SPECIALTIES.map((s) => {
                const count = MENTORS.filter((m) => m.specialties.includes(s)).length
                return (
                  <FilterLink
                    key={s}
                    href={makeHref(searchParams, { specialty: s })}
                    active={specialty === s}
                  >
                    {s} ({count})
                  </FilterLink>
                )
              })}
            </FilterGroup>

            {/* 정렬 */}
            <FilterGroup title="정렬">
              {SORT_OPTIONS.map((o) => (
                <FilterLink
                  key={o.key}
                  href={makeHref(searchParams, { sort: o.key })}
                  active={sort === o.key}
                >
                  {o.label}
                </FilterLink>
              ))}
            </FilterGroup>
          </aside>

          {/* 멘토 목록 */}
          <div>
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700">
                {q || specialty || featured
                  ? `${results.length}명 검색됨`
                  : `전체 ${results.length}명`}
              </span>
              {(q || specialty || featured) && (
                <a href="/mentors" className="text-xs text-gray-500 hover:text-gray-900">
                  필터 초기화
                </a>
              )}
            </div>

            {results.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-sm text-gray-500">
                  조건에 맞는 멘토가 없습니다. 필터를 변경해보세요.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((m) => (
                  <MentorCard key={m.id} mentor={m} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function makeHref(
  current: MentorsPageProps['searchParams'],
  changes: Partial<MentorsPageProps['searchParams']>,
) {
  const next = { ...current, ...changes }
  const params = new URLSearchParams()
  if (next.q) params.set('q', next.q)
  if (next.specialty) params.set('specialty', next.specialty)
  if (next.sort && next.sort !== 'popular') params.set('sort', next.sort)
  if (next.featured) params.set('featured', next.featured)
  const qs = params.toString()
  return qs ? `/mentors?${qs}` : '/mentors'
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</div>
      <div className="mt-2 space-y-1">{children}</div>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-0.5 text-base font-bold text-gray-900">{value}</div>
    </div>
  )
}
