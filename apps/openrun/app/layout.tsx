import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata = buildSiteMetadata('openrun')

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
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="openrun" />
        </Providers>
      </body>
    </html>
  )
}
