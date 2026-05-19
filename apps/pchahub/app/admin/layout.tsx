import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import {
  BarChart3,
  Blocks,
  Building2,
  ChevronRight,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const NAV = [
  {
    label: '대시보드',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: '사용자 관리',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: '브랜드 승인',
    href: '/admin/brands',
    icon: Building2,
  },
  {
    label: '매물 승인',
    href: '/admin/listings',
    icon: Blocks,
  },
  {
    label: '통계',
    href: '/admin/stats',
    icon: BarChart3,
  },
  {
    label: '시스템 설정',
    href: '/admin/settings',
    icon: Settings,
  },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/admin')

  const role = (session.user as { role?: string } | undefined)?.role
  if (role !== 'admin') redirect('/mypage')

  const userName = session.user?.name ?? session.user?.email?.split('@')[0] ?? '관리자'

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">관리자 콘솔</div>
            <div className="text-xs text-gray-500">amakers platform</div>
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
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="truncate font-medium text-gray-900">{userName}</div>
              <div className="text-gray-400">관리자</div>
            </div>
          </div>
          <a
            href="/"
            className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700"
          >
            <ChevronRight className="h-3 w-3" />
            사이트 홈으로
          </a>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 right-0 left-0 z-40 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900">
          <ShieldCheck className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-bold text-gray-900">관리자 콘솔</span>
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
