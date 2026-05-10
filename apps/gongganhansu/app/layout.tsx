import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '공간의한수 | 인테리어',
  description: 'amakers - 한국 프랜차이즈 통합 플랫폼 (공간의한수, 인테리어)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}