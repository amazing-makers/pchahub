import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata = buildSiteMetadata('changupdocu')

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
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="changupdocu" />
        </Providers>
      </body>
    </html>
  )
}
