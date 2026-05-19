import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = {
  ...buildPageMetadata('themanual', {
    title: '검색',
    description: '강의·멘토 이름으로 더메뉴얼 가맹 운영 교육 콘텐츠를 검색하세요.',
    path: '/search',
  }),
  robots: { index: false, follow: false },
}

import { Search } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { COURSES, MENTORS, LEVEL_LABEL } from '@/lib/mock-data'
import { CourseCard } from '@/components/course-card'

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams.q ?? '').trim()
  const needle = q.toLowerCase()

  const courses = q
    ? COURSES.filter(
        (c) =>
          c.title.toLowerCase().includes(needle) ||
          c.subtitle.toLowerCase().includes(needle) ||
          c.description.toLowerCase().includes(needle) ||
          c.tags.some((t) => t.toLowerCase().includes(needle)) ||
          c.category.toLowerCase().includes(needle),
      )
    : []

  const mentors = q
    ? MENTORS.filter(
        (m) =>
          m.name.toLowerCase().includes(needle) ||
          m.role.toLowerCase().includes(needle) ||
          m.bio.toLowerCase().includes(needle) ||
          m.specialties.some((s) => s.toLowerCase().includes(needle)),
      )
    : []

  const total = courses.length + mentors.length

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">검색</h1>
          <form method="get" action="/search" className="mt-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="강의, 멘토 검색..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-gray-400 focus:outline-none"
                autoFocus={!q}
              />
            </div>
          </form>
          {q && (
            <p className="mt-3 text-sm text-gray-500">
              <span className="font-medium text-gray-900">'{q}'</span> 검색 결과 · 총 {total}건
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-8">
        {!q && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">강의나 멘토 이름을 검색하세요.</p>
            </CardContent>
          </Card>
        )}

        {q && total === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                '<span className="font-medium">{q}</span>'에 대한 결과가 없습니다.
              </p>
              <p className="mt-1 text-xs text-gray-400">다른 키워드로 검색해보세요.</p>
            </CardContent>
          </Card>
        )}

        {courses.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              강의 <span className="text-sm font-normal text-gray-400">({courses.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 9).map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
            {courses.length > 9 && (
              <a
                href={`/courses?q=${encodeURIComponent(q)}`}
                className="mt-3 inline-flex text-sm text-[var(--brand-primary)] hover:underline"
              >
                강의 {courses.length}개 전체보기 →
              </a>
            )}
          </section>
        )}

        {mentors.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              멘토 <span className="text-sm font-normal text-gray-400">({mentors.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mentors.slice(0, 6).map((m) => (
                <a
                  key={m.id}
                  href={`/mentors/${m.id}`}
                  className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-shadow"
                >
                  <div
                    className="h-12 w-12 shrink-0 rounded-full"
                    style={{ backgroundColor: m.avatarColor }}
                  >
                    {m.avatarUrl && (
                      <img src={m.avatarUrl} alt={m.name} className="h-12 w-12 rounded-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.role}</div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {m.specialties.slice(0, 3).map((s) => (
                        <Badge key={s} variant="default" className="text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {m.hourlyRate.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-400">/시간</div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
