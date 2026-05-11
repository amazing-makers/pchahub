import type { Metadata } from 'next'
import { Header, Footer } from '@amakers/ui'
import './globals.css'

export const metadata: Metadata = {
  title: '프차허브 — 한국 프랜차이즈 가맹 정보 플랫폼',
  description:
    '협회 등록 정보공개서를 한눈에. 내게 맞는 프랜차이즈를 찾고 본사와 바로 연결되는 가맹 정보 플랫폼.',
}

const navItems = [
  { href: '/brands', label: '브랜드 검색' },
  { href: '/themes', label: '테마별' },
  { href: '/scanner', label: '창업 스캐너' },
  { href: '/calculator', label: '수익 계산기' },
  { href: '/inquiry', label: '상담 신청' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Header
          platform="pchahub"
          navItems={navItems}
          showRole={false}
          showSiteSwitcher={false}
        />
        <div className="flex-1">{children}</div>
        <Footer platform="pchahub" />
      </body>
    </html>
  )
}
