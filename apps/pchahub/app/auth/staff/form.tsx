'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { AlertCircle, ShieldCheck } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

interface StaffSigninFormProps {
  enabled: { kakao: boolean; naver: boolean; google: boolean; dev: boolean }
}

const STAFF_ROLES = [
  {
    value: 'admin' as const,
    label: '관리자',
    desc: '전체 플랫폼 관리 · /admin 접근',
    color: 'border-rose-500 bg-rose-500 text-white',
    inactiveColor: 'border-gray-200 bg-white text-gray-700 hover:border-rose-200',
  },
  {
    value: 'moderator' as const,
    label: '운영자',
    desc: '커뮤니티 관리 · 신고 처리',
    color: 'border-gray-700 bg-gray-700 text-white',
    inactiveColor: 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
  },
]

export function StaffSigninForm({ enabled }: StaffSigninFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'admin' | 'moderator'>('admin')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    if (!enabled.dev) {
      setError('개발 환경에서만 사용 가능합니다.')
      return
    }
    const dest = role === 'admin' ? '/admin' : '/mypage'
    signIn('dev', { email, name, role, callbackUrl: dest })
  }

  return (
    <Card className="w-full max-w-sm border-gray-200 shadow-lg">
      <CardContent className="p-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-base font-bold text-gray-900">스태프 로그인</h1>
          <p className="text-xs text-gray-400">
            관리자 및 운영자 전용 · 일반 회원은{' '}
            <a href="/auth/signin" className="underline hover:text-gray-700">
              여기
            </a>
            에서 로그인하세요
          </p>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        )}

        {!enabled.dev && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            OAuth 키가 설정되지 않아 개발용 로그인만 지원합니다.
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {/* 역할 선택 */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-700">역할</p>
            <div className="grid grid-cols-2 gap-2">
              {STAFF_ROLES.map(({ value, label, desc, color, inactiveColor }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={
                    'rounded-xl border-2 px-3 py-3 text-left transition-colors ' +
                    (role === value ? color : inactiveColor)
                  }
                >
                  <div className="text-sm font-semibold">{label}</div>
                  <div
                    className={
                      'mt-0.5 text-[10px] ' +
                      (role === value ? 'opacity-80' : 'text-gray-400')
                    }
                  >
                    {desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 이메일 */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@amakers.kr"
              required
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
          </div>

          {/* 이름 */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">이름 (선택)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className={
              'w-full ' +
              (role === 'admin' ? 'bg-rose-600 hover:bg-rose-700' : '')
            }
          >
            로그인
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
