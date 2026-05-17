import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'
import { ReviewFormContent } from './review-form'

export default async function NewReviewPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/reviews/new')

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <a href="/mypage/reviews" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-3.5 w-3.5" />
            내 후기로
          </a>
          <h1 className="mt-3 text-h3 font-bold text-gray-900">가맹점주 후기 작성</h1>
          <p className="mt-1 text-sm text-gray-500">
            실제 운영 경험을 솔직하게 공유해주세요. 검수 후 게시됩니다.
          </p>
        </div>
      </section>
      <div className="container mx-auto max-w-xl py-10">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
          <ReviewFormContent />
        </Suspense>
      </div>
    </main>
  )
}
