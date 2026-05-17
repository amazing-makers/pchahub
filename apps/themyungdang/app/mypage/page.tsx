import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Eye, MessageSquare, PencilLine } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

import { ListingSectionSkeleton, StatSkeleton } from '@/components/skeletons'

const FavoritesSection       = dynamic(() => import('@/components/favorites-section'),                                       { ssr: false, loading: () => <ListingSectionSkeleton count={3} /> })
const FavoritesStat          = dynamic(() => import('@/components/favorites-stat'),                                          { ssr: false, loading: () => <StatSkeleton /> })
const RecentlyViewedStat     = dynamic(() => import('@/components/recently-viewed-stat'),                                    { ssr: false, loading: () => <StatSkeleton /> })
const RecentlyViewedSection  = dynamic(() => import('@/components/recently-viewed').then((m) => m.RecentlyViewedSection),   { ssr: false, loading: () => <ListingSectionSkeleton count={3} /> })
const ListingsSubmittedStat  = dynamic(() => import('@/components/listings-submitted-stat').then((m) => m.ListingsSubmittedStat), { ssr: false, loading: () => <StatSkeleton /> })
const InquiriesSection       = dynamic(() => import('./inquiries-section').then((m) => m.InquiriesSection),                 { ssr: false, loading: () => <div className="space-y-2">{[1,2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />)}</div> })

export default async function MyPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage')

  const name = session.user?.name ?? session.user?.email?.split('@')[0] ?? '회원'

  return (
    <main className="bg-gray-50">
      {/* Header */}
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
              <div className="mt-2">
                <a
                  href="/mypage/settings"
                  className="text-xs text-gray-500 hover:text-gray-900 hover:underline"
                >
                  계정 설정
                </a>
              </div>
            </div>
            <a href="/post">
              <Button size="md" className="gap-1">
                <PencilLine className="h-4 w-4" />
                매물 등록
              </Button>
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* FavoritesStat reads localStorage on the client */}
          <FavoritesStat />
          <Stat icon={MessageSquare} label="매물 문의" value="—" />
          <RecentlyViewedStat />
          <ListingsSubmittedStat />
        </div>

        {/* Inquiries */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-h4 font-semibold text-gray-900">최근 매물 문의</h2>
            <a href="/mypage/inquiries" className="text-sm text-gray-600 hover:text-gray-900">
              전체 보기 →
            </a>
          </div>
          <InquiriesSection />
        </section>

        {/* Saved listings — reads from localStorage via client island */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-h4 font-semibold text-gray-900">찜한 매물</h2>
            <a href="/listings" className="text-sm text-gray-600 hover:text-gray-900">
              매물 더 찾기 →
            </a>
          </div>
          <FavoritesSection />
        </section>

        {/* Recently viewed — client island */}
        <RecentlyViewedSection />

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5 text-sm">
            <div className="font-semibold text-amber-900">이 페이지는 mock 데이터입니다</div>
            <p className="mt-1 text-amber-800">
              Supabase 연결 후 실제 사용자별 데이터로 교체됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye
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
