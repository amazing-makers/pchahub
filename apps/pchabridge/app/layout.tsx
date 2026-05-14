import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata = buildSiteMetadata('pchabridge')

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
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="pchabridge" />
        </Providers>
      </body>
    </html>
  )
}
