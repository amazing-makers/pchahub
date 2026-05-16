import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { CourseCard } from '@/components/course-card'
import { COURSE_CATEGORIES, COURSES, LEVEL_LABEL, type CourseLevel } from '@/lib/mock-data'
import { buildPageMetadata } from '@amakers/design-system'

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

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">
            {free === ‘1’ ? ‘무료 강의’ : categoryLabel ? `${categoryLabel} 강의` : ‘전체 강의’}
            {q && (
              <span className="ml-2 text-base font-normal text-gray-500">’{q}’ 검색 결과</span>
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
            {sort !== ‘popular’ && <input type="hidden" name="sort" value={sort} />}
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                defaultValue={q ?? ‘’}
                placeholder="강의명·태그 검색"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--brand-primary)] focus:outline-none"
              />
            </div>
          </form>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="space-y-5">
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
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
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
