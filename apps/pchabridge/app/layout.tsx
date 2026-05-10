import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '프차브릿지 | 투자/M&A',
  description: 'amakers - 한국 프랜차이즈 통합 플랫폼 (프차브릿지, 투자/M&A)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}