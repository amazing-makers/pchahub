import type { Metadata } from 'next'
import { Header, Footer } from '@amakers/ui'
import './globals.css'

export const metadata: Metadata = {
  title: '장사노트 | 커뮤니티',
  description: 'amakers - 한국 프랜차이즈 통합 플랫폼 (장사노트, 커뮤니티)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Header platform="jangsanote" />
        <div className="flex-1">{children}</div>
        <Footer platform="jangsanote" />
      </body>
    </html>
  )
}