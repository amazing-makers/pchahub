import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { Bookmark, MessageSquare, PencilLine, ThumbsUp } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { PostCard } from '@/components/post-card'
import { POSTS } from '@/lib/mock-data'

export default async function MyPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage')

  const name = session.user?.name ?? session.user?.email?.split('@')[0] ?? '회원'
  const saved = POSTS.slice(0, 3)
  const commented = POSTS.slice(1, 4)

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-start gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-h3 font-bold text-gray-900">{name}</h1>
              <div className="mt-1 text-sm text-gray-500">{session.user?.email}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={PencilLine} label="작성한 글" value="0개" />
          <Stat icon={MessageSquare} label="댓글" value="0개" />
          <Stat icon={Bookmark} label="저장한 글" value={`${saved.length}개`} />
          <Stat icon={ThumbsUp} label="받은 좋아요" value="0개" />
        </div>

        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">저장한 글</h2>
          <div className="space-y-3">
            {saved.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">댓글 단 글</h2>
          <div className="space-y-3">
            {commented.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5 text-sm">
            <div className="font-semibold text-amber-900">이 페이지는 mock 데이터입니다</div>
            <p className="mt-1 text-amber-800">
              Supabase 연결 후 실제 작성·저장·댓글 데이터로 교체됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function Stat({ icon: Icon, label, value }: { icon: typeof Bookmark; label: string; value: string }) {
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
