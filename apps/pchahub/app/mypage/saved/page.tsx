import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ArrowLeft, Heart } from 'lucide-react'
import { SavedBrandsClient } from './saved-brands-client'

export default async function SavedBrandsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/saved')

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
            <Heart className="h-6 w-6 fill-rose-500 text-rose-500" />
            찜한 브랜드
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            브랜드 페이지에서 저장한 관심 브랜드 목록입니다.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <SavedBrandsClient />
      </div>
    </main>
  )
}
