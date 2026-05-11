import type { Metadata } from 'next'
import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata: Metadata = {
  title: '더명당 — 프랜차이즈 입점 매물 + 안전 거래',
  description:
    '프랜차이즈 양도·신규 임대·매각 매물을 검증된 정보와 함께. amakers 부동산 플랫폼.',
}

const navItems = [
  { href: '/listings', label: '매물 검색' },
  { href: '/listings?type=transfer', label: '양도' },
  { href: '/listings?type=new', label: '신규 임대' },
  { href: '/listings?type=sale', label: '매각' },
  { href: '/areas', label: '상권 분석' },
]

const actions: HeaderAction[] = [
  { href: '/post', label: '매물 등록', variant: 'primary' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header
            platform="themyungdang"
            navItems={navItems}
            actions={actions}
            showRole={false}
            showSiteSwitcher={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="themyungdang" />
        </Providers>
      </body>
    </html>
  )
}
