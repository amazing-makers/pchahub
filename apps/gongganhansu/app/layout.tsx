import type { Metadata } from 'next'
import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata: Metadata = {
  title: '공간의한수 — 가맹점 인테리어 시공 매칭',
  description:
    '검증된 시공사 + 매장 갤러리 + 시공 단가 인사이트. amakers 인테리어 플랫폼.',
}

const navItems = [
  { href: '/gallery', label: '갤러리' },
  { href: '/contractors', label: '시공사' },
  { href: '/insights', label: '인사이트' },
  { href: '/quote', label: '견적 요청' },
]

const actions: HeaderAction[] = [
  { href: '/quote', label: '무료 견적', variant: 'primary' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header
            platform="gongganhansu"
            navItems={navItems}
            actions={actions}
            showRole={false}
            showSiteSwitcher={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="gongganhansu" />
        </Providers>
      </body>
    </html>
  )
}
