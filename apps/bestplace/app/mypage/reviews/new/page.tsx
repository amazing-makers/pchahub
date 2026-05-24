import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { buildPageMetadata } from '@amakers/design-system'
import { STORES } from '@/lib/mock-data'
import { NewReviewClient } from './new-review-client'

export const metadata: Metadata = buildPageMetadata('bestplace', {
  title: '리뷰 작성',
  description: '방문한 매장의 솔직한 리뷰를 남겨주세요.',
  path: '/mypage/reviews/new',
})

export default async function NewReviewPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/reviews/new')

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/mypage" className="hover:text-gray-900">마이페이지</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <a href="/mypage/reviews" className="hover:text-gray-900">내 리뷰</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">리뷰 작성</span>
          </nav>
          <h1 className="mt-3 text-h3 font-bold text-gray-900">리뷰 작성</h1>
          <p className="mt-1 text-sm text-gray-500">
            방문한 매장에 대한 솔직한 경험을 공유해주세요.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <NewReviewClient stores={STORES.map((s) => ({ id: s.id, name: s.name, brandId: s.brandId, region: s.region, district: s.district }))} />
      </div>
    </main>
  )
}
