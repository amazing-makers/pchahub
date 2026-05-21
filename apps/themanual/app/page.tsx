import type { Metadata } from 'next'
import { buildOrganizationJsonLd, buildPageMetadata, buildWebSiteJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('themanual', {
  title: '더메뉴얼 — 가맹 운영 교육·멘토 상담',
  description: '협회 정보공개서 해석·매장 운영·회계·법률·마케팅. 현직 점주와 전문가가 가르치는 프랜차이즈 가맹 사업 교육 플랫폼.',
  path: '/',
})

import { ArrowRight, BookOpen, GraduationCap, MessageCircle, ShieldCheck } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { platformColors, type PlatformKey } from '@amakers/design-system'
import { SearchBar } from '@/components/search-bar'
import { CourseCard } from '@/components/course-card'
import { MentorCard } from '@/components/mentor-card'
import { SavedCoursesSection } from '@/components/saved-courses-section'
import { RecentlyViewedCourses } from '@/components/recently-viewed-courses'
import { RecentlyViewedKnowhow } from '@/components/recently-viewed-knowhow'
import { RecentlyViewedMentors } from '@/components/recently-viewed-mentors'
import { RecentlyViewedRecipes } from '@/components/recently-viewed-recipes'
import { SavedRecipesSection } from '@/components/saved-recipes-section'
import { SavedKnowhowSection } from '@/components/saved-knowhow-section'
import { SavedMentorsSection } from '@/components/saved-mentors-section'
import {
  COURSE_CATEGORIES,
  COURSES,
  FEATURED_COURSES,
  FEATURED_MENTORS,
  FREE_COURSES,
  MENTORS,
  popularCourses,
} from '@/lib/mock-data'
import { KNOWHOW_ITEMS } from '@/lib/knowhow'
import { RECIPES } from '@/lib/recipes'
import { formatNumber } from '@amakers/utils'

const otherPlatforms = (
  Object.entries(platformColors) as Array<[PlatformKey, (typeof platformColors)[PlatformKey]]>
).filter(([key]) => key !== 'themanual')

export default function HomePage() {
  const popular = popularCourses(6)
  const trustSignals = [
    { icon: GraduationCap, label: '현직 점주·전문가 강사진', color: 'text-blue-500' },
    { icon: ShieldCheck, label: '협회 정보공개서 연계', color: 'text-emerald-500' },
    { icon: MessageCircle, label: '1:1 멘토 상담 가능', color: 'text-amber-500' },
  ]

  const orgJsonLd = buildOrganizationJsonLd({
    name: '더메뉴얼',
    url: 'https://themanual.amakers.co.kr',
    description: '협회 정보공개서 해석·매장 운영·회계·법률·마케팅. 현직 점주와 전문가가 가르치는 프랜차이즈 가맹 사업 교육 플랫폼.',
  })
  const siteJsonLd = buildWebSiteJsonLd({
    name: '더메뉴얼',
    url: 'https://themanual.amakers.co.kr',
    searchUrlTemplate: 'https://themanual.amakers.co.kr/search?q={search_term_string}',
  })
  return (
    <main>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={siteJsonLd} />
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand-primary)' }}
            >
              더메뉴얼 · themanual.kr
            </p>
            <h1 className="mt-4 text-hero font-bold text-gray-900">
              가맹 운영의 모든 답을
              <br />
              한 곳에서
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              협회 정보공개서 해석·매장 운영·회계·법률·마케팅까지.
              <br className="hidden sm:inline" />
              현직 점주와 전문가가 가르치는 가맹 사업 교육.
            </p>
            <div className="mt-10">
              <SearchBar />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              {trustSignals.map((s) => (
                <span key={s.label} className="inline-flex items-center gap-1.5">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {[
              { value: `${COURSES.length}개`, label: '운영 강의' },
              { value: `${MENTORS.length}명`, label: '전문 멘토' },
              { value: `${KNOWHOW_ITEMS.length}개`, label: '운영 노하우' },
              { value: `${RECIPES.length}개`, label: '업소용 레시피' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-4">
                <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SavedCoursesSection />

      {/* 최근 본 강의 — 클라이언트 전용 */}
      <RecentlyViewedCourses />

      {/* 최근 본 노하우 — 클라이언트 전용 */}
      <RecentlyViewedKnowhow />

      {/* 최근 본 멘토 — 클라이언트 전용 */}
      <RecentlyViewedMentors />

      {/* 최근 본 레시피 — 클라이언트 전용 */}
      <RecentlyViewedRecipes />

      <SavedRecipesSection />
      <SavedKnowhowSection />
      <SavedMentorsSection />

      {/* Featured courses */}
      {FEATURED_COURSES.length > 0 && (
        <section className="container mx-auto pt-section">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-h3 font-semibold text-gray-900">추천 강의</h2>
              <p className="mt-1 text-sm text-gray-500">현직 점주·전문가가 검증한 강의</p>
            </div>
            <a
              href="/courses"
              className="hidden items-center gap-1 text-sm text-gray-600 hover:text-gray-900 sm:inline-flex"
            >
              전체 강의 보기 <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_COURSES.map((c) => (
              <CourseCard key={c.id} course={c} featured />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="container mx-auto pt-section">
        <div className="mb-6">
          <h2 className="text-h3 font-semibold text-gray-900">카테고리별 찾기</h2>
          <p className="mt-1 text-sm text-gray-500">관심 영역의 강의만 모아 보세요</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {COURSE_CATEGORIES.map((c) => (
            <a
              key={c.key}
              href={`/courses?category=${c.key}`}
              className="rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[var(--brand-primary)]"
            >
              <BookOpen className="h-5 w-5 text-gray-400" />
              <div className="mt-3 text-sm font-semibold text-gray-900">{c.label}</div>
              <p className="mt-1 text-xs text-gray-500">{c.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Free courses */}
      {FREE_COURSES.length > 0 && (
        <section className="container mx-auto pt-section">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-h3 font-semibold text-gray-900">무료로 시작하기</h2>
              <p className="mt-1 text-sm text-gray-500">처음이라면 무료 강의부터</p>
            </div>
            <a
              href="/courses?free=1"
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              전체 무료 강의 <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FREE_COURSES.slice(0, 3).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>
      )}

      {/* Popular */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">인기 강의</h2>
            <p className="mt-1 text-sm text-gray-500">수강생이 가장 많이 선택한 강의</p>
          </div>
          <a
            href="/courses"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 보기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      {/* Mentors */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">추천 멘토</h2>
            <p className="mt-1 text-sm text-gray-500">1:1 상담으로 빠르게 답을 찾으세요</p>
          </div>
          <a
            href="/mentors"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 멘토 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_MENTORS.map((m) => (
            <MentorCard key={m.id} mentor={m} />
          ))}
        </div>
      </section>

      {/* pchahub bridge */}
      <section className="container mx-auto pt-section">
        <Card className="border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <CardContent className="p-10">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  amakers · 프차허브 연계
                </p>
                <h2 className="mt-3 text-h2 font-bold">브랜드별 추천 강의</h2>
                <p className="mt-3 max-w-2xl text-gray-300">
                  관심 있는 가맹 브랜드가 있으신가요? 프차허브 브랜드 페이지에서 해당 카테고리에
                  추천 강의를 함께 확인하실 수 있습니다.
                </p>
              </div>
              <div>
                <a href="https://pchahub.amakers.co.kr">
                  <Button size="lg" className="gap-1">
                    프차허브로 이동 <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">새 강좌 소식을 가장 먼저 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 강좌·자격증 일정·멘토 특강을 메일로 알려드립니다.</p>
            <form
              action="#"
              className="mt-6 flex gap-2"
            >
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

      {/* Other platforms */}
      <section className="container mx-auto py-section">
        <div className="mb-4">
          <h2 className="text-h4 font-semibold text-gray-900">amakers의 다른 플랫폼</h2>
          <p className="mt-1 text-sm text-gray-500">
            가맹 정보·매물·인테리어·투자까지 — 가맹점 운영 단계별 전문 플랫폼
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          {otherPlatforms.map(([key, p]) => (
            <a key={key} href={`https://${p.domain}`} className="group">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-7 w-7 shrink-0 rounded-md"
                      style={{ background: p.primary }}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-gray-900">
                        {p.name}
                      </div>
                      <div className="truncate text-xs text-gray-500">{p.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
