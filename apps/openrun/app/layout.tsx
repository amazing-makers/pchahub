import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import { BackToTop } from '@/components/back-to-top'
import './globals.css'

export const metadata = buildSiteMetadata('openrun')

const navItems = [
  { href: '/services', label: '서비스' },
  { href: '/portfolio', label: '사례' },
  { href: '/contact', label: '문의' },
  { href: '/search', label: '검색' },
]

const actions: HeaderAction[] = [
  { href: '/contact', label: '캠페인 의뢰', variant: 'primary' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header
            platform="openrun"
            navItems={navItems}
            actions={actions}
            showRole={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-md">본문으로 이동</a>
          <div id="main-content" className="flex-1">{children}</div>
          <Footer platform="openrun" />
          <BackToTop />
        </Providers>
      </body>
    </html>
  )
}
