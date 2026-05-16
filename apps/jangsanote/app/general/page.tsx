import { ChannelList } from '@/components/channel-list'
import { PostCard } from '@/components/post-card'
import { POSTS } from '@/lib/mock-data'
import { LocalPostsFeed } from '@/app/local-posts-feed'

export default function GeneralPage() {
  const posts = POSTS.filter((p) => p.channelType === 'general').sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">자유게시판</h1>
          <p className="mt-1 text-sm text-gray-500">업종·지역 구분 없이 자유롭게 이야기하는 곳</p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <ChannelList activeChannel={{ type: 'general', key: 'general' }} />
          </aside>
          <div className="space-y-3">
            <LocalPostsFeed channelType="general" />
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
