import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata = buildSiteMetadata('bestplace')

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
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="bestplace" />
        </Providers>
      </body>
    </html>
  )
}
