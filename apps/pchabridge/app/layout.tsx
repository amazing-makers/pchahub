import type { Metadata } from 'next'
import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata: Metadata = {
  title: '프차브릿지 — 프랜차이즈 투자 + M&A',
  description:
    '본사 Seed·Series·다점포 펀딩·M&A. amakers 프랜차이즈 자본 거래 플랫폼.',
}

const navItems = [
  { href: '/investments', label: '투자 라운드' },
  { href: '/ma', label: 'M&A 매물' },
  { href: '/funding', label: '다점포 펀딩' },
]

const actions: HeaderAction[] = [
  { href: '/investments/register', label: '본사 등록', variant: 'primary' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header
            platform="pchabridge"
            navItems={navItems}
            actions={actions}
            showRole={false}
            showSiteSwitcher={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="pchabridge" />
        </Providers>
      </body>
    </html>
  )
}
