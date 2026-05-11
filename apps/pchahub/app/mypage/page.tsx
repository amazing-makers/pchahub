import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import {
  Bell,
  Building2,
  Calculator,
  Heart,
  MessageSquare,
  PencilLine,
  Settings,
  Sparkles,
  Star,
} from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { BRANDS } from '@/lib/mock-data'

export default async function MyPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage')

  const name = session.user?.name ?? session.user?.email?.split('@')[0] ?? '사용자'
  const role = (session.user as { role?: string } | null | undefined)?.role ?? 'user'
  const roleLabel =
    role === 'hq'
      ? '본사'
      : role === 'franchisee'
        ? '가맹점주'
        : role === 'contractor'
          ? '시공·협력사'
          : '예비 창업자'

  // Mock data for the dashboard sections
  const savedBrands = BRANDS.slice(0, 3)
  const inquiries = [
    {
      id: 'i1',
      brandId: 'b1',
      brandName: '치킨다이스',
      status: 'pending' as const,
      statusLabel: '본사 응답 대기',
      createdAt: '2026-05-09',
    },
    {
      id: 'i2',
      brandId: 'b2',
      brandName: '데일리브루',
      status: 'replied' as const,
      statusLabel: '본사 답변 완료',
      createdAt: '2026-05-05',
    },
  ]

  return (
    <main className="bg-gray-50">
      {/* Profile header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-start gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-h3 font-bold text-gray-900">{name}</h1>
                <Badge variant="primary">{roleLabel}</Badge>
              </div>
              <div className="mt-1 text-sm text-gray-500">{session.user?.email}</div>
            </div>
            <a
              href="/mypage/settings"
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Settings className="h-3.5 w-3.5" />
              설정
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatLink href="/mypage/saved" icon={Heart} label="찜한 브랜드" value={`${savedBrands.length}개`} />
          <StatLink href="/mypage/inquiries" icon={MessageSquare} label="상담 신청" value={`${inquiries.length}건`} />
          <StatLink href="/mypage/reviews" icon={Star} label="작성한 후기" value="3건" />
          <StatLink href="/calculator" icon={Calculator} label="저장한 계산" value="0건" />
          <StatLink href="/scanner" icon={Sparkles} label="스캐너 결과" value="1건" />
        </div>

        {/* Recent inquiries */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-h4 font-semibold text-gray-900">최근 상담 신청</h2>
            <a href="/mypage/inquiries" className="text-sm text-gray-600 hover:text-gray-900">
              전체 보기 →
            </a>
          </div>
          {inquiries.length === 0 ? (
            <EmptyState
              title="아직 상담 신청 내역이 없습니다"
              body="관심 브랜드 페이지에서 가맹 상담을 신청해보세요."
              cta={{ href: '/brands', label: '브랜드 둘러보기' }}
            />
          ) : (
            <div className="space-y-2">
              {inquiries.map((i) => (
                <Card key={i.id} className="border-gray-200">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <a
                        href={`/brands/${i.brandId}`}
                        className="text-sm font-semibold text-gray-900 hover:underline"
                      >
                        {i.brandName}
                      </a>
                      <div className="mt-0.5 text-xs text-gray-500">
                        신청일 {i.createdAt}
                      </div>
                    </div>
                    <Badge variant={i.status === 'replied' ? 'success' : 'warning'}>
                      {i.statusLabel}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Saved brands */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-h4 font-semibold text-gray-900">찜한 브랜드</h2>
            <a href="/mypage/saved" className="text-sm text-gray-600 hover:text-gray-900">
              전체 보기 →
            </a>
          </div>
          {savedBrands.length === 0 ? (
            <EmptyState
              title="찜한 브랜드가 없습니다"
              body="브랜드 페이지에서 하트 아이콘을 눌러 저장하세요."
              cta={{ href: '/brands', label: '브랜드 검색' }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {savedBrands.map((b) => (
                <a
                  key={b.id}
                  href={`/brands/${b.id}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md"
                >
                  <span
                    className="h-10 w-10 shrink-0 rounded-lg"
                    style={{ background: b.logoColor }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-gray-900">{b.name}</div>
                    <div className="text-xs text-gray-500">{b.categoryLabel}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* HQ shortcut */}
        {role === 'hq' && (
          <section className="mt-8">
            <Card className="border-gray-200 bg-gray-900 text-white">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
                  <div>
                    <div className="text-sm font-semibold">본사 회원 전용 대시보드</div>
                    <div className="mt-0.5 text-xs text-gray-300">
                      받은 가맹 문의, 브랜드 정보, 광고 캠페인 관리
                    </div>
                  </div>
                </div>
                <a href="/hq/dashboard">
                  <Button size="md">본사 대시보드 열기</Button>
                </a>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Reviews CTA */}
        <section className="mt-8">
          <Card className="border-gray-200 bg-amber-50">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="text-sm font-semibold text-amber-900">
                    가맹점주 후기 작성
                  </div>
                  <div className="mt-0.5 text-xs text-amber-800">
                    운영 중인 브랜드의 솔직한 경험을 공유하면 예비 점주의 의사결정에 큰 도움이 됩니다.
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="/mypage/reviews"
                  className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-white px-3 py-1.5 text-sm text-amber-900 hover:bg-amber-50"
                >
                  내 후기 보기
                </a>
                <a
                  href="/mypage/reviews/new"
                  className="inline-flex items-center gap-1 rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
                >
                  <PencilLine className="h-3.5 w-3.5" />
                  후기 작성
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-4 text-center text-xs text-gray-400">
          <Bell className="mr-1 inline-block h-3 w-3" />
          현재 모든 데이터는 mock입니다. Supabase 연결 + 인증 OAuth 후 실 데이터로 교체됩니다.
        </section>
      </div>
    </main>
  )
}

function StatLink({
  href,
  icon: Icon,
  label,
  value,
}: {
  href: string
  icon: typeof Heart
  label: string
  value: string
}) {
  return (
    <a href={href} className="group block">
      <Card className="h-full border-gray-200 transition-shadow group-hover:shadow-md">
        <CardContent className="p-4">
          <Icon className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gray-700" />
          <div className="mt-2 text-xs text-gray-500">{label}</div>
          <div className="mt-0.5 text-base font-semibold text-gray-900">{value}</div>
        </CardContent>
      </Card>
    </a>
  )
}

function EmptyState({
  title,
  body,
  cta,
}: {
  title: string
  body: string
  cta: { href: string; label: string }
}) {
  return (
    <Card className="border-gray-200 border-dashed">
      <CardContent className="p-10 text-center">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <p className="mt-1 text-xs text-gray-500">{body}</p>
        <a href={cta.href} className="mt-4 inline-block">
          <Button variant="outline" size="md">
            {cta.label}
          </Button>
        </a>
      </CardContent>
    </Card>
  )
}
