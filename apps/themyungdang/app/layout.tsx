import type { Metadata } from 'next'
import { Header, Footer } from '@amakers/ui'
import './globals.css'

export const metadata: Metadata = {
  title: '더명당 | 부동산',
  description: 'amakers - 한국 프랜차이즈 통합 플랫폼 (더명당, 부동산)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Header platform="themyungdang" />
        <div className="flex-1">{children}</div>
        <Footer platform="themyungdang" />
      </body>
    </html>
  )
}