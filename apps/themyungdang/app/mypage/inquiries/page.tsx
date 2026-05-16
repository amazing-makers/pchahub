import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { LISTINGS } from '@/lib/mock-data'

// Mock inquiry data (mirrors what's shown on the mypage overview)
const MOCK_INQUIRIES = [
  {
    id: 'q1',
    listingId: 'l001',
    title: '강남역 도보 5분, 1층 코너 양도 매물',
    status: 'pending' as const,
    statusLabel: '응답 대기',
    message: '해당 매물의 현재 매출 증빙 자료를 확인할 수 있을까요? 방문 실사도 가능한지 여부도 여쭤봅니다.',
    createdAt: '2026-05-09',
    updatedAt: '2026-05-09',
  },
  {
    id: 'q2',
    listingId: 'l008',
    title: '판교 IT 단지 1층 코너 신축 매물',
    status: 'replied' as const,
    statusLabel: '답변 완료',
    message: '주차 공간이 몇 대 가능한지, 엘리베이터 위치가 매장 앞인지 확인 부탁드립니다.',
    reply: '주차는 건물 지하 2층 기준 2대 확보됩니다. 엘리베이터는 매장 입구 바로 옆에 있어 동선이 편리합니다. 언제든지 방문 일정 조율 가능합니다.',
    createdAt: '2026-05-06',
    updatedAt: '2026-05-07',
  },
]

export default async function InquiriesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/inquiries')

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <a
            href="/mypage"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            마이페이지
          </a>
          <h1 className="mt-4 text-h3 font-bold text-gray-900">매물 문의 내역</h1>
          <p className="mt-1 text-sm text-gray-500">
            총 {MOCK_INQUIRIES.length}건의 문의 내역
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {MOCK_INQUIRIES.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <MessageSquare className="h-10 w-10 text-gray-200" />
            <p className="text-sm font-semibold text-gray-500">아직 문의 내역이 없습니다</p>
            <p className="text-xs text-gray-400">매물 상세 페이지에서 문의를 보내보세요.</p>
            <a
              href="/listings"
              className="mt-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              매물 둘러보기 →
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {MOCK_INQUIRIES.map((inquiry) => {
              const listing = LISTINGS.find((l) => l.id === inquiry.listingId)
              return (
                <Card key={inquiry.id} className="border-gray-200 shadow-sm">
                  <CardContent className="p-5">
                    {/* Top row: title + status */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <a
                          href={`/listings/${inquiry.listingId}`}
                          className="text-sm font-semibold text-gray-900 hover:underline"
                        >
                          {inquiry.title}
                        </a>
                        {listing && (
                          <div className="mt-0.5 text-xs text-gray-500">
                            {listing.region} {listing.district} · {listing.area}평 · {listing.floor}
                          </div>
                        )}
                      </div>
                      <Badge variant={inquiry.status === 'replied' ? 'success' : 'warning'}>
                        {inquiry.statusLabel}
                      </Badge>
                    </div>

                    {/* My message */}
                    <div className="mt-4 rounded-xl bg-gray-50 p-3.5">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        내 문의
                      </p>
                      <p className="text-sm text-gray-700">{inquiry.message}</p>
                      <p className="mt-1.5 text-xs text-gray-400">
                        {inquiry.createdAt}
                      </p>
                    </div>

                    {/* Reply */}
                    {inquiry.reply && (
                      <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3.5">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                          답변
                        </p>
                        <p className="text-sm text-emerald-900">{inquiry.reply}</p>
                        <p className="mt-1.5 text-xs text-emerald-600">
                          {inquiry.updatedAt}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Mock notice */}
        <Card className="mt-8 border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-sm">
            <div className="font-semibold text-amber-900">이 페이지는 mock 데이터입니다</div>
            <p className="mt-1 text-amber-800">
              Supabase 연결 후 실제 문의 데이터로 교체됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
