import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import { BackToTop } from '@/components/back-to-top'
import { CompareBar } from '@/components/compare-bar'
import './globals.css'

export const metadata = buildSiteMetadata('pchahub')

const navItems = [
  { href: '/brands', label: '브랜드 검색' },
  { href: '/themes', label: '테마별' },
  { href: '/listings', label: '매물' },
  { href: '/community', label: '커뮤니티' },
  { href: '/scanner', label: '창업 스캐너' },
  { href: '/calculator', label: '수익 계산기' },
]

const actions: HeaderAction[] = [
  { href: '/for-brands', label: '본사 회원' },
  { href: '/inquiry', label: '상담 신청', variant: 'primary' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
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
          <Footer platform="pchahub" />
          <BackToTop />
          <CompareBar />
        </Providers>
      </body>
    </html>
  )
}
