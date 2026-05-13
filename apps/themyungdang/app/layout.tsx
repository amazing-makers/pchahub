import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata = buildSiteMetadata('themyungdang')

const navItems = [
  { href: '/listings/map', label: '지도로 검색' },
  { href: '/listings', label: '매물 목록' },
  { href: '/areas', label: '상권 분석' },
  { href: '/safe-deal', label: '안전 거래' },
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
