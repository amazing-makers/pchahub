import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata = buildSiteMetadata('pchahub')

const navItems = [
  { href: '/brands', label: '브랜드 검색' },
  { href: '/themes', label: '테마별' },
  { href: '/listings', label: '매물' },
  { href: '/community', label: '커뮤니티' },
  { href: '/scanner', label: '창업 스캐너' },
  { href: '/calculator', label: '수익 계산기' },
]

const actions: HeaderAction[] = [
  { href: '/for-brands', label: '본사 회원' },
  { href: '/inquiry', label: '상담 신청', variant: 'primary' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header
            platform="pchahub"
            navItems={navItems}
            actions={actions}
            showRole={false}
            showSiteSwitcher={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="pchahub" />
        </Providers>
      </body>
    </html>
  )
}
