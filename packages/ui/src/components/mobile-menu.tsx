'use client'

import * as React from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@amakers/utils'
import type { HeaderNavItem, HeaderAction } from './header'

export interface MobileMenuProps {
  navItems: HeaderNavItem[]
  actions?: HeaderAction[]
}

export function MobileMenu({ navItems, actions }: MobileMenuProps) {
  const [open, setOpen] = React.useState(false)
  const close = React.useCallback(() => setOpen(false), [])

  React.useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="-mr-2 rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 md:hidden"
        aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 top-16 z-30 bg-black/30 md:hidden"
            aria-hidden
            onClick={close}
          />
          <div className="absolute inset-x-0 top-16 z-40 border-b border-gray-200 bg-white shadow-lg md:hidden">
            <div className="container mx-auto py-3">
              <nav className="flex flex-col">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    aria-current={item.active ? 'page' : undefined}
                    className={cn(
                      'rounded-md px-3 py-2.5 text-sm font-medium',
                      item.active
                        ? 'bg-gray-50 font-semibold text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50',
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              {actions && actions.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                  {actions.map((a) => (
                    <a
                      key={a.href}
                      href={a.href}
                      onClick={close}
                      className={cn(
                        'rounded-md px-3 py-2 text-center text-sm font-medium transition-colors',
                        a.variant === 'primary'
                          ? 'text-white hover:opacity-90'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
                      )}
                      style={
                        a.variant === 'primary'
                          ? { background: 'var(--brand-primary)' }
                          : undefined
                      }
                    >
                      {a.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
