import { Footer, MobileTabBar, type HeaderAction, type HeaderNavItem } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import { ActiveHeader } from '@/components/active-header'
import { ToastContainer } from '@/components/toast-container'
import { BackToTop } from '@/components/back-to-top'
import './globals.css'

export const metadata = buildSiteMetadata('themyungdang')

const navItems: HeaderNavItem[] = [
  { href: '/listings/map', label: '지도로 검색' },
  { href: '/listings', label: '매물 목록' },
  { href: '/areas', label: '상권 분석' },
  { href: '/safe-deal', label: '안전 거래' },
  { href: '/price-guide', label: '시세 가이드' },
]

const actions: HeaderAction[] = [
  { href: '/post', label: '매물 등록', variant: 'primary' },
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
          {/* Accessibility: skip to main content */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-xl focus:bg-gray-900 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
          >
            본문으로 이동
          </a>
          <ActiveHeader
            navItems={navItems}
            actions={actions}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div id="main-content" className="flex-1">{children}</div>
          <Footer platform="themyungdang" />
          <ToastContainer />
          <BackToTop />
          <MobileTabBar platform="themyungdang" />
        </Providers>
      </body>
    </html>
  )
}
