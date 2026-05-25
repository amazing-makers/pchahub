import { Header, Footer, MobileTabBar, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import { BackToTop } from '@/components/back-to-top'
import './globals.css'

export const metadata = buildSiteMetadata('themanual')

const navItems = [
  { href: '/courses', label: '강의' },
  { href: '/courses?free=1', label: '무료 강의' },
  { href: '/mentors', label: '멘토' },
  { href: '/recipes', label: '레시피' },
  { href: '/knowhow', label: '노하우' },
  { href: '/events', label: '이벤트' },
]

const actions: HeaderAction[] = [
  { href: '/mentors', label: '1:1 멘토 상담', variant: 'primary' },
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
      <body className="flex min-h-screen flex-col pb-16 md:pb-0">
        <Providers>
          <Header
            platform="themanual"
            navItems={navItems}
            actions={actions}
            showRole={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-md">본문으로 이동</a>
          <div id="main-content" className="flex-1">{children}</div>
          <Footer platform="themanual" />
          <BackToTop />
          <MobileTabBar platform="themanual" />
        </Providers>
      </body>
    </html>
  )
}
