'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, PencilLine, User } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import type { HeaderAction } from '@amakers/ui'
import { cn } from '@amakers/utils'

interface HeaderUserMenuProps {
  actions: HeaderAction[]
}

export function HeaderUserMenu({ actions }: HeaderUserMenuProps) {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClickAway = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (status === 'loading') return <StaticActions actions={actions} />

  if (!session) {
    return (
      <>
        <StaticActions actions={actions} />
        <a
          href="/auth/signin"
          className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          로그인
        </a>
      </>
    )
  }

  const name = session.user?.name ?? session.user?.email?.split('@')[0] ?? '사용자'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        aria-expanded={open}
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: 'var(--brand-primary)' }}
          aria-hidden
        >
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:inline">{name}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="text-sm font-semibold text-gray-900">{name}</div>
            <div className="truncate text-xs text-gray-500">{session.user?.email}</div>
          </div>
          <a
            href="/mypage"
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <User className="h-4 w-4 text-gray-400" />
            마이페이지
          </a>
          <a
            href="/post"
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <PencilLine className="h-4 w-4 text-gray-400" />
            매물 등록
          </a>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
            role="menuitem"
          >
            <LogOut className="h-4 w-4 text-gray-400" />
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}

function StaticActions({ actions }: { actions: HeaderAction[] }) {
  return (
    <>
      {actions.map((a) => (
        <a
          key={a.href}
          href={a.href}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            a.variant === 'primary'
              ? 'text-white hover:opacity-90'
              : 'text-gray-700 hover:bg-gray-100',
          )}
          style={a.variant === 'primary' ? { background: 'var(--brand-primary)' } : undefined}
        >
          {a.label}
        </a>
      ))}
    </>
  )
}
