import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ArrowLeft, Heart } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { BrandCard } from '@/components/brand-card'
import { BRANDS } from '@/lib/mock-data'

export default async function SavedBrandsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/saved')

  // Mock — show first 6 brands as saved (real impl: query user.savedBrands)
  const saved = BRANDS.slice(0, 6)

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
            저장한 {saved.length}개 브랜드. 가맹 상담을 신청하거나 다른 브랜드와 비교해보세요.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {saved.length === 0 ? (
          <Card className="border-dashed border-gray-200">
            <CardContent className="p-10 text-center">
              <Heart className="mx-auto h-10 w-10 text-gray-300" />
              <h2 className="mt-3 text-base font-semibold text-gray-900">
                아직 찜한 브랜드가 없습니다
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                브랜드 페이지에서 하트 아이콘을 눌러 관심 브랜드를 저장하세요.
              </p>
              <a
                href="/brands"
                className="mt-5 inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                브랜드 검색
              </a>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between text-sm">
              <div className="text-gray-700">{saved.length}개 브랜드</div>
              <a
                href={`/brands/compare?ids=${saved.slice(0, 3).map((b) => b.id).join(',')}`}
                className="text-gray-700 hover:text-gray-900"
              >
                찜한 브랜드 비교하기 →
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((b) => (
                <BrandCard key={b.id} brand={b} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
