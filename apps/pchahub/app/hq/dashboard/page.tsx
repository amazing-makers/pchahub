import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import {
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Eye,
  MessageSquare,
  MousePointerClick,
  PencilLine,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { BRANDS } from '@/lib/mock-data'

const MOCK_INQUIRIES = [
  {
    id: 'i101',
    name: '김재훈',
    region: '서울',
    capital: '5,000 ~ 7,000만원',
    motive: '창업 검토 · 견적',
    createdAt: '2026-05-10 14:22',
    status: 'new' as const,
  },
  {
    id: 'i100',
    name: '박서연',
    region: '경기',
    capital: '7,000만 ~ 1억',
    motive: '입지 추천',
    createdAt: '2026-05-09 11:08',
    status: 'replied' as const,
  },
  {
    id: 'i099',
    name: '정민호',
    region: '부산',
    capital: '3,000 ~ 5,000만원',
    motive: '브랜드 정보 문의',
    createdAt: '2026-05-07 18:40',
    status: 'closed' as const,
  },
]

const MOCK_METRICS = {
  views: 4_820,
  clicks: 612,
  inquiries: 38,
  conversionRate: 6.2,
}

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

export default async function HQDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/hq/dashboard')

  const role = (session.user as { role?: string } | null | undefined)?.role
  if (role !== 'hq') redirect('/mypage')

  // Mock — first brand as the HQ's brand
  const myBrand = BRANDS[0]

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="h-12 w-12 shrink-0 rounded-xl"
                style={{ background: myBrand.logoColor }}
                aria-hidden
              />
              <div>
                <h1 className="text-h3 font-bold text-gray-900">{myBrand.name} 본사 대시보드</h1>
                <div className="mt-0.5 text-sm text-gray-500">
                  {myBrand.categoryLabel} · 협회 등록 정보공개서 연동
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={`/brands/${myBrand.id}`}>
                <Button variant="outline" size="md" className="gap-1">
                  공개 페이지 보기 <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </a>
              <a href="/hq/brand/edit">
                <Button size="md" className="gap-1">
                  <PencilLine className="h-4 w-4" />
                  브랜드 정보 수정
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto space-y-8 py-8">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard icon={Eye} label="페이지 조회 (월)" value={formatNumber(MOCK_METRICS.views)} delta="+18%" />
          <MetricCard
            icon={MousePointerClick}
            label="브랜드 클릭"
            value={formatNumber(MOCK_METRICS.clicks)}
            delta="+12%"
          />
          <MetricCard
            icon={MessageSquare}
            label="가맹 문의 (월)"
            value={String(MOCK_METRICS.inquiries)}
            delta="+8%"
          />
          <MetricCard
            icon={TrendingUp}
            label="문의 전환율"
            value={`${MOCK_METRICS.conversionRate}%`}
            delta="+0.4%"
          />
        </div>

        {/* Inquiries */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="inline-flex items-center gap-2 text-h4 font-semibold text-gray-900">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                가맹 문의 (최근 10건)
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">실시간 알림은 SMS로 발송됩니다.</p>
            </div>
            <a href="/hq/inquiries" className="text-sm text-gray-600 hover:text-gray-900">
              전체 보기 →
            </a>
          </div>
          <Card className="border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs text-gray-500">
                    <th className="px-5 py-3 font-medium">신청자</th>
                    <th className="px-5 py-3 font-medium">지역</th>
                    <th className="px-5 py-3 font-medium">자본</th>
                    <th className="px-5 py-3 font-medium">동기</th>
                    <th className="px-5 py-3 font-medium">신청일</th>
                    <th className="px-5 py-3 font-medium">상태</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {MOCK_INQUIRIES.map((i) => (
                    <tr key={i.id} className="border-t border-gray-100">
                      <td className="px-5 py-3 font-medium text-gray-900">{i.name}</td>
                      <td className="px-5 py-3 text-gray-700">{i.region}</td>
                      <td className="px-5 py-3 text-gray-700">{i.capital}</td>
                      <td className="px-5 py-3 text-gray-700">{i.motive}</td>
                      <td className="px-5 py-3 text-gray-500">{i.createdAt}</td>
                      <td className="px-5 py-3">
                        <Badge variant={STATUS_VARIANT[i.status]}>{STATUS_LABEL[i.status]}</Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <a
                          href={`/hq/inquiries/${i.id}`}
                          className="text-xs font-medium text-gray-700 hover:text-gray-900"
                        >
                          상세 →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Ad campaign */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="inline-flex items-center gap-2 text-h4 font-semibold text-gray-900">
              <Users className="h-5 w-5 text-gray-600" />
              광고 운영 현황
            </h2>
            <a href="/for-brands/ads" className="text-sm text-gray-600 hover:text-gray-900">
              요금제 보기 →
            </a>
          </div>
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    현재 등급
                  </div>
                  <div className="mt-1.5 text-h4 font-bold text-gray-900">노출 강화</div>
                  <div className="mt-1 text-xs text-gray-500">
                    카테고리 상단 노출 + 광고 뱃지 · 월 30만원
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" /> 활성
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    다음 결제
                  </div>
                  <div className="mt-1.5 text-h4 font-bold text-gray-900">2026-06-01</div>
                  <div className="mt-1 text-xs text-gray-500">
                    당일 자동 결제 · 14일 전 이메일 안내
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    이번 달 노출
                  </div>
                  <div className="mt-1.5 text-h4 font-bold text-gray-900">
                    {formatNumber(MOCK_METRICS.views)}회
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    클릭률 {((MOCK_METRICS.clicks / MOCK_METRICS.views) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <a href="/hq/ads/upgrade">
                  <Button size="md">프리미엄으로 업그레이드</Button>
                </a>
                <a href="/hq/ads/history">
                  <Button size="md" variant="outline">
                    결제 / 노출 이력
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Notice */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-3 p-5">
            <Bell className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-sm">
              <div className="font-semibold text-amber-900">
                이 페이지는 아직 mock 데이터를 사용합니다
              </div>
              <p className="mt-1 text-amber-800">
                Supabase 연결과 실제 본사 등록 흐름이 완성되면 실시간 가맹 문의·노출·결제 데이터가 표시됩니다.
                현재는 디자인과 정보 구조 확인용입니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: typeof Eye
  label: string
  value: string
  delta: string
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <Icon className="h-4 w-4 text-gray-400" />
        <div className="mt-2 text-xs text-gray-500">{label}</div>
        <div className="mt-0.5 text-h4 font-bold text-gray-900">{value}</div>
        <div className="mt-1 text-xs font-medium text-emerald-600">{delta}</div>
      </CardContent>
    </Card>
  )
}
