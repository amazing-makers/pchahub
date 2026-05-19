import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { User } from 'lucide-react'
import { MyPageClient } from './mypage-client'

export default async function MyPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage')

  const name = session.user?.name ?? session.user?.email?.split('@')[0] ?? '사용자'

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-h3 font-bold text-gray-900">{name}</h1>
              <div className="mt-0.5 text-sm text-gray-500">{session.user?.email}</div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <a
                  href="/episodes"
                  className="rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:border-gray-400"
                >
                  에피소드
                </a>
                <a
                  href="/magazine"
                  className="rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:border-gray-400"
                >
                  매거진
                </a>
                <a
                  href="/mypage/history"
                  className="rounded-full border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/5 px-3 py-1 text-[var(--brand-primary)] hover:border-[var(--brand-primary)]/70"
                >
                  시청 기록
                </a>
                <a
                  href="/mypage/settings"
                  className="rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:border-gray-400"
                >
                  계정 설정
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
