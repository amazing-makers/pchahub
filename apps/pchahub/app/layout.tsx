import { Header, Footer, MobileTabBar, AiChatWidget, AiChatTriggerLink, type HeaderAction } from '@amakers/ui'
import { buildSiteMetadata } from '@amakers/design-system'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import { BackToTop } from '@/components/back-to-top'
import { CompareBar } from '@/components/compare-bar'
import './globals.css'

export const metadata = buildSiteMetadata('pchahub')

const navItems = [
  { href: '/brands', label: '브랜드 탐색' },   // 지역별 탐색·시장 트렌드 흡수
  { href: '/listings', label: '매물' },
  { href: '/guide', label: '창업 가이드' },
  { href: '/scanner', label: '창업 도구' },    // 수익 계산기 흡수
  { href: '/community', label: '커뮤니티' },   // 가맹 Q&A 흡수
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
            rightSlot={
              <div className="flex items-center gap-3">
                <AiChatTriggerLink />
                <HeaderUserMenu actions={actions} />
              </div>
            }
          />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-md">본문으로 이동</a>
          <div id="main-content" className="flex-1">{children}</div>
          <Footer platform="pchahub" staffLoginHref="/auth/staff" />
          <BackToTop />
          <CompareBar />
          <MobileTabBar platform="pchahub" />
          <AiChatWidget
            platform="pchahub"
            platformName="프차허브"
            greeting="안녕하세요! 프랜차이즈 창업 궁금한 점을 물어보세요. 브랜드 추천, 비용 계산, 계약 체크까지 도와드릴게요 😊"
            accentBg="bg-indigo-600"
            accentHoverBg="hover:bg-indigo-700"
            helpanyCompanyId="cmokx2zoe000o135jibr31y5p"
          />
        </Providers>
      </body>
    </html>
  )
}
