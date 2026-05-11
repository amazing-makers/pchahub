import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata = buildSiteMetadata('themanual')

const navItems = [
  { href: '/courses', label: '강의' },
  { href: '/courses?free=1', label: '무료 강의' },
  { href: '/mentors', label: '멘토' },
]

const actions: HeaderAction[] = [
  { href: '/mentors', label: '1:1 멘토 상담', variant: 'primary' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header
            platform="themanual"
            navItems={navItems}
            actions={actions}
            showRole={false}
            showSiteSwitcher={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="themanual" />
        </Providers>
      </body>
    </html>
  )
}
