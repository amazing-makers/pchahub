import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { MessageSquare, ShieldCheck, ChevronRight } from 'lucide-react'

export const metadata: Metadata = { robots: { index: false, follow: false } }

const NAV = [
  { label: '문의 관리', href: '/admin/inquiries', icon: MessageSquare },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/admin')
  const role = (session.user as { role?: string } | undefined)?.role
  if (role !== 'admin') redirect('/')

  const userName = session.user?.name ?? session.user?.email?.split('@')[0] ?? '관리자'

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">관리자</div>
            <div className="text-xs text-gray-500">창업도큐</div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {NAV.map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Icon className="h-4 w-4 text-gray-400" />
              {label}
            </a>
          ))}
        </nav>
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="truncate font-medium text-gray-900">{userName}</span>
          </div>
          <a href="/" className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700">
            <ChevronRight className="h-3 w-3" /> 사이트 홈으로
          </a>
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
