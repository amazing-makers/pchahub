import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { AlertsClient } from './alerts-client'

export default async function AlertsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/alerts')

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/mypage" className="hover:text-gray-900">마이페이지</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">매물 알림 설정</span>
          </nav>
          <h1 className="mt-3 text-h3 font-bold text-gray-900">매물 알림 설정</h1>
          <p className="mt-1 text-sm text-gray-500">
            조건에 맞는 새 매물이 등록되면 알림을 보내드립니다.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-2xl py-8">
        <AlertsClient />
      </div>
    </main>
  )
}
