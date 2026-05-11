import type { Metadata } from 'next'
import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata: Metadata = {
  title: '오픈런 — 프랜차이즈 본사·매장 마케팅 에이전시',
  description:
    '그랜드 오픈 + 가맹 모집 + 본사 브랜드 마케팅을 통합 운영하는 amakers 마케팅 파트너.',
}

const navItems = [
  { href: '/services', label: '서비스' },
  { href: '/portfolio', label: '사례' },
  { href: '/contact', label: '문의' },
]

const actions: HeaderAction[] = [
  { href: '/contact', label: '캠페인 의뢰', variant: 'primary' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header
            platform="openrun"
            navItems={navItems}
            actions={actions}
            showRole={false}
            showSiteSwitcher={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="openrun" />
        </Providers>
      </body>
    </html>
  )
}
