import { notFound } from 'next/navigation'
import { Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { ChannelList } from '@/components/channel-list'
import { PostCard } from '@/components/post-card'
import { CHANNELS, postsByChannel } from '@/lib/mock-data'

export function generateStaticParams() {
  return CHANNELS.filter((c) => c.type === 'region').map((c) => ({ region: c.key }))
}

interface RegionPageProps {
  params: { region: string }
}

export default function RegionPage({ params }: RegionPageProps) {
  const channel = CHANNELS.find((c) => c.type === 'region' && c.key === params.region)
  if (!channel) notFound()
  const posts = postsByChannel('region', channel.key)

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">{channel.label}</h1>
          <p className="mt-1 text-sm text-gray-500">{channel.description}</p>
          <div className="mt-2 text-xs text-gray-500">
            회원 {formatNumber(channel.memberCount)}명 · 글 {formatNumber(channel.postCount)}개
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <ChannelList activeChannel={{ type: 'region', key: channel.key }} />
          </aside>
          <div className="space-y-3">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-sm text-gray-500">
                  아직 작성된 글이 없습니다. 첫 글을 남겨보세요.
                </CardContent>
              </Card>
            ) : (
              posts.map((p) => <PostCard key={p.id} post={p} />)
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
