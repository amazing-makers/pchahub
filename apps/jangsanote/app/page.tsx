import type { Metadata } from 'next'
import { buildFaqPageJsonLd, buildOrganizationJsonLd, buildPageMetadata, buildWebSiteJsonLd, JsonLd, platformColors, type PlatformKey } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '장사노트 — 자영업·가맹점주 커뮤니티',
  description: '장사는 혼자 하는 게 아닙니다. 전국 자영업·가맹점주와 상권 정보·운영 노하우를 나누고, 업종별 채널과 오프라인 모임으로 연결되세요.',
  path: '/',
})

import { ArrowRight, BookOpen, Building2, Calendar, Flame, MapPin, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { ChannelList } from '@/components/channel-list'
import { PostCard } from '@/components/post-card'
import { MeetingCard } from '@/components/meeting-card'
import {
  CHANNELS,
  HOT_POSTS,
  MEETINGS,
  PINNED_POSTS,
  popularPosts,
  POSTS,
  UPCOMING_MEETINGS,
} from '@/lib/mock-data'
import { LocalPostsFeed } from './local-posts-feed'
import { SavedPostsSection } from '@/components/saved-posts-section'
import { RecentlyViewedPosts } from '@/components/recently-viewed-posts'
import { RecentlyViewedMeetings } from '@/components/recently-viewed-meetings'

const otherPlatforms = (
  Object.entries(platformColors) as Array<[PlatformKey, (typeof platformColors)[PlatformKey]]>
).filter(([key]) => key !== 'jangsanote')

const FAQS = [
  {
    q: '장사노트는 어떤 커뮤니티인가요?',
    a: '전국 자영업자·가맹점주와 분야별 전문가가 함께 만드는 커뮤니티입니다. 업종별·지역별 채널에서 상권 정보와 운영 노하우를 나누고, 오프라인 모임을 통해 직접 교류할 수 있습니다.',
  },
  {
    q: '가입하면 무엇을 할 수 있나요?',
    a: '관심 업종·지역 채널을 구독해 맞춤 글을 받아보고, 글 작성과 댓글로 점주들과 정보를 나눌 수 있습니다. 가까운 지역의 오프라인 모임 신청, 인기 글·상권 분석 열람도 가능합니다.',
  },
  {
    q: '오프라인 모임은 어떻게 참여하나요?',
    a: '모임 페이지에서 지역·업종·일정별로 진행 중인 모임을 확인하고 신청할 수 있습니다. 창업 준비 모임부터 업종별 점주 정모, 상권 답사까지 다양한 모임이 정기적으로 열립니다.',
  },
  {
    q: '글을 쓰거나 정보를 나누는 데 비용이 드나요?',
    a: '커뮤니티 가입과 글 작성·열람은 모두 무료입니다. 누구나 자유롭게 장사 경험과 지역 정보를 공유할 수 있으며, 광고성·허위 정보는 운영 정책에 따라 제한됩니다.',
  },
]

export default function HomePage() {
  // 동적 통계 — mock 데이터 기반으로 계산
  const totalPosts    = POSTS.length + PINNED_POSTS.length
  const totalMeetings = MEETINGS.length
  const totalChannels = CHANNELS.length

  const recent = [...POSTS]
    .filter((p) => !p.pinned)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 12)
  const popular = popularPosts(5)

  const orgJsonLd = buildOrganizationJsonLd({
    name: '장사노트',
    url: 'https://jangsanote.amakers.co.kr',
    description: '전국 자영업·가맹점주와 전문가가 함께 운영하는 커뮤니티. 상권 정보, 창업 팁, 업종별 채널, 오프라인 모임까지.',
  })
  const siteJsonLd = buildWebSiteJsonLd({
    name: '장사노트',
    url: 'https://jangsanote.amakers.co.kr',
    searchUrlTemplate: 'https://jangsanote.amakers.co.kr/search?q={search_term_string}',
  })
  const faqJsonLd = buildFaqPageJsonLd({
    url: 'https://jangsanote.amakers.co.kr',
    items: FAQS.map((f) => ({ question: f.q, answer: f.a })),
  })
  return (
    <main className="bg-gray-50">
      <JsonLd data={orgJsonLd} />
      <JsonLd data={siteJsonLd} />
      <JsonLd data={faqJsonLd} />
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-h3 font-bold text-gray-900">장사노트</h1>
              <p className="mt-1 text-sm text-gray-500">
                장사, 혼자 고민하지 마세요 — 전국 점주들과 상권 정보·운영 노하우를 나누는 곳.
              </p>
            </div>
            </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {[
              { value: `${totalChannels}개`, label: '커뮤니티 채널' },
              { value: formatNumber(totalPosts), label: '누적 게시글' },
              { value: `${totalMeetings}건`, label: '오프라인 모임' },
              { value: `${CHANNELS.reduce((s, c) => s + c.memberCount, 0).toLocaleString()}명`, label: '전체 회원' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-4">
                <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SavedPostsSection />
      <RecentlyViewedPosts />
      <RecentlyViewedMeetings />

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          {/* Left: channels */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <ChannelList />
          </aside>

          {/* Main feed */}
          <div className="space-y-6">
            {/* Upcoming meetings row */}
            {UPCOMING_MEETINGS.length > 0 && (
              <div>
                <div className="mb-3 flex items-end justify-between">
                  <h2 className="inline-flex items-center gap-2 text-base font-semibold text-gray-900">
                    <Calendar className="h-4 w-4 text-amber-500" />
                    이번 주 모임
                  </h2>
                  <a
                    href="/meetings"
                    className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
                  >
                    전체 모임 <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {UPCOMING_MEETINGS.slice(0, 4).map((m) => (
                    <MeetingCard key={m.id} meeting={m} compact />
                  ))}
                </div>
              </div>
            )}

            {/* Posts feed */}
            <div className="space-y-3">
              {/* 내가 쓴 글 (localStorage) */}
              <LocalPostsFeed />

              <h2 className="text-base font-semibold text-gray-900">최근 글</h2>
              {PINNED_POSTS.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
              {recent.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>

          {/* Right: hot + popular */}
          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                  <Flame className="h-4 w-4 text-orange-500" />
                  지금 뜨고 있는
                </div>
                <ol className="space-y-2.5">
                  {HOT_POSTS.slice(0, 5).map((p, i) => (
                    <li key={p.id}>
                      <a
                        href={`/posts/${p.id}`}
                        className="group flex gap-3 text-sm text-gray-700 hover:text-gray-900"
                      >
                        <span className="w-4 shrink-0 text-xs font-bold text-gray-400 group-hover:text-gray-700">
                          {i + 1}
                        </span>
                        <span className="line-clamp-2">{p.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-3 text-sm font-semibold text-gray-900">조회 많은 글</div>
                <ol className="space-y-2.5">
                  {popular.map((p) => (
                    <li key={p.id}>
                      <a
                        href={`/posts/${p.id}`}
                        className="group flex justify-between gap-3 text-sm text-gray-700 hover:text-gray-900"
                      >
                        <span className="line-clamp-2">{p.title}</span>
                        <span className="shrink-0 text-xs text-gray-400">
                          {formatNumber(p.views)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  amakers 생태계
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  창업·운영 단계별 전문 플랫폼
                </p>
                <div className="mt-3 space-y-1.5">
                  <a
                    href="https://pchahub.amakers.co.kr"
                    className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-2.5 py-2 text-xs text-gray-700 hover:border-gray-200 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="h-3 w-3 text-indigo-500" />
                      브랜드 가맹 정보 (프차허브)
                    </span>
                    <ArrowRight className="h-2.5 w-2.5 text-gray-400" />
                  </a>
                  <a
                    href="https://themyungdang.amakers.co.kr/listings"
                    className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-2.5 py-2 text-xs text-gray-700 hover:border-gray-200 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-rose-500" />
                      입지 매물 (더명당)
                    </span>
                    <ArrowRight className="h-2.5 w-2.5 text-gray-400" />
                  </a>
                  <a
                    href="https://themanual.amakers.co.kr/courses"
                    className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-2.5 py-2 text-xs text-gray-700 hover:border-gray-200 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-3 w-3 text-amber-500" />
                      운영 강의 (더메뉴얼)
                    </span>
                    <ArrowRight className="h-2.5 w-2.5 text-gray-400" />
                  </a>
                  <a
                    href="https://bestplace.amakers.co.kr"
                    className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-2.5 py-2 text-xs text-gray-700 hover:border-gray-200 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      베스트 매장 (베스트플레이스)
                    </span>
                    <ArrowRight className="h-2.5 w-2.5 text-gray-400" />
                  </a>
                  <a
                    href="https://pchabridge.amakers.co.kr/investments"
                    className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-2.5 py-2 text-xs text-gray-700 hover:border-gray-200 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3 text-violet-500" />
                      투자 라운드 (프차브릿지)
                    </span>
                    <ArrowRight className="h-2.5 w-2.5 text-gray-400" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
      {/* 자주 묻는 질문 */}
      <section className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-h3 font-bold text-gray-900">자주 묻는 질문</h2>
            <div className="mt-8 divide-y divide-gray-100 rounded-2xl border border-gray-100">
              {FAQS.map((f, i) => (
                <details key={i} className="group px-5 py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-gray-900 marker:content-['']">
                    {f.q}
                    <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">장사 인사이트 뉴스레터</h2>
            <p className="mt-2 text-sm text-gray-500">매주 상권 분석·창업 팁·커뮤니티 하이라이트를 받아보세요.</p>
            <form
              action="#"
              className="mt-6 flex gap-2"
            >
              <input
                type="email"
                aria-label="이메일 주소"
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
                      <div className="truncate text-sm font-semibold text-gray-900">{p.name}</div>
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
