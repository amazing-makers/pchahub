import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { Badge, Card } from '@amakers/ui'

const MOCK_INQUIRIES = [
  {
    id: 'i101',
    name: '김재훈',
    region: '서울',
    capital: '5,000 ~ 7,000만원',
    motive: '창업 검토 · 견적',
    phone: '010-1234-5678',
    question: '강남구 쪽 입지와 초기 투자비용이 궁금합니다.',
    createdAt: '2026-05-10 14:22',
    status: 'new' as const,
  },
  {
    id: 'i100',
    name: '박서연',
    region: '경기',
    capital: '7,000만 ~ 1억',
    motive: '입지 추천',
    phone: '010-9876-5432',
    question: '판교 / 분당 인근 가맹 개설 가능 여부 문의드립니다.',
    createdAt: '2026-05-09 11:08',
    status: 'replied' as const,
  },
  {
    id: 'i099',
    name: '정민호',
    region: '부산',
    capital: '3,000 ~ 5,000만원',
    motive: '브랜드 정보 문의',
    phone: '010-5555-7777',
    question: '부산 해운대 상권 현황과 가맹비 상세가 궁금합니다.',
    createdAt: '2026-05-07 18:40',
    status: 'closed' as const,
  },
  {
    id: 'i098',
    name: '최유진',
    region: '대구',
    capital: '5,000 ~ 7,000만원',
    motive: '창업 준비',
    phone: '010-2222-3333',
    question: '대구 동성로 근처 창업 관련 문의입니다.',
    createdAt: '2026-05-06 09:15',
    status: 'new' as const,
  },
  {
    id: 'i097',
    name: '이승우',
    region: '인천',
    capital: '1억 이상',
    motive: '복수 점포 검토',
    phone: '010-8888-9999',
    question: '인천 송도 및 청라 두 곳 동시 개설 가능 여부 문의합니다.',
    createdAt: '2026-05-04 16:30',
    status: 'replied' as const,
  },
]

const STATUS_LABEL: Record<'new' | 'replied' | 'closed', string> = {
  new: '신규',
  replied: '답변 완료',
  closed: '종결',
}

const STATUS_VARIANT: Record<'new' | 'replied' | 'closed', 'warning' | 'success' | 'default'> = {
  new: 'warning',
  replied: 'success',
  closed: 'default',
}

export default async function HQInquiriesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/hq/inquiries')
  const role = (session.user as { role?: string } | null | undefined)?.role
  if (role !== 'hq') redirect('/mypage')

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-600" />
              <h1 className="text-h3 font-bold text-gray-900">가맹 문의 전체</h1>
            </div>
            <a href="/hq/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              ← 대시보드
            </a>
          </div>
          <p className="mt-1 text-sm text-gray-500">총 {MOCK_INQUIRIES.length}건</p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <Card className="border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-5 py-3 font-medium">신청자</th>
                  <th className="px-5 py-3 font-medium">연락처</th>
                  <th className="px-5 py-3 font-medium">지역</th>
                  <th className="px-5 py-3 font-medium">자본</th>
                  <th className="px-5 py-3 font-medium">동기</th>
                  <th className="px-5 py-3 font-medium">문의 내용</th>
                  <th className="px-5 py-3 font-medium">신청일</th>
                  <th className="px-5 py-3 font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_INQUIRIES.map((i) => (
                  <tr key={i.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                    <td className="px-5 py-3 font-medium text-gray-900">{i.name}</td>
                    <td className="px-5 py-3 text-gray-700">{i.phone}</td>
                    <td className="px-5 py-3 text-gray-700">{i.region}</td>
                    <td className="px-5 py-3 text-gray-700">{i.capital}</td>
                    <td className="px-5 py-3 text-gray-700">{i.motive}</td>
                    <td className="max-w-xs px-5 py-3 text-gray-600">
                      <p className="line-clamp-2 text-xs">{i.question}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{i.createdAt}</td>
                    <td className="px-5 py-3">
                      <Badge variant={STATUS_VARIANT[i.status]}>{STATUS_LABEL[i.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  )
}
