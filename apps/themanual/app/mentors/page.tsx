import type { Metadata } from 'next'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('themanual', {
  title: '멘토 목록',
  description: '가맹 창업 전문 멘토 목록. 현직 점주·회계사·법무사·마케터로 구성된 멘토와 1:1 상담을 예약하세요.',
  path: '/mentors',
})

import { ArrowRight, BookOpen, MapPin, Star, Store } from 'lucide-react'
import { Card, CardContent, MobileFilterDrawer, NewsletterForm } from '@amakers/ui'
import { MentorCard } from '@/components/mentor-card'
import { MobileFilterToggle } from '@/components/mobile-filter-toggle'
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

  const listJsonLd = buildItemListJsonLd({
    url: 'https://themanual.amakers.co.kr/mentors',
    items: results.slice(0, 20).map((m) => ({ name: m.name, url: `https://themanual.amakers.co.kr/mentors/${m.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* 헤더 */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">멘토 상담</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            현직 점주·세무사·변호사·마케터가 1:1로 상담합니다.
            강의로 해결 안 되는 구체적인 고민에 답을 받으세요.
          </p>
        </div>
      </section>

      {/* 통계 스트립 */}
      {!q && !specialty && !featured && (
        <section className="border-b border-gray-100 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
              {[
                { value: `${MENTORS.length}명`, label: '전체 멘토' },
                { value: `${formatNumber(MENTORS.reduce((s, m) => s + m.totalConsultations, 0))}회`, label: '누적 상담' },
                { value: `⭐ ${(MENTORS.reduce((s, m) => s + m.rating, 0) / MENTORS.length).toFixed(1)}`, label: '평균 평점' },
                { value: `${ALL_SPECIALTIES.length}개`, label: '전문 분야' },
              ].map(({ value, label }) => (
                <div key={label} className="px-6 py-4">
                  <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                  <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* 모바일 필터 토글 */}
          <div className="lg:hidden">
            <MobileFilterToggle label="멘토 필터">
              <div className="space-y-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">검색</div>
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
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">구분</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a href={makeHref(searchParams, { featured: undefined })} className={`rounded-full border px-3 py-1 text-sm ${!featured ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700'}`}>전체 ({MENTORS.length})</a>
                    <a href={makeHref(searchParams, { featured: '1' })} className={`rounded-full border px-3 py-1 text-sm ${featured === '1' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700'}`}>추천 ({featuredCount})</a>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">전문 분야</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a href={makeHref(searchParams, { specialty: undefined })} className={`rounded-full border px-3 py-1 text-sm ${!specialty ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700'}`}>전체</a>
                    {ALL_SPECIALTIES.map((s) => (
                      <a key={s} href={makeHref(searchParams, { specialty: s })} className={`rounded-full border px-3 py-1 text-sm ${specialty === s ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700'}`}>{s}</a>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">정렬</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SORT_OPTIONS.map((o) => (
                      <a key={o.key} href={makeHref(searchParams, { sort: o.key })} className={`rounded-full border px-3 py-1 text-sm ${sort === o.key ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700'}`}>{o.label}</a>
                    ))}
                  </div>
                </div>
              </div>
            </MobileFilterToggle>
          </div>

          {/* 사이드바 필터 (데스크톱) */}
          <MobileFilterDrawer asideClassName="space-y-6">
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
          </MobileFilterDrawer>

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

      {/* amakers 생태계 크로스링크 */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-6">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">amakers에서 더 알아보기</div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <a href="https://pchahub.amakers.co.kr/brands" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-indigo-500" />가맹 브랜드 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themyungdang.amakers.co.kr/listings" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-500" />창업 매물 찾기</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://bestplace.amakers.co.kr/stores" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" />우수 매장 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://jangsanote.amakers.co.kr" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-rose-500" />점주 커뮤니티</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">새 강좌 소식을 가장 먼저 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 멘토·특강·1:1 상담 프로모션을 메일로 알려드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
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

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '더매뉴얼', url: 'https://themanual.amakers.co.kr' },
    { name: '전문 멘토', url: 'https://themanual.amakers.co.kr/mentors' },
  ],
})

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

