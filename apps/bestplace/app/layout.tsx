import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '베스트플레이스 | 베스트/시상',
  description: 'amakers - 한국 프랜차이즈 통합 플랫폼 (베스트플레이스, 베스트/시상)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}