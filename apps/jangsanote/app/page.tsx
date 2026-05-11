import { ArrowRight, Calendar, Flame } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { ChannelList } from '@/components/channel-list'
import { PostCard } from '@/components/post-card'
import { MeetingCard } from '@/components/meeting-card'
import {
  HOT_POSTS,
  PINNED_POSTS,
  popularPosts,
  POSTS,
  UPCOMING_MEETINGS,
} from '@/lib/mock-data'

export default function HomePage() {
  const recent = [...POSTS]
    .filter((p) => !p.pinned)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 12)
  const popular = popularPosts(5)

  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-h3 font-bold text-gray-900">장사노트</h1>
              <p className="mt-1 text-sm text-gray-500">
                전국 자영업·가맹점주와 전문가가 함께 운영하는 커뮤니티.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>전체 회원 14,820명</span>
              <span>·</span>
              <span>오늘 새 글 38개</span>
            </div>
          </div>
        </div>
      </section>

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

            <Card className="border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <CardContent className="p-5">
                <div
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  amakers
                </div>
                <h3 className="mt-2 text-sm font-semibold">브랜드 정보가 궁금하면</h3>
                <p className="mt-1 text-xs text-gray-300">
                  프차허브에서 협회 등록 정보공개서를 한눈에 비교할 수 있어요.
                </p>
                <a
                  href="https://pchahub.kr"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-white hover:underline"
                >
                  프차허브로 이동 <ArrowRight className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}
