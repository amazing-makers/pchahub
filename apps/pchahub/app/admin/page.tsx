import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'

// Mock 데이터 — Supabase 연결 후 실제 쿼리로 대체
const STATS = {
  totalUsers: 2_847,
  newUsersThisWeek: 134,
  hqAccounts: 42,
  pendingHqVerification: 5,
  totalBrands: 312,
  pendingBrandApproval: 8,
  totalListings: 1_204,
  pendingListingApproval: 13,
  totalInquiries: 8_421,
  inquiriesThisMonth: 638,
}

const RECENT_SIGNUPS = [
  { id: 'u001', name: '김지수', email: 'jisu@example.com', role: 'user', createdAt: '10분 전' },
  { id: 'u002', name: '이준혁', email: 'junho@example.com', role: 'hq', createdAt: '23분 전' },
  { id: 'u003', name: '박서연', email: 'seo@example.com', role: 'user', createdAt: '1시간 전' },
  { id: 'u004', name: '최민준', email: 'minjun@example.com', role: 'franchisee', createdAt: '2시간 전' },
  { id: 'u005', name: '정다은', email: 'daeeun@example.com', role: 'user', createdAt: '3시간 전' },
]

const PENDING_BRANDS = [
  { id: 'b001', name: '카페봄봄', category: '카페·디저트', submittedAt: '2026-05-17', contact: 'cafe@bom.kr' },
  { id: 'b002', name: '삼촌치킨', category: '치킨', submittedAt: '2026-05-16', contact: 'info@samchon.co.kr' },
  { id: 'b003', name: '피자베이스', category: '피자', submittedAt: '2026-05-15', contact: 'hello@pizzabase.kr' },
]

const ALERTS = [
  { type: 'warn' as const, message: '브랜드 승인 대기 8건이 72시간 초과되었습니다.' },
  { type: 'warn' as const, message: '매물 승인 대기 13건이 있습니다.' },
  { type: 'info' as const, message: '이번 주 신규 HQ 계정 가입 2건 — 사업자 확인이 필요합니다.' },
]

const ROLE_LABEL: Record<string, string> = {
  user: '일반',
  hq: '본사',
  franchisee: '가맹점',
  admin: '관리자',
}

const ROLE_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
  user: 'default',
  hq: 'success',
  franchisee: 'warning',
  admin: 'error',
}

export const metadata = {
  title: '관리자 대시보드 | pchahub',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-gray-500" />
            <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            amakers 플랫폼 전체 현황 · 마지막 업데이트 방금
          </p>
        </div>
      </div>

      {/* Alerts */}
      {ALERTS.length > 0 && (
        <div className="space-y-2">
          {ALERTS.map((alert, i) => (
            <div
              key={i}
              className={
                'flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ' +
                (alert.type === 'warn'
                  ? 'border-amber-200 bg-amber-50 text-amber-900'
                  : 'border-blue-200 bg-blue-50 text-blue-900')
              }
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          icon={Users}
          label="전체 회원"
          value={formatNumber(STATS.totalUsers)}
          sub={`이번 주 +${STATS.newUsersThisWeek}`}
          href="/admin/users"
        />
        <KpiCard
          icon={Building2}
          label="등록 브랜드"
          value={formatNumber(STATS.totalBrands)}
          sub={`승인 대기 ${STATS.pendingBrandApproval}건`}
          badge={STATS.pendingBrandApproval > 0 ? String(STATS.pendingBrandApproval) : undefined}
          href="/admin/brands"
        />
        <KpiCard
          icon={FileText}
          label="전체 매물"
          value={formatNumber(STATS.totalListings)}
          sub={`승인 대기 ${STATS.pendingListingApproval}건`}
          badge={STATS.pendingListingApproval > 0 ? String(STATS.pendingListingApproval) : undefined}
          href="/admin/listings"
        />
        <KpiCard
          icon={MessageSquare}
          label="가맹 문의"
          value={formatNumber(STATS.inquiriesThisMonth)}
          sub="이번 달"
          href="/admin/stats"
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          icon={Activity}
          label="HQ 계정"
          value={formatNumber(STATS.hqAccounts)}
          sub={`사업자 미확인 ${STATS.pendingHqVerification}건`}
          badge={STATS.pendingHqVerification > 0 ? String(STATS.pendingHqVerification) : undefined}
          href="/admin/users"
        />
        <KpiCard
          icon={TrendingUp}
          label="브랜드 조회 (월)"
          value="48.2만"
          sub="+18% vs 지난달"
          href="/admin/stats"
        />
        <KpiCard
          icon={CheckCircle2}
          label="승인 처리율"
          value="92%"
          sub="최근 30일"
          href="/admin/stats"
        />
        <KpiCard
          icon={Clock}
          label="평균 승인 시간"
          value="18h"
          sub="목표: 24h 이내"
          href="/admin/stats"
        />
      </div>

      {/* Bottom grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent signups */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <Users className="h-4 w-4 text-gray-500" />
              최근 가입
            </h2>
            <a
              href="/admin/users"
              className="flex items-center gap-0.5 text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              전체 보기 <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <Card className="border-gray-200">
            <div className="divide-y divide-gray-50">
              {RECENT_SIGNUPS.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                    {u.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-900">{u.name}</span>
                      <Badge variant={ROLE_VARIANT[u.role] ?? 'default'} className="text-[10px]">
                        {ROLE_LABEL[u.role] ?? u.role}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                  </div>
                  <div className="text-xs text-gray-400">{u.createdAt}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Pending brand approvals */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <Building2 className="h-4 w-4 text-gray-500" />
              브랜드 승인 대기
            </h2>
            <a
              href="/admin/brands"
              className="flex items-center gap-0.5 text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              전체 보기 <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <Card className="border-gray-200">
            {PENDING_BRANDS.length === 0 ? (
              <CardContent className="py-8 text-center text-sm text-gray-400">
                승인 대기 브랜드 없음
              </CardContent>
            ) : (
              <div className="divide-y divide-gray-50">
                {PENDING_BRANDS.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                      {b.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900">{b.name}</div>
                      <div className="text-xs text-gray-400">
                        {b.category} · {b.contact}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="text-xs text-gray-400">{b.submittedAt}</span>
                      <a
                        href="/admin/brands"
                        className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        검토
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>

      {/* Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 p-4">
          <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-800">
            현재 통계는 mock 데이터입니다. Supabase 연결 후 실제 집계 데이터가 표시됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  badge,
  href,
}: {
  icon: typeof Users
  label: string
  value: string
  sub: string
  badge?: string
  href: string
}) {
  return (
    <a href={href} className="block">
      <Card className="border-gray-200 transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <Icon className="h-4 w-4 text-gray-400" />
            {badge && (
              <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">
                {badge}
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">{label}</div>
          <div className="mt-0.5 text-xl font-bold text-gray-900">{value}</div>
          <div className="mt-1 text-xs text-gray-400">{sub}</div>
        </CardContent>
      </Card>
    </a>
  )
}
