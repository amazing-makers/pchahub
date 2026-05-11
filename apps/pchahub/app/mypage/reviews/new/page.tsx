import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ArrowLeft, PencilLine } from 'lucide-react'
import { BRANDS } from '@/lib/mock-data'
import { ReviewForm } from './form'

interface NewReviewPageProps {
  searchParams: { brand?: string }
}

export default async function NewReviewPage({ searchParams }: NewReviewPageProps) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/reviews/new')

  const presetBrand = searchParams.brand
    ? BRANDS.find((b) => b.id === searchParams.brand)
    : null

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
            <PencilLine className="h-6 w-6" />
            가맹점주 후기 작성
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            본인이 운영 중이거나 운영했던 가맹 브랜드의 솔직한 후기를 작성해주세요. 검수 후 브랜드
            페이지와 장사노트 커뮤니티에 노출됩니다.
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <ReviewForm presetBrandId={presetBrand?.id ?? null} brands={BRANDS} />
      </div>
    </main>
  )
}
