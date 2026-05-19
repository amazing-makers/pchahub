import * as React from 'react'
import { Search } from 'lucide-react'
import { cn } from '@amakers/utils'
import { platformColors, type PlatformKey } from '@amakers/design-system'
import { SiteSwitcher } from './site-switcher'
import { MobileMenu } from './mobile-menu'

export interface HeaderNavItem {
  href: string
  label: string
  /** When true the link is highlighted as the current page. */
  active?: boolean
}

export interface HeaderAction {
  href: string
  label: string
  /** Visual emphasis. Defaults to plain link. */
  variant?: 'default' | 'primary'
}

export interface HeaderProps {
  platform: PlatformKey
  navItems?: HeaderNavItem[]
  /** Right-side CTAs. Rendered on desktop AND inside the mobile drawer. */
  actions?: HeaderAction[]
  showSearch?: boolean
  /** Show the small "· {role}" label next to the brand name. Default true. */
  showRole?: boolean
  /** Show the 9-site dropdown switcher in the header. Default false. */
  showSiteSwitcher?: boolean
  /** Escape hatch for arbitrary right-side content; takes precedence over `actions`. */
  rightSlot?: React.ReactNode
}

export function Header({
  platform,
  navItems = [],
  actions,
  showSearch = false,
  showRole = true,
  showSiteSwitcher = false,
  rightSlot,
}: HeaderProps) {
  const brand = platformColors[platform]

  const resolvedRight = rightSlot ?? (actions ? <DesktopActions actions={actions} /> : <DefaultRight />)

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: brand.primary }}
              aria-hidden
            />
            <span className="text-base font-semibold text-gray-900">{brand.name}</span>
            {showRole && (
              <span className="hidden text-xs text-gray-400 sm:inline">· {brand.role}</span>
            )}
          </a>
          {navItems.length > 0 && (
            <nav className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={cn(
                    'text-sm transition-colors',
                    item.active
                      ? 'font-semibold text-gray-900'
                      : 'text-gray-600 hover:text-gray-900',
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-1">
          {showSearch && (
            <button
              type="button"
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              aria-label="검색"
            >
              <Search className="h-4 w-4" />
            </button>
          )}
          {showSiteSwitcher && <SiteSwitcher current={platform} />}
          <div className="hidden md:flex md:items-center md:gap-1">{resolvedRight}</div>
          <MobileMenu navItems={navItems} actions={actions} />
        </div>
      </div>
    </header>
  )
}

function DesktopActions({ actions }: { actions: HeaderAction[] }) {
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
          style={
            a.variant === 'primary' ? { background: 'var(--brand-primary)' } : undefined
          }
        >
          {a.label}
        </a>
      ))}
    </>
  )
}

function DefaultRight() {
  return (
    <a
      href="/auth/signin"
      className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
    >
      로그인
    </a>
  )
}
