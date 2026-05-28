import { Header, Footer, MobileTabBar, AiChatWidget, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import { BackToTop } from '@/components/back-to-top'
import './globals.css'

export const metadata = buildSiteMetadata('bestplace')

const navItems = [
  { href: '/awards', label: '어워드' },
  { href: '/monthly-best', label: '이달의 베스트' },
  { href: '/experiences', label: '체험단·기자단' },
  { href: '/stores', label: '매장 디렉토리' },
  { href: '/rankings', label: '랭킹' },
  { href: '/stories', label: '브랜드 스토리' },
]

const actions: HeaderAction[] = [
  { href: '/stores/new', label: '매장 등록', variant: 'primary' },
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
            platform="bestplace"
            navItems={navItems}
            actions={actions}
            showRole={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-md">본문으로 이동</a>
          <div id="main-content" className="flex-1">{children}</div>
          <Footer platform="bestplace" />
          <BackToTop />
          <MobileTabBar platform="bestplace" />
          <AiChatWidget
            platform="bestplace"
            platformName="베스트플레이스"
            greeting="안녕하세요! 매장 리뷰, 창업 후기, 좋은 점포 찾는 방법을 도와드릴게요 😊"
            accentBg="bg-rose-600"
            accentHoverBg="hover:bg-rose-700"
          />
        </Providers>
      </body>
    </html>
  )
}
