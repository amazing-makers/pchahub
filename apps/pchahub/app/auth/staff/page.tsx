import type { Metadata } from 'next'
import { enabledProviders } from '@amakers/auth'
import { StaffSigninForm } from './form'

export const metadata: Metadata = {
  title: '스태프 로그인',
  robots: { index: false, follow: false },
}

export default function StaffSigninPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-16">
      <StaffSigninForm enabled={enabledProviders} />
    </div>
  )
}
