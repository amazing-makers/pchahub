import { Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { POSTS, MEETINGS, CHANNELS, CATEGORY_LABEL, MEETING_TYPE_LABEL } from '@/lib/mock-data'
import { PostCard } from '@/components/post-card'
import { MeetingCard } from '@/components/meeting-card'

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams.q ?? '').trim()
  const needle = q.toLowerCase()

  const posts = q
    ? POSTS.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.excerpt.toLowerCase().includes(needle) ||
          p.tags.some((t) => t.toLowerCase().includes(needle)) ||
          CHANNELS.find((c) => c.key === p.channelKey)?.label.toLowerCase().includes(needle),
      )
    : []

  const meetings = q
    ? MEETINGS.filter(
        (m) =>
          m.title.toLowerCase().includes(needle) ||
          m.description.toLowerCase().includes(needle) ||
          m.tags.some((t) => t.toLowerCase().includes(needle)) ||
          m.location.toLowerCase().includes(needle),
      )
    : []

  const total = posts.length + meetings.length

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
                placeholder="게시글, 모임, 채널 검색..."
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
              <p className="mt-3 text-sm text-gray-500">검색어를 입력하세요.</p>
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

        {posts.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              게시글 <span className="text-sm font-normal text-gray-400">({posts.length})</span>
            </h2>
            <div className="space-y-3">
              {posts.slice(0, 10).map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
            {posts.length > 10 && (
              <a
                href={`/posts?q=${encodeURIComponent(q)}`}
                className="mt-3 inline-flex text-sm text-[var(--brand-primary)] hover:underline"
              >
                게시글 {posts.length}개 전체보기 →
              </a>
            )}
          </section>
        )}

        {meetings.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">
              모임 <span className="text-sm font-normal text-gray-400">({meetings.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {meetings.slice(0, 6).map((m) => (
                <MeetingCard key={m.id} meeting={m} />
              ))}
            </div>
            {meetings.length > 6 && (
              <a
                href={`/meetings?q=${encodeURIComponent(q)}`}
                className="mt-3 inline-flex text-sm text-[var(--brand-primary)] hover:underline"
              >
                모임 {meetings.length}개 전체보기 →
              </a>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
