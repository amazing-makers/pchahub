import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { HistoryClient } from './history-client'

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/history')

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/mypage" className="hover:text-gray-900">마이페이지</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">시청 기록</span>
          </nav>
          <h1 className="mt-3 text-h3 font-bold text-gray-900">시청 기록</h1>
          <p className="mt-1 text-sm text-gray-500">
            최근 본 에피소드와 매거진 글을 확인하세요.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <HistoryClient />
      </div>
    </main>
  )
}
