import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  Bell,
  Building2,
  PencilLine,
  Settings,
  Star,
} from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { BRANDS } from '@/lib/mock-data'
import { StatsClient } from './stats-client'
import { RecentBrands } from './recent-brands'
import { SavedCalcs } from './saved-calcs'

const InquiriesSection = dynamic(
  () => import('./inquiries-section').then((m) => m.InquiriesSection),
  { ssr: false },
)

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
        {/* Quick stats (localStorage 기반 실제 수치) */}
        <StatsClient />

        {/* Recent inquiries */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-h4 font-semibold text-gray-900">최근 상담 신청</h2>
            <a href="/mypage/inquiries" className="text-sm text-gray-600 hover:text-gray-900">
              전체 보기 →
            </a>
          </div>
          <InquiriesSection />
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

        {/* 최근 본 브랜드 (localStorage) */}
        <RecentBrands />

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

        {/* Saved calculator results (localStorage, client-only) */}
        <SavedCalcs />

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
