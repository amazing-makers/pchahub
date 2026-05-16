'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { ArrowRight, Mic, PenLine, Play } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

interface SignupFormProps {
  enabled: {
    kakao: boolean
    naver: boolean
    google: boolean
    dev: boolean
  }
}

type Role = 'viewer' | 'creator' | 'contributor'

const ROLES: Array<{ key: Role; label: string; helper: string; icon: typeof Play }> = [
  { key: 'viewer', label: '시청자·독자', helper: '다큐·매거진 구독', icon: Play },
  { key: 'creator', label: '창업가', helper: '현장 스토리 공유', icon: Mic },
  { key: 'contributor', label: '기고자·전문가', helper: '분석·인사이트 기고', icon: PenLine },
]

export function SignupForm({ enabled }: SignupFormProps) {
  const [role, setRole] = useState<Role>('viewer')
  const [step, setStep] = useState<'role' | 'auth'>('role')

  const hasRealOAuth = enabled.kakao || enabled.naver || enabled.google

  const proceedDev = () => {
    window.location.href = `/auth/signin?role=${role}`
  }

  if (step === 'role') {
    return (
      <Card className="w-full max-w-lg border-gray-200 shadow-sm">
        <CardContent className="p-8">
          <div className="text-center">
            <h1 className="text-h3 font-bold text-gray-900">창업다큐 가입</h1>
            <p className="mt-1 text-sm text-gray-500">
              어떤 역할로 서비스를 이용하시나요? 나중에 변경하실 수 있습니다.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            {ROLES.map((r) => {
              const Icon = r.icon
              const active = role === r.key
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  className={
                    'flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ' +
                    (active
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 bg-white hover:border-gray-400')
                  }
                  aria-pressed={active}
                >
                  <div
                    className={
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ' +
                      (active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700')
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{r.label}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{r.helper}</div>
                  </div>
                </button>
              )
            })}
          </div>

          <Button onClick={() => setStep('auth')} size="lg" className="mt-6 w-full gap-1">
            다음 <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="mt-4 text-center text-xs text-gray-500">
            이미 계정이 있으신가요?{' '}
            <a href="/auth/signin" className="font-semibold text-gray-900 hover:underline">
              로그인
            </a>
          </p>
        </CardContent>
      </Card>
    )
  }

  // step === 'auth'
  return (
    <Card className="w-full max-w-md border-gray-200 shadow-sm">
      <CardContent className="p-8">
        <button
          type="button"
          onClick={() => setStep('role')}
          className="mb-4 text-xs text-gray-500 hover:text-gray-900"
        >
          ← 역할 다시 선택
        </button>
        <div className="text-center">
          <h1 className="text-h3 font-bold text-gray-900">계정 만들기</h1>
          <p className="mt-1 text-sm text-gray-500">
            아래 방식 중 하나로 가입하시면 9개 사이트 모두 이용 가능합니다.
          </p>
          <div className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
            선택한 역할: {ROLES.find((r) => r.key === role)?.label}
          </div>
        </div>

        {hasRealOAuth && (
          <div className="mt-6 space-y-2">
            {enabled.kakao && (
              <button
                type="button"
                onClick={() => signIn('kakao', { callbackUrl: `/auth/welcome?role=${role}` })}
                className="flex w-full items-center justify-center rounded-lg bg-[#FEE500] px-4 py-3 text-sm font-semibold text-[#191919] hover:opacity-90"
              >
                카카오로 가입
              </button>
            )}
            {enabled.naver && (
              <button
                type="button"
                onClick={() => signIn('naver', { callbackUrl: `/auth/welcome?role=${role}` })}
                className="flex w-full items-center justify-center rounded-lg bg-[#03C75A] px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                네이버로 가입
              </button>
            )}
            {enabled.google && (
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: `/auth/welcome?role=${role}` })}
                className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Google로 가입
              </button>
            )}
          </div>
        )}

        {!hasRealOAuth && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            OAuth 키가 아직 설정되지 않았습니다. 개발용 로그인으로 흐름을 검증할 수 있습니다.
          </div>
        )}

        {enabled.dev && (
          <button
            type="button"
            onClick={proceedDev}
            className="mt-3 flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            개발용 로그인으로 진행
          </button>
        )}
      </CardContent>
    </Card>
  )
}
