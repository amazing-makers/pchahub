'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Calendar, MessageSquare, PencilLine, ThumbsUp } from 'lucide-react'
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

export function MyPageClient() {
  const [myPosts, setMyPosts] = useState<LocalPost[]>([])
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('jangsanote:posts')
      if (raw) setMyPosts(JSON.parse(raw) as LocalPost[])
    } catch {
      // ignore
    }
    try {
      const raw2 = window.localStorage.getItem('jangsanote:rsvps')
      if (raw2) setRsvps(JSON.parse(raw2) as RsvpEntry[])
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  const rsvpMeetings = rsvps
    .map((r) => MEETINGS.find((m) => m.id === r.meetingId))
    .filter(Boolean) as typeof MEETINGS

  // Static mock sample posts for the demo — we show these + any locally written ones
  const sampleSaved = POSTS.slice(0, 3)

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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={PencilLine} label="내가 쓴 글" value={`${myPosts.length}개`} />
        <StatCard icon={MessageSquare} label="댓글" value="0개" />
        <StatCard icon={Bookmark} label="저장한 글" value={`${sampleSaved.length}개`} />
        <StatCard icon={ThumbsUp} label="받은 좋아요" value="0개" />
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

      {/* 저장한 글 (샘플) */}
      <section>
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">저장한 글</h2>
        <div className="space-y-3">
          {sampleSaved.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
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
