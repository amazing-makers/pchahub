import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { CourseCard } from '@/components/course-card'
import { CourseCardWithSave } from '@/components/course-card-with-save'
import { COURSE_CATEGORIES, COURSES, LEVEL_LABEL, type CourseLevel } from '@/lib/mock-data'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'
import { MobileFilterToggle } from '@/components/mobile-filter-toggle'
import { formatNumber } from '@amakers/utils'

export const metadata: Metadata = buildPageMetadata('themanual', {
  title: '강의 목록',
  description: '자영업·프랜차이즈 창업과 운영에 필요한 전문가 강의. 카테고리·수준별로 찾아보세요.',
  path: '/courses',
})

interface CoursesPageProps {
  searchParams: {
    category?: string
    level?: string
    free?: string
    q?: string
    sort?: string
  }
}

export default function CoursesPage({ searchParams }: CoursesPageProps) {
  const { category, level, free, q, sort = 'popular' } = searchParams

  let results = COURSES.slice()
  if (category) results = results.filter((c) => c.category === category)
  if (level) results = results.filter((c) => c.level === level)
  if (free === '1') results = results.filter((c) => c.price === 0)
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (c) =>
        c.title.toLowerCase().includes(needle) ||
        c.subtitle.toLowerCase().includes(needle) ||
        c.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }

  results = [...results].sort((a, b) => {
    switch (sort) {
      case 'newest':
        return b.createdAt.localeCompare(a.createdAt)
      case 'rating':
        return b.rating - a.rating
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      default:
        return b.enrollment - a.enrollment
    }
  })

  const categoryLabel = category
    ? COURSE_CATEGORIES.find((c) => c.key === category)?.label
    : null

  const listJsonLd = buildItemListJsonLd({
    url: 'https://themanual.amakers.co.kr/courses',
    items: results.slice(0, 20).map((c) => ({ name: c.title, url: `https://themanual.amakers.co.kr/courses/${c.id}` })),
  })

  const isFiltered = !!(category || level || free || q)
  const freeCount = COURSES.filter((c) => c.price === 0).length
  const totalEnrollment = COURSES.reduce((s, c) => s + c.enrollment, 0)
  const avgRating = (COURSES.reduce((s, c) => s + c.rating, 0) / COURSES.length).toFixed(1)

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">
            {free === '1' ? '무료 강의' : categoryLabel ? `${categoryLabel} 강의` : '전체 강의'}
            {q && (
              <span className="ml-2 text-base font-normal text-gray-500">'{q}' 검색 결과</span>
            )}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {(free || category || level || q)
              ? `${results.length}개 강의`
              : `총 ${COURSES.length}개 강의 운영 중`}
          </p>
          {/* 검색 폼 */}
          <form method="get" action="/courses" className="mt-5">
            {category && <input type="hidden" name="category" value={category} />}
            {level && <input type="hidden" name="level" value={level} />}
            {free && <input type="hidden" name="free" value={free} />}
            {sort !== 'popular' && <input type="hidden" name="sort" value={sort} />}
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                defaultValue={q ?? ''}
                placeholder="강의명·태그 검색"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--brand-primary)] focus:outline-none"
              />
            </div>
          </form>
        </div>
      </section>

      {/* 통계 스트립 */}
      {!isFiltered && (
        <section className="border-b border-gray-100 bg-white">
          <div className="container mx-auto py-4">
            <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{COURSES.length}개</span>
                <span className="text-[11px] font-semibold text-gray-700">전체 강의</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{formatNumber(totalEnrollment)}</span>
                <span className="text-[11px] font-semibold text-gray-700">누적 수강</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">{freeCount}개</span>
                <span className="text-[11px] font-semibold text-gray-700">무료 강의</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
                <span className="text-xl font-black tracking-tight text-gray-900">★ {avgRating}</span>
                <span className="text-[11px] font-semibold text-gray-700">평균 평점</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto py-8">
        <div className="mb-4">
          <MobileFilterToggle>
            <div className="space-y-5">
              <FilterGroup title="카테고리">
                <div className="space-y-1">
                  <FilterLink
                    href={makeHref(searchParams, { category: undefined })}
                    active={!category}
                  >
                    전체
                  </FilterLink>
                  {COURSE_CATEGORIES.map((c) => {
                    const count = COURSES.filter((x) => x.category === c.key).length
                    if (count === 0) return null
                    return (
                      <FilterLink
                        key={c.key}
                        href={makeHref(searchParams, { category: c.key })}
                        active={category === c.key}
                      >
                        {c.label} ({count})
                      </FilterLink>
                    )
                  })}
                </div>
              </FilterGroup>

              <FilterGroup title="수준">
                <div className="space-y-1">
                  <FilterLink href={makeHref(searchParams, { level: undefined })} active={!level}>
                    전체
                  </FilterLink>
                  {(['beginner', 'intermediate', 'advanced'] as CourseLevel[]).map((l) => (
                    <FilterLink
                      key={l}
                      href={makeHref(searchParams, { level: l })}
                      active={level === l}
                    >
                      {LEVEL_LABEL[l]}
                    </FilterLink>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="가격">
                <div className="space-y-1">
                  <FilterLink href={makeHref(searchParams, { free: undefined })} active={!free}>
                    전체
                  </FilterLink>
                  <FilterLink
                    href={makeHref(searchParams, { free: '1' })}
                    active={free === '1'}
                  >
                    무료만
                  </FilterLink>
                </div>
              </FilterGroup>

              <FilterGroup title="정렬">
                <div className="space-y-1">
                  {SORT_OPTIONS.map((s) => (
                    <FilterLink
                      key={s.key}
                      href={makeHref(searchParams, { sort: s.key })}
                      active={sort === s.key}
                    >
                      {s.label}
                    </FilterLink>
                  ))}
                </div>
              </FilterGroup>
            </div>
          </MobileFilterToggle>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden space-y-5 lg:block">
            <FilterGroup title="카테고리">
              <div className="space-y-1">
                <FilterLink
                  href={makeHref(searchParams, { category: undefined })}
                  active={!category}
                >
                  전체
                </FilterLink>
                {COURSE_CATEGORIES.map((c) => {
                  const count = COURSES.filter((x) => x.category === c.key).length
                  if (count === 0) return null
                  return (
                    <FilterLink
                      key={c.key}
                      href={makeHref(searchParams, { category: c.key })}
                      active={category === c.key}
                    >
                      {c.label} ({count})
                    </FilterLink>
                  )
                })}
              </div>
            </FilterGroup>

            <FilterGroup title="수준">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { level: undefined })} active={!level}>
                  전체
                </FilterLink>
                {(['beginner', 'intermediate', 'advanced'] as CourseLevel[]).map((l) => (
                  <FilterLink
                    key={l}
                    href={makeHref(searchParams, { level: l })}
                    active={level === l}
                  >
                    {LEVEL_LABEL[l]}
                  </FilterLink>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="가격">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { free: undefined })} active={!free}>
                  전체
                </FilterLink>
                <FilterLink
                  href={makeHref(searchParams, { free: '1' })}
                  active={free === '1'}
                >
                  무료만
                </FilterLink>
              </div>
            </FilterGroup>

            <FilterGroup title="정렬">
              <div className="space-y-1">
                {SORT_OPTIONS.map((s) => (
                  <FilterLink
                    key={s.key}
                    href={makeHref(searchParams, { sort: s.key })}
                    active={sort === s.key}
                  >
                    {s.label}
                  </FilterLink>
                ))}
              </div>
            </FilterGroup>
          </aside>

          <div>
            <div className="mb-3 text-sm font-semibold text-gray-700">{results.length}개</div>
            {results.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-sm text-gray-500">
                  검색 결과가 없습니다. 필터를 줄여 다시 시도해보세요.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((c) => (
                  <CourseCardWithSave key={c.id} course={c} />
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">새 강좌 소식을 가장 먼저 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 강좌·자격증 일정·멘토 특강을 메일로 알려드립니다.</p>
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

const SORT_OPTIONS = [
  { key: 'popular', label: '수강생 많은 순' },
  { key: 'newest', label: '최신 등록순' },
  { key: 'rating', label: '평점 높은 순' },
  { key: 'price-asc', label: '가격 낮은 순' },
  { key: 'price-desc', label: '가격 높은 순' },
]

function makeHref(
  current: CoursesPageProps['searchParams'],
  changes: Partial<CoursesPageProps['searchParams']>,
) {
  const next = { ...current, ...changes }
  const params = new URLSearchParams()
  if (next.category) params.set('category', next.category)
  if (next.level) params.set('level', next.level)
  if (next.free) params.set('free', next.free)
  if (next.q) params.set('q', next.q)
  if (next.sort && next.sort !== 'popular') params.set('sort', next.sort)
  const qs = params.toString()
  return qs ? `/courses?${qs}` : '/courses'
}

function FilterGroup({ title, children }: { title: string;

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '더매뉴얼', url: 'https://themanual.amakers.co.kr' },
    { name: '운영 강의', url: 'https://themanual.amakers.co.kr/courses' },
  ],
}) children: React.ReactNode }) {
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
