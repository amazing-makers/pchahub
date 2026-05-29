import { Header, Footer, MobileTabBar, AiChatWidget, AiChatTriggerLink, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import { BackToTop } from '@/components/back-to-top'
import './globals.css'

export const metadata = buildSiteMetadata('changupdocu')

const navItems = [
  { href: '/episodes', label: '에피소드' },
  { href: '/series', label: '시리즈' },
  { href: '/categories/success', label: '성공' },
  { href: '/categories/failure', label: '실패' },
  { href: '/categories/brand', label: '브랜드' },
  { href: '/magazine', label: '매거진' },
  { href: '/timeline', label: '창업 타임라인' },
]

const actions: HeaderAction[] = [
  { href: '/submit-story', label: '제보하기', variant: 'primary' },
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
            platform="changupdocu"
            navItems={navItems}
            actions={actions}
            showRole={false}
            rightSlot={
              <div className="flex items-center gap-3">
                <AiChatTriggerLink />
                <HeaderUserMenu actions={actions} />
              </div>
            }
          />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-md">본문으로 이동</a>
          <div id="main-content" className="flex-1">{children}</div>
          <Footer platform="changupdocu" />
          <BackToTop />
          <MobileTabBar platform="changupdocu" />
          <AiChatWidget
            platform="changupdocu"
            platformName="창업도큐"
            greeting="안녕하세요! 창업자 성공·실패 스토리, 브랜드 다큐 관련 콘텐츠를 안내해 드릴게요 😊"
            accentBg="bg-purple-600"
            accentHoverBg="hover:bg-purple-700"
          />
        </Providers>
      </body>
    </html>
  )
}
