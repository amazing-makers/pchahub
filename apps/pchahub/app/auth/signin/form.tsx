'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { AlertCircle } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

interface SigninFormProps {
  enabled: {
    kakao: boolean
    naver: boolean
    google: boolean
    dev: boolean
  }
  callbackUrl: string
  error?: string
}

export function SigninForm({ enabled, callbackUrl, error }: SigninFormProps) {
  const [devEmail, setDevEmail] = useState('')
  const [devName, setDevName] = useState('')
  const [devRole, setDevRole] = useState<'user' | 'hq' | 'franchisee'>('user')

  const submitDev = (e: React.FormEvent) => {
    e.preventDefault()
    if (!devEmail.trim()) return
    signIn('dev', { email: devEmail, name: devName, role: devRole, callbackUrl })
  }

  const hasRealOAuth = enabled.kakao || enabled.naver || enabled.google

  return (
    <Card className="w-full max-w-md border-gray-200 shadow-sm">
      <CardContent className="p-8">
        <div className="text-center">
          <h1 className="text-h3 font-bold text-gray-900">로그인</h1>
          <p className="mt-1 text-sm text-gray-500">
            프차허브 외 8개 사이트를 한 계정으로 이용하세요.
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
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4 py-3 text-sm font-semibold text-[#191919] transition-opacity hover:opacity-90"
              >
                카카오로 시작하기
              </button>
            )}
            {enabled.naver && (
              <button
                type="button"
                onClick={() => signIn('naver', { callbackUrl })}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#03C75A] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                네이버로 시작하기
              </button>
            )}
            {enabled.google && (
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl })}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Google로 시작하기
              </button>
            )}
          </div>
        )}

        {!hasRealOAuth && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            OAuth 키가 아직 설정되지 않았습니다 (.env에 KAKAO/NAVER/GOOGLE_CLIENT_ID).
            아래 개발용 로그인으로 흐름을 검증할 수 있습니다.
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
              <Field label="이메일">
                <input
                  type="email"
                  value={devEmail}
                  onChange={(e) => setDevEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  required
                />
              </Field>
              <Field label="이름 (선택)">
                <input
                  type="text"
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
              </Field>
              <Field label="역할">
                <div className="grid grid-cols-3 gap-2">
                  {(['user', 'franchisee', 'hq'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setDevRole(r)}
                      className={
                        'rounded-lg border-2 px-2 py-1.5 text-xs font-medium transition-colors ' +
                        (devRole === r
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300')
                      }
                    >
                      {r === 'user' ? '일반' : r === 'franchisee' ? '점주' : '본사'}
                    </button>
                  ))}
                </div>
              </Field>
              <Button type="submit" size="lg" className="w-full">
                개발용 로그인
              </Button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-xs text-gray-500">
          처음이신가요?{' '}
          <a href="/auth/signup" className="font-semibold text-gray-900 hover:underline">
            회원가입
          </a>
        </p>
      </CardContent>
    </Card>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
