import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '더명당 | 부동산',
  description: 'amakers - 한국 프랜차이즈 통합 플랫폼 (더명당, 부동산)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}