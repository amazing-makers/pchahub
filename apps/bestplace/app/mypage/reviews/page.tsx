import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ChevronRight, PenLine } from 'lucide-react'
import { ReviewsClient } from './reviews-client'

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/reviews')

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/mypage" className="hover:text-gray-900">마이페이지</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">내 리뷰</span>
          </nav>
          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-h3 font-bold text-gray-900">내가 쓴 리뷰</h1>
              <p className="mt-1 text-sm text-gray-500">작성한 매장 리뷰를 확인하고 관리하세요.</p>
            </div>
            <a
              href="/mypage/reviews/new"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              <PenLine className="h-4 w-4" />
              리뷰 작성
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-2xl py-8">
        <ReviewsClient />
      </div>
    </main>
  )
}
