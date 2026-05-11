import type { Metadata } from 'next'
import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata: Metadata = {
  title: '더메뉴얼 — 가맹점 운영 교육 플랫폼',
  description:
    '협회 정보공개서 해석부터 매장 운영·회계·법률·마케팅까지. 실제 점주와 전문가가 가르치는 가맹 사업 교육.',
}

const navItems = [
  { href: '/courses', label: '강의' },
  { href: '/courses?free=1', label: '무료 강의' },
  { href: '/mentors', label: '멘토' },
]

const actions: HeaderAction[] = [
  { href: '/mentors', label: '1:1 멘토 상담', variant: 'primary' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header
            platform="themanual"
            navItems={navItems}
            actions={actions}
            showRole={false}
            showSiteSwitcher={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="themanual" />
        </Providers>
      </body>
    </html>
  )
}
