import type { Metadata } from 'next'
import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata: Metadata = {
  title: '창업다큐 — 자영업·가맹의 진짜 이야기',
  description:
    '성공·실패·브랜드·트렌드. 한국 프랜차이즈 + 자영업 현장을 영상과 매거진으로 기록합니다.',
}

const navItems = [
  { href: '/episodes', label: '에피소드' },
  { href: '/categories/success', label: '성공' },
  { href: '/categories/failure', label: '실패' },
  { href: '/categories/brand', label: '브랜드' },
  { href: '/magazine', label: '매거진' },
]

const actions: HeaderAction[] = []

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header
            platform="changupdocu"
            navItems={navItems}
            actions={actions}
            showRole={false}
            showSiteSwitcher={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="changupdocu" />
        </Providers>
      </body>
    </html>
  )
}
