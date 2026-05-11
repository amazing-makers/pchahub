import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ArrowLeft, PencilLine, Plus, Star } from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { BRANDS } from '@/lib/mock-data'

interface MyReviewRow {
  id: string
  brandId: string
  brandName: string
  status: 'pending' | 'published' | 'rejected'
  rating: number
  summary: string
  detail: string
  helpful: number
  views: number
  createdAt: string
  rejectionReason?: string
}

const MOCK_REVIEWS: MyReviewRow[] = [
  {
    id: 'r1',
    brandId: 'b1',
    brandName: '치킨다이스',
    status: 'published',
    rating: 5,
    summary: '본사 응대가 빠르고 신메뉴 회전이 좋아요',
    detail:
      '2년 전 오픈했는데 본사 슈퍼바이저가 한 달에 두 번씩 방문해서 매장 운영 코칭을 해줍니다. 신메뉴도 자주 출시되어서 단골이 안 떨어집니다.',
    helpful: 24,
    views: 1820,
    createdAt: '2026-03-12',
  },
  {
    id: 'r2',
    brandId: 'b2',
    brandName: '데일리브루',
    status: 'pending',
    rating: 4,
    summary: '저자본 창업의 정석. 다만 마진은 박합니다',
    detail:
      '4천만원으로 시작해서 1년 만에 회수했습니다. 다만 객단가가 낮아서 회전율이 생명이에요.',
    helpful: 0,
    views: 0,
    createdAt: '2026-05-08',
  },
  {
    id: 'r3',
    brandId: 'b5',
    brandName: '분식나라',
    status: 'rejected',
    rating: 2,
    summary: '본사 관계자 비방',
    detail: '...',
    helpful: 0,
    views: 0,
    createdAt: '2026-04-22',
    rejectionReason: '특정 본사 임직원에 대한 비방 표현이 포함되어 게시가 보류되었습니다. 운영 문제 위주로 다시 작성해주세요.',
  },
]

const STATUS_LABEL: Record<MyReviewRow['status'], string> = {
  pending: '검수 중',
  published: '게시 중',
  rejected: '반려',
}

const STATUS_VARIANT: Record<MyReviewRow['status'], 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  published: 'success',
  rejected: 'error',
}

interface ReviewsPageProps {
  searchParams: { status?: string }
}

export default async function MyReviewsPage({ searchParams }: ReviewsPageProps) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/reviews')

  const activeStatus = searchParams.status
  const filtered =
    activeStatus === 'pending' || activeStatus === 'published' || activeStatus === 'rejected'
      ? MOCK_REVIEWS.filter((r) => r.status === activeStatus)
      : MOCK_REVIEWS

  const counts = {
    all: MOCK_REVIEWS.length,
    pending: MOCK_REVIEWS.filter((r) => r.status === 'pending').length,
    published: MOCK_REVIEWS.filter((r) => r.status === 'published').length,
    rejected: MOCK_REVIEWS.filter((r) => r.status === 'rejected').length,
  }

  const totalHelpful = MOCK_REVIEWS.reduce((sum, r) => sum + r.helpful, 0)
  const totalViews = MOCK_REVIEWS.reduce((sum, r) => sum + r.views, 0)

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
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="inline-flex items-center gap-2 text-h3 font-bold text-gray-900">
                <PencilLine className="h-6 w-6" />내가 작성한 후기
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                총 {counts.all}개 후기 작성 · 도움됨 {totalHelpful}건 · 조회 {totalViews.toLocaleString()}회
              </p>
            </div>
            <a href="/mypage/reviews/new">
              <Button size="md" className="gap-1">
                <Plus className="h-4 w-4" />
                새 후기 작성
              </Button>
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="mb-4 flex flex-wrap gap-1.5 text-sm">
          <FilterChip href="/mypage/reviews" active={!activeStatus}>
            전체 ({counts.all})
          </FilterChip>
          <FilterChip href="/mypage/reviews?status=published" active={activeStatus === 'published'}>
            게시 중 ({counts.published})
          </FilterChip>
          <FilterChip href="/mypage/reviews?status=pending" active={activeStatus === 'pending'}>
            검수 중 ({counts.pending})
          </FilterChip>
          <FilterChip href="/mypage/reviews?status=rejected" active={activeStatus === 'rejected'}>
            반려 ({counts.rejected})
          </FilterChip>
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed border-gray-200">
            <CardContent className="p-10 text-center">
              <PencilLine className="mx-auto h-10 w-10 text-gray-300" />
              <h2 className="mt-3 text-base font-semibold text-gray-900">
                해당 상태의 후기가 없습니다
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                운영 중인 가맹 브랜드의 솔직한 경험을 공유해주세요.
              </p>
              <a href="/mypage/reviews/new" className="mt-5 inline-block">
                <Button>새 후기 작성</Button>
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => {
              const brand = BRANDS.find((b) => b.id === r.brandId)
              return (
                <Card key={r.id} className="border-gray-200">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {brand && (
                          <span
                            className="h-7 w-7 shrink-0 rounded-lg"
                            style={{ background: brand.logoColor }}
                            aria-hidden
                          />
                        )}
                        <a
                          href={`/brands/${r.brandId}`}
                          className="text-base font-semibold text-gray-900 hover:underline"
                        >
                          {r.brandName}
                        </a>
                        <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={
                              'h-4 w-4 ' +
                              (n <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300')
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 text-sm font-semibold text-gray-900">{r.summary}</div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-gray-700">{r.detail}</p>

                    {r.status === 'rejected' && r.rejectionReason && (
                      <div className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-900">
                        <div className="font-semibold">반려 사유</div>
                        <p className="mt-1">{r.rejectionReason}</p>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                      <span>작성일 · {r.createdAt}</span>
                      {r.status === 'published' && (
                        <span className="inline-flex items-center gap-3">
                          <span>도움됨 {r.helpful}</span>
                          <span>조회 {r.views.toLocaleString()}</span>
                        </span>
                      )}
                      {r.status === 'rejected' && (
                        <a
                          href={`/mypage/reviews/new?brand=${r.brandId}`}
                          className="font-medium text-gray-700 hover:text-gray-900"
                        >
                          다시 작성 →
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={
        'rounded-full px-3 py-1.5 transition-colors ' +
        (active
          ? 'bg-gray-900 text-white'
          : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300')
      }
    >
      {children}
    </a>
  )
}
