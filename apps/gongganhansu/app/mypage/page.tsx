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
      {/* Header */}
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
              <p className="mt-0.5 text-sm text-gray-500">{session.user?.email}</p>
            </div>
          </div>

          <nav className="mt-6 flex flex-wrap gap-2 text-sm">
            <a href="/gallery" className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50">
              갤러리
            </a>
            <a href="/contractors" className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50">
              시공사 찾기
            </a>
            <a href="/quote" className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50">
              견적 요청
            </a>
          </nav>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <MyPageClient />
      </div>
    </main>
  )
}
