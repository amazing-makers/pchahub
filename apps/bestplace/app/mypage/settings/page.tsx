import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ArrowLeft, Settings } from 'lucide-react'
import { SettingsForm } from './form'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/settings')

  const name = session.user?.name ?? session.user?.email?.split('@')[0] ?? '사용자'
  const email = session.user?.email ?? ''
  const role = (session.user as { role?: string } | null | undefined)?.role ?? 'user'

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <a
            href="/mypage"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            마이페이지로
          </a>
          <h1 className="mt-3 inline-flex items-center gap-2 text-h3 font-bold text-gray-900">
            <Settings className="h-6 w-6" />
            계정 설정
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            프로필·알림·개인정보 설정을 관리하세요.
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <SettingsForm defaultName={name} email={email} role={role} />
      </div>
    </main>
  )
}
