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
