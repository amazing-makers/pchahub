import { Header, Footer, MobileTabBar, AiChatWidget, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import { WriteFAB } from '@/components/write-fab'
import { BackToTop } from '@/components/back-to-top'
import './globals.css'

export const metadata = buildSiteMetadata('jangsanote')

const navItems = [
  { href: '/', label: '피드' },
  { href: '/intel', label: '상권 인텔' },
  { href: '/meetings', label: '모임' },
  { href: '/recipes', label: '레시피' },
  { href: '/festivals', label: '축제·박람회' },
  { href: '/support', label: '지원·이벤트' },
]

const actions: HeaderAction[] = [
  { href: '/write', label: '글쓰기', variant: 'primary' },
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
            platform="jangsanote"
            navItems={navItems}
            actions={actions}
            showRole={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-md">본문으로 이동</a>
          <div id="main-content" className="flex-1">{children}</div>
          <Footer platform="jangsanote" />
          <WriteFAB />
          <BackToTop />
          <MobileTabBar platform="jangsanote" />
          <AiChatWidget
            platform="jangsanote"
            platformName="장사노트"
            greeting="안녕하세요! 창업 커뮤니티, 상권 인텔리전스, 소상공인 정보를 도와드릴게요 😊"
            accentBg="bg-amber-500"
            accentHoverBg="hover:bg-amber-600"
          />
        </Providers>
      </body>
    </html>
  )
}
