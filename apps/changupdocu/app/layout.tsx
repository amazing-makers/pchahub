import type { Metadata } from 'next'
import { Header, Footer } from '@amakers/ui'
import './globals.css'

export const metadata: Metadata = {
  title: '창업다큐 | 미디어',
  description: 'amakers - 한국 프랜차이즈 통합 플랫폼 (창업다큐, 미디어)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Header platform="changupdocu" />
        <div className="flex-1">{children}</div>
        <Footer platform="changupdocu" />
      </body>
    </html>
  )
}