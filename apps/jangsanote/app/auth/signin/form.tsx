'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { AlertCircle } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

interface SigninFormProps {
  enabled: { kakao: boolean; naver: boolean; google: boolean; dev: boolean }
  callbackUrl: string
  error?: string
}

export function SigninForm({ enabled, callbackUrl, error }: SigninFormProps) {
  const [devEmail, setDevEmail] = useState('')
  const [devName, setDevName] = useState('')

  const submitDev = (e: React.FormEvent) => {
    e.preventDefault()
    if (!devEmail.trim()) return
    signIn('dev', { email: devEmail, name: devName, role: 'user', callbackUrl })
  }

  const hasRealOAuth = enabled.kakao || enabled.naver || enabled.google

  return (
    <Card className="w-full max-w-md border-gray-200 shadow-sm">
      <CardContent className="p-8">
        <div className="text-center">
          <h1 className="text-h3 font-bold text-gray-900">장사노트 로그인</h1>
          <p className="mt-1 text-sm text-gray-500">
            amakers 한 계정으로 9개 사이트를 함께 이용하세요.
          </p>
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              로그인 중 문제가 발생했습니다. <span className="font-mono text-xs">({error})</span>
            </span>
          </div>
        )}

        {hasRealOAuth && (
          <div className="mt-6 space-y-2">
            {enabled.kakao && (
              <button
                type="button"
                onClick={() => signIn('kakao', { callbackUrl })}
                className="flex w-full items-center justify-center rounded-lg bg-[#FEE500] px-4 py-3 text-sm font-semibold text-[#191919] hover:opacity-90"
              >
                카카오로 시작하기
              </button>
            )}
            {enabled.naver && (
              <button
                type="button"
                onClick={() => signIn('naver', { callbackUrl })}
                className="flex w-full items-center justify-center rounded-lg bg-[#03C75A] px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                네이버로 시작하기
              </button>
            )}
            {enabled.google && (
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl })}
                className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Google로 시작하기
              </button>
            )}
          </div>
        )}

        {!hasRealOAuth && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            OAuth 키가 아직 설정되지 않았습니다. 아래 개발용 로그인으로 흐름을 검증할 수 있습니다.
          </div>
        )}

        {enabled.dev && (
          <>
            <div className="mt-6 flex items-center gap-3 text-xs text-gray-500">
              <span className="h-px flex-1 bg-gray-200" />
              <span>개발용 로그인</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>
            <form onSubmit={submitDev} className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="text-xs font-medium text-gray-700">이메일</span>
                <input
                  type="email"
                  value={devEmail}
                  onChange={(e) => setDevEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  required
                />
              </label>
              <label className="block text-sm">
                <span className="text-xs font-medium text-gray-700">이름 (선택)</span>
                <input
                  type="text"
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  placeholder="홍길동"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
              </label>
              <Button type="submit" size="lg" className="w-full">
                개발용 로그인
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  )
}
