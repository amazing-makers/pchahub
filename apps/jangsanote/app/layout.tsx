import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata = buildSiteMetadata('jangsanote')

const navItems = [
  { href: '/', label: '피드' },
  { href: '/categories', label: '업종방' },
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
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-md">본문으로 이동</a>
          <div id="main-content" className="flex-1">{children}</div>
          <Footer platform="jangsanote" />
        </Providers>
      </body>
    </html>
  )
}
