import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  ChevronRight,
  LayoutDashboard,
  MessageSquare,
  PencilLine,
  Tv2,
} from 'lucide-react'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const NAV = [
  {
    label: '대시보드',
    href: '/hq/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: '가맹 문의',
    href: '/hq/inquiries',
    icon: MessageSquare,
  },
  {
    label: '브랜드 정보 수정',
    href: '/hq/brand/edit',
    icon: PencilLine,
  },
  {
    label: '광고 관리',
    href: '/for-brands/ads',
    icon: Tv2,
  },
  {
    label: '통계',
    href: '/hq/stats',
    icon: BarChart3,
  },
]

export default async function HqLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/hq/dashboard')

  const role = (session.user as { role?: string } | undefined)?.role
  if (role !== 'hq') redirect('/mypage')

  const userName = session.user?.name ?? session.user?.email?.split('@')[0] ?? '본사'

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-primary)]">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">본사 관리</div>
            <div className="text-xs text-gray-500">pchahub · HQ</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {NAV.map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <Icon className="h-4 w-4 shrink-0 text-gray-400" />
              {label}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-xs font-bold text-[var(--brand-primary)]">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="truncate font-medium text-gray-900">{userName}</div>
              <div className="text-gray-400">본사 계정</div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <a
              href="/"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700"
            >
              <ChevronRight className="h-3 w-3" />
              사이트 홈으로
            </a>
            <a
              href="/for-brands"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700"
            >
              <ArrowUpRight className="h-3 w-3" />
              브랜드 입점 안내
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 right-0 left-0 z-40 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ background: 'var(--brand-primary)' }}
        >
          <Building2 className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-bold text-gray-900">본사 관리</span>
        <div className="ml-auto flex items-center gap-1">
          {NAV.map(({ href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="min-w-0 flex-1 pt-14 lg:pt-0">{children}</main>
    </div>
  )
}
