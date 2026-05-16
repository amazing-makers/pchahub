import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { BRANDS } from '@/lib/mock-data'
import { LocalInquiriesSection } from './local-inquiries'

interface InquiryRow {
  id: string
  brandId: string
  brandName: string
  status: 'pending' | 'replied' | 'closed'
  statusLabel: string
  capital: string
  region: string
  createdAt: string
  lastMessage?: string
  lastFromHQ?: string
}

const MOCK_INQUIRIES: InquiryRow[] = [
  {
    id: 'i01',
    brandId: 'b1',
    brandName: '치킨다이스',
    status: 'replied',
    statusLabel: '본사 답변 완료',
    capital: '5,000 ~ 7,000만원',
    region: '서울',
    createdAt: '2026-05-09 14:22',
    lastFromHQ: '치킨다이스 가맹사업본부 / 박지영 본부장',
    lastMessage: '안녕하세요. 강남·송파 입지에 추천 매물 3건과 본사 견적 자료 보내드렸습니다. 가맹 상담 일정은 5/15 오후 2시 본사 미팅으로 잡으면 좋을 것 같습니다.',
  },
  {
    id: 'i02',
    brandId: 'b2',
    brandName: '데일리브루',
    status: 'pending',
    statusLabel: '본사 응답 대기',
    capital: '4,000 ~ 5,000만원',
    region: '경기',
    createdAt: '2026-05-10 09:48',
    lastMessage: '평수 12평 기준 데일리브루 분당 매장 운영 사례 + 평일 매출 데이터를 받고 싶습니다.',
  },
  {
    id: 'i03',
    brandId: 'b3',
    brandName: '한솥미식',
    status: 'closed',
    statusLabel: '종결',
    capital: '6,000 ~ 8,000만원',
    region: '인천',
    createdAt: '2026-04-22 16:10',
    lastFromHQ: '한솥미식 본사 / 김민호 가맹팀장',
    lastMessage: '문의해주신 송도 지역은 본사 직영점이 위치해 있어 가맹 출점이 제한됩니다. 인근 청라/검단 입지를 다시 검토해보시는 게 좋겠습니다.',
  },
]

const STATUS_COLOR: Record<InquiryRow['status'], 'warning' | 'success' | 'default'> = {
  pending: 'warning',
  replied: 'success',
  closed: 'default',
}

interface InquiriesPageProps {
  searchParams: { status?: string }
}

export default async function InquiriesPage({ searchParams }: InquiriesPageProps) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage/inquiries')

  const activeStatus = searchParams.status
  const filtered =
    activeStatus === 'pending' || activeStatus === 'replied' || activeStatus === 'closed'
      ? MOCK_INQUIRIES.filter((i) => i.status === activeStatus)
      : MOCK_INQUIRIES

  const counts = {
    all: MOCK_INQUIRIES.length,
    pending: MOCK_INQUIRIES.filter((i) => i.status === 'pending').length,
    replied: MOCK_INQUIRIES.filter((i) => i.status === 'replied').length,
    closed: MOCK_INQUIRIES.filter((i) => i.status === 'closed').length,
  }

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
            <MessageSquare className="h-6 w-6" />
            상담 신청 내역
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            본사에 보낸 가맹 상담 신청과 답변을 한 곳에서 관리하세요.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {/* 사용자가 실제 제출한 상담 신청 (localStorage) */}
        <LocalInquiriesSection />

        <div className="mb-3 text-sm font-semibold text-gray-500">상담 예시 내역</div>
        <div className="mb-4 flex flex-wrap gap-1.5 text-sm">
          <FilterChip href="/mypage/inquiries" active={!activeStatus}>
            전체 ({counts.all})
          </FilterChip>
          <FilterChip href="/mypage/inquiries?status=pending" active={activeStatus === 'pending'}>
            응답 대기 ({counts.pending})
          </FilterChip>
          <FilterChip href="/mypage/inquiries?status=replied" active={activeStatus === 'replied'}>
            답변 완료 ({counts.replied})
          </FilterChip>
          <FilterChip href="/mypage/inquiries?status=closed" active={activeStatus === 'closed'}>
            종결 ({counts.closed})
          </FilterChip>
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed border-gray-200">
            <CardContent className="p-10 text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />
              <h2 className="mt-3 text-base font-semibold text-gray-900">
                해당 상태의 상담 내역이 없습니다
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                관심 브랜드 페이지에서 가맹 상담을 신청해보세요.
              </p>
              <a
                href="/brands"
                className="mt-5 inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                브랜드 둘러보기
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((i) => {
              const brand = BRANDS.find((b) => b.id === i.brandId)
              return (
                <Card key={i.id} className="border-gray-200">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {brand && (
                            <span
                              className="h-7 w-7 shrink-0 rounded-lg"
                              style={{ background: brand.logoColor }}
                              aria-hidden
                            />
                          )}
                          <a
                            href={`/brands/${i.brandId}`}
                            className="text-base font-semibold text-gray-900 hover:underline"
                          >
                            {i.brandName}
                          </a>
                          <Badge variant={STATUS_COLOR[i.status]}>{i.statusLabel}</Badge>
                        </div>
                        <div className="mt-2 grid gap-1 text-xs text-gray-600 sm:grid-cols-3">
                          <span>희망 지역 · {i.region}</span>
                          <span>가용 자본 · {i.capital}</span>
                          <span>신청일 · {i.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {i.lastMessage && (
                      <div
                        className={
                          'mt-4 rounded-lg p-3 text-sm ' +
                          (i.lastFromHQ
                            ? 'bg-emerald-50 text-emerald-900'
                            : 'bg-gray-50 text-gray-700')
                        }
                      >
                        <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                          {i.lastFromHQ ?? '내가 보낸 메시지'}
                        </div>
                        <p className="mt-1 line-clamp-2">{i.lastMessage}</p>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3 text-sm">
                      <a
                        href={`/brands/${i.brandId}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        브랜드 보기 →
                      </a>
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
