'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Calendar, Clock, PencilLine, ThumbsUp } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { PostCard } from '@/components/post-card'
import { POSTS, MEETINGS } from '@/lib/mock-data'
import { MeetingCard } from '@/components/meeting-card'

interface LocalPost {
  id: string
  title: string
  excerpt: string
  channelType: string
  channelKey: string
  category: string
  tags: string[]
  anonymous: boolean
  authorName: string
  createdAt: string
  views: number
  likes: number
  commentCount: number
}

interface RsvpEntry {
  meetingId: string
  meetingTitle: string
  registeredAt: string
}

interface MyMeeting {
  id: string
  title: string
  date: string
  location: string
  type: string
  currentParticipants: number
  maxParticipants: number
  isFree: boolean
  feeWon: number
  createdAt: string
}

interface Subscription {
  type: string
  key: string
  label: string
}

export function MyPageClient() {
  const [myPosts, setMyPosts] = useState<LocalPost[]>([])
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([])
  const [myMeetings, setMyMeetings] = useState<MyMeeting[]>([])
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [savedPostIds, setSavedPostIds] = useState<string[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [recentPostIds, setRecentPostIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('jangsanote:posts')
      if (raw) setMyPosts(JSON.parse(raw) as LocalPost[])
    } catch { /* ignore */ }
    try {
      const raw2 = window.localStorage.getItem('jangsanote:rsvps')
      if (raw2) setRsvps(JSON.parse(raw2) as RsvpEntry[])
    } catch { /* ignore */ }
    try {
      const raw3 = window.localStorage.getItem('jangsanote:my-meetings')
      if (raw3) setMyMeetings(JSON.parse(raw3) as MyMeeting[])
    } catch { /* ignore */ }
    try {
      const raw4 = window.localStorage.getItem('jangsanote:likedPosts')
      if (raw4) setLikedIds(JSON.parse(raw4) as string[])
    } catch { /* ignore */ }
    try {
      const raw5 = window.localStorage.getItem('jangsanote:subscriptions')
      if (raw5) setSubscriptions(JSON.parse(raw5) as Subscription[])
    } catch { /* ignore */ }
    try {
      const raw6 = window.localStorage.getItem('jangsanote:recentPosts')
      if (raw6) setRecentPostIds(JSON.parse(raw6) as string[])
    } catch { /* ignore */ }
    try {
      const raw7 = window.localStorage.getItem('jangsanote:savedPosts')
      if (raw7) setSavedPostIds(JSON.parse(raw7) as string[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  const rsvpMeetings = rsvps
    .map((r) => MEETINGS.find((m) => m.id === r.meetingId))
    .filter(Boolean) as typeof MEETINGS

  const likedPosts = likedIds
    .slice(0, 8)
    .map((id) => POSTS.find((p) => p.id === id))
    .filter(Boolean) as typeof POSTS

  const savedPosts = savedPostIds
    .slice(0, 8)
    .map((id) => POSTS.find((p) => p.id === id))
    .filter(Boolean) as typeof POSTS

  const recentPosts = recentPostIds
    .slice(0, 6)
    .map((id) => POSTS.find((p) => p.id === id))
    .filter(Boolean) as typeof POSTS

  if (!hydrated) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 통계 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={PencilLine} label="내가 쓴 글" value={`${myPosts.length}개`} />
        <StatCard icon={Calendar} label="내 모임" value={`${myMeetings.length}개`} />
        <StatCard icon={ThumbsUp} label="좋아요한 글" value={`${likedIds.length}개`} />
        <StatCard icon={Bookmark} label="저장한 글" value={`${savedPostIds.length}개`} />
        <StatCard icon={Bookmark} label="구독 채널" value={`${subscriptions.length}개`} />
        <StatCard icon={Clock} label="최근 본 글" value={`${recentPostIds.length}개`} />
      </div>

      {/* 내가 쓴 글 (localStorage) */}
      {myPosts.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">내가 쓴 글</h2>
          <div className="space-y-2">
            {myPosts.map((p) => (
              <a
                key={p.id}
                href={`/posts/${p.id}`}
                className="flex items-start justify-between gap-3 rounded-xl border border-[var(--brand-primary)]/20 bg-amber-50/30 p-4 hover:border-[var(--brand-primary)]/40"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-gray-900">{p.title}</div>
                  <div className="mt-1 truncate text-xs text-gray-500">{p.excerpt}</div>
                  <div className="mt-1 text-xs text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <div className="shrink-0 text-xs text-gray-400">
                  {p.anonymous ? '익명' : p.authorName}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 좋아요한 글 */}
      <section>
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">좋아요한 글</h2>
        {likedPosts.length === 0 ? (
          <Card className="border-dashed border-gray-200">
            <CardContent className="p-8 text-center">
              <ThumbsUp className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                아직 좋아요한 글이 없습니다. 글에서 좋아요를 눌러보세요.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {likedPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>

      {/* 저장한 글 */}
      <section>
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">저장한 글</h2>
        {savedPosts.length === 0 ? (
          <Card className="border-dashed border-gray-200">
            <CardContent className="p-8 text-center">
              <Bookmark className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                아직 저장한 글이 없습니다. 글 상세 페이지에서 저장 버튼을 눌러보세요.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {savedPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>

      {/* 참여 신청한 모임 */}
      {rsvpMeetings.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[var(--brand-primary)]" />
            <h2 className="text-h4 font-semibold text-gray-900">신청한 모임</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rsvpMeetings.map((m) => (
              <MeetingCard key={m.id} meeting={m} />
            ))}
          </div>
        </section>
      )}

      {/* 내가 만든 모임 */}
      {myMeetings.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[var(--brand-primary)]" />
            <h2 className="text-h4 font-semibold text-gray-900">내가 만든 모임</h2>
          </div>
          <div className="space-y-2">
            {myMeetings.map((m) => (
              <div
                key={m.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-[var(--brand-primary)]/20 bg-amber-50/30 p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-gray-900">{m.title}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {m.date} · {m.location}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    참여 {m.currentParticipants}/{m.maxParticipants}명 ·{' '}
                    {m.isFree ? '무료' : `${(m.feeWon / 10000).toFixed(0)}만원`}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                  검토 중
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 최근 본 글 */}
      {recentPosts.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <h2 className="text-h4 font-semibold text-gray-900">최근 본 글</h2>
          </div>
          <div className="space-y-2">
            {recentPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* 구독 채널 */}
      {subscriptions.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">구독 중인 채널</h2>
          <div className="flex flex-wrap gap-2">
            {subscriptions.map((s) => (
              <a
                key={`${s.type}-${s.key}`}
                href={
                  s.type === 'general'
                    ? '/general'
                    : s.type === 'category'
                      ? `/categories/${s.key}`
                      : `/regions/${s.key}`
                }
                className="rounded-full border border-[var(--brand-primary)]/30 bg-amber-50 px-3 py-1.5 text-xs font-medium text-[var(--brand-primary)] hover:border-[var(--brand-primary)]/60"
              >
                {s.label}
              </a>
            ))}
          </div>
        </section>
      )}

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-5 text-sm">
          <div className="font-semibold text-amber-900">이 페이지는 mock 데이터입니다</div>
          <p className="mt-1 text-amber-800">
            Supabase 연결 후 실제 작성·저장·댓글 데이터로 교체됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof PencilLine
  label: string
  value: string
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <Icon className="h-4 w-4 text-gray-400" />
        <div className="mt-2 text-xs text-gray-500">{label}</div>
        <div className="mt-0.5 text-base font-semibold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  )
}
