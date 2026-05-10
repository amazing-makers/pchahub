import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '프차허브 | 정보검색+가맹중개',
  description: 'amakers - 한국 프랜차이즈 통합 플랫폼 (프차허브, 정보검색+가맹중개)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}