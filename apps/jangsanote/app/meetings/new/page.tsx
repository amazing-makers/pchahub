import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { MeetingNewForm } from './form'

export default async function MeetingNewPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/meetings/new')

  const name = (session.user as { name?: string } | null)?.name ?? '익명'

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h2 font-bold text-gray-900">모임 열기</h1>
          <p className="mt-1 text-sm text-gray-500">
            자영업·가맹 관련 오프라인 또는 온라인 모임을 직접 개설하세요.
          </p>
        </div>
      </section>
      <div className="container mx-auto max-w-2xl py-8">
        <MeetingNewForm hostName={name} />
      </div>
    </main>
  )
}
