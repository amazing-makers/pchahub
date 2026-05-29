import { Header, Footer, MobileTabBar, AiChatWidget, AiChatTriggerLink, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import { BackToTop } from '@/components/back-to-top'
import './globals.css'

export const metadata = buildSiteMetadata('pchabridge')

const navItems = [
  { href: '/investments', label: '투자 라운드' },
  { href: '/portfolio', label: '포트폴리오' },
  { href: '/ma', label: 'M&A 매물' },
  { href: '/funding', label: '다점포 펀딩' },
  { href: '/dealflow', label: '딜플로우' },
  { href: '/simulator', label: '수익 계산기' },
  { href: '/guide', label: '투자자 가이드' },
]

const actions: HeaderAction[] = [
  { href: '/investments/register', label: '본사 등록', variant: 'primary' },
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
            platform="pchabridge"
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
          <Footer platform="pchabridge" />
          <BackToTop />
          <MobileTabBar platform="pchabridge" />
          <AiChatWidget
            platform="pchabridge"
            platformName="피차브릿지"
            greeting="안녕하세요! 프랜차이즈 투자 라운드, 투자 검토 기준, M&A 관련 질문을 도와드릴게요 😊"
            accentBg="bg-violet-700"
            accentHoverBg="hover:bg-violet-800"
          />
        </Providers>
      </body>
    </html>
  )
}
