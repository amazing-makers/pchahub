import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { MyPageClient } from './mypage-client'

export default async function MyPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage')

  const name = session.user?.name ?? session.user?.email?.split('@')[0] ?? '회원'

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
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <a
                  href="/stores"
                  className="rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:border-gray-400"
                >
                  매장 둘러보기
                </a>
                <a
                  href="/rankings"
                  className="rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:border-gray-400"
                >
                  랭킹 보기
                </a>
                <a
                  href="/mypage/reviews"
                  className="rounded-full border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/5 px-3 py-1 text-[var(--brand-primary)] hover:border-[var(--brand-primary)]/70"
                >
                  내 리뷰
                </a>
                <a
                  href="/mypage/settings"
                  className="rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:border-gray-400"
                >
                  계정 설정
                </a>
                <a
                  href="/register"
                  className="rounded-full border border-gray-900 bg-gray-900 px-3 py-1 text-white hover:bg-gray-800"
                >
                  내 매장 등록하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <MyPageClient />
      </div>
    </main>
  )
}
