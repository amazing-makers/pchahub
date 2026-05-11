import type { Metadata } from 'next'
import { Header, Footer, type HeaderAction } from '@amakers/ui'
import { Providers } from './providers'
import { HeaderUserMenu } from '@/components/header-user-menu'
import './globals.css'

export const metadata: Metadata = {
  title: '장사노트 — 자영업·가맹점주 커뮤니티',
  description:
    '본사와의 갈등, 매출 부진, 매물 시세, 인력 운영 — 현직 점주들과 함께 푸는 곳.',
}

const navItems = [
  { href: '/', label: '피드' },
  { href: '/categories/cafe', label: '업종방' },
  { href: '/regions/seoul', label: '지역방' },
  { href: '/meetings', label: '모임' },
  { href: '/general', label: '자유' },
]

const actions: HeaderAction[] = [
  { href: '/write', label: '글쓰기', variant: 'primary' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header
            platform="jangsanote"
            navItems={navItems}
            actions={actions}
            showRole={false}
            showSiteSwitcher={false}
            rightSlot={<HeaderUserMenu actions={actions} />}
          />
          <div className="flex-1">{children}</div>
          <Footer platform="jangsanote" />
        </Providers>
      </body>
    </html>
  )
}
