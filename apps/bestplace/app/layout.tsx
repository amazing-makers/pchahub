import type { Metadata } from 'next'
import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata: Metadata = {
  title: '베스트플레이스 — 매장 디렉토리 + 베스트 어워드',
  description:
    '전국 프랜차이즈 매장과 매년 베스트 브랜드 시상을 한곳에서. amakers 매장 디렉토리.',
}

const navItems = [
  { href: '/awards', label: '어워드' },
  { href: '/stores', label: '매장 디렉토리' },
  { href: '/rankings', label: '실시간 랭킹' },
]

const actions: HeaderAction[] = []

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header
            platform="bestplace"
            navItems={navItems}
            actions={actions}
            showRole={false}
            showSiteSwitcher={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="bestplace" />
        </Providers>
      </body>
    </html>
  )
}
