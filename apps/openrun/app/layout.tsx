import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '오픈런 | 마케팅',
  description: 'amakers - 한국 프랜차이즈 통합 플랫폼 (오픈런, 마케팅)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}