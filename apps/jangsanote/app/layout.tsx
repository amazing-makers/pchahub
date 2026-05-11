import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata = buildSiteMetadata('jangsanote')

const navItems = [
  { href: '/', label: '피드' },
  { href: '/categories/cafe', label: '업종방' },
  { href: '/regions/seoul', label: '지역방' },
  { href: '/meetings', label: '모임' },
  { href: '/general', label: '자유' },
]

const actions: HeaderAction[] = [
  { href: '/write', label: '글쓰기', variant: 'primary' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header
            platform="jangsanote"
            navItems={navItems}
            actions={actions}
            showRole={false}
            showSiteSwitcher={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="jangsanote" />
        </Providers>
      </body>
    </html>
  )
}
