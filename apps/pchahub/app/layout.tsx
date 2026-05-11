import type { Metadata } from 'next'
import { Header, Footer } from '@amakers/ui'
import './globals.css'

export const metadata: Metadata = {
  title: '프차허브 | 정보검색 + 가맹중개',
  description: 'amakers - 한국 프랜차이즈 통합 플랫폼 (프차허브, 정보검색+가맹중개)',
}

const navItems = [
  { href: '/brands', label: '프랜차이즈 검색' },
  { href: '/categories', label: '업종별' },
  { href: '/about', label: 'amakers 소개' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Header platform="pchahub" navItems={navItems} showSearch />
        <div className="flex-1">{children}</div>
        <Footer platform="pchahub" />
      </body>
    </html>
  )
}
