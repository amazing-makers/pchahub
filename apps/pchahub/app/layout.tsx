import { Header, Footer, MobileTabBar, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import { BackToTop } from '@/components/back-to-top'
import { CompareBar } from '@/components/compare-bar'
import './globals.css'

export const metadata = buildSiteMetadata('pchahub')

const navItems = [
  { href: '/brands', label: '브랜드 검색' },
  { href: '/listings', label: '매물' },
  { href: '/guide', label: '창업 가이드' },
  { href: '/regions', label: '지역별 탐색' },
  { href: '/scanner', label: '창업 스캐너' },
  { href: '/calculator', label: '수익 계산기' },
  { href: '/community', label: '커뮤니티' },
]

const actions: HeaderAction[] = [
  { href: '/for-brands', label: '본사 회원' },
  { href: '/inquiry', label: '상담 신청', variant: 'primary' },
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
            platform="pchahub"
            navItems={navItems}
            actions={actions}
            showRole={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-md">본문으로 이동</a>
          <div id="main-content" className="flex-1">{children}</div>
          <Footer platform="pchahub" staffLoginHref="/auth/staff" />
          <BackToTop />
          <CompareBar />
          <MobileTabBar platform="pchahub" />
        </Providers>
      </body>
    </html>
  )
}
