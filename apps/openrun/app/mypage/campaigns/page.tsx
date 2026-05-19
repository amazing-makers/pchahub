import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { CampaignsClient } from './campaigns-client'

export default async function CampaignsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/campaigns')

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/mypage" className="hover:text-gray-900">마이페이지</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">캠페인 의뢰 현황</span>
          </nav>
          <h1 className="mt-3 text-h3 font-bold text-gray-900">캠페인 의뢰 현황</h1>
          <p className="mt-1 text-sm text-gray-500">
            의뢰한 캠페인의 진행 단계와 상태를 확인하세요.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-3xl py-8">
        <CampaignsClient />
      </div>
    </main>
  )
}
