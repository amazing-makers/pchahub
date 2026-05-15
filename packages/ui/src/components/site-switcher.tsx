'use client'

import * as React from 'react'
import { ChevronDown, LayoutGrid } from 'lucide-react'
import { cn } from '@amakers/utils'
import { platformColors, type PlatformKey } from '@amakers/design-system'

export interface SiteSwitcherProps {
  current: PlatformKey
}

const platforms = Object.entries(platformColors) as Array<
  [PlatformKey, (typeof platformColors)[PlatformKey]]
>

export function SiteSwitcher({ current }: SiteSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const onClickAway = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <LayoutGrid className="h-4 w-4" />
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
        >
          <div className="px-2 pb-2 pt-1 text-xs font-semibold text-gray-500">
            한국 프랜차이즈 9개 플랫폼
          </div>
          <div className="grid grid-cols-1 gap-0.5">
            {platforms.map(([key, b]) => {
              const isCurrent = key === current
              return (
                <a
                  key={key}
                  role="menuitem"
                  href={isCurrent ? '#' : `https://${b.domain}`}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                    isCurrent ? 'bg-gray-50' : 'hover:bg-gray-50'
                  )}
                  onClick={async (e) => {
                    if (isCurrent) {
                      e.preventDefault()
                      return
                    }
                    // Try SSO passport flow first; fall back to plain nav.
                    e.preventDefault()
                    const fallback = `https://${b.domain}`
                    try {
                      const res = await fetch(`/api/sso/passport?to=${encodeURIComponent(b.domain)}`, {
                        credentials: 'include',
                      })
                      if (!res.ok) {
                        window.location.href = fallback
                        return
                      }
                      const data = (await res.json()) as { token?: string }
                      if (!data.token) {
                        window.location.href = fallback
                        return
                      }
                      const acceptUrl = `https://${b.domain}/api/sso/accept?token=${encodeURIComponent(
                        data.token,
                      )}&next=${encodeURIComponent('/')}`
                      window.location.href = acceptUrl
                    } catch {
                      window.location.href = fallback
                    }
                  }}
                >
                  <span
                    className="h-8 w-8 shrink-0 rounded-md"
                    style={{ background: b.primary }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-900">{b.name}</div>
                    <div className="truncate text-xs text-gray-500">{b.role}</div>
                  </div>
                  {isCurrent && <span className="text-xs text-gray-400">현재</span>}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
