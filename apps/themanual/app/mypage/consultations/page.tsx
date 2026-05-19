import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { ConsultationsClient } from './consultations-client'

export default async function ConsultationsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/consultations')

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/mypage" className="hover:text-gray-900">마이페이지</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">예약 내역</span>
          </nav>
          <h1 className="mt-3 text-h3 font-bold text-gray-900">멘토 예약 내역</h1>
          <p className="mt-1 text-sm text-gray-500">
            신청한 1:1 화상 상담 예약을 확인하고 관리하세요.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <ConsultationsClient />
      </div>
    </main>
  )
}
