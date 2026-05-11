import * as React from 'react'
import { Search } from 'lucide-react'
import { platformColors, type PlatformKey } from '@amakers/design-system'
import { SiteSwitcher } from './site-switcher'

export interface HeaderNavItem {
  href: string
  label: string
}

export interface HeaderProps {
  platform: PlatformKey
  navItems?: HeaderNavItem[]
  showSearch?: boolean
  rightSlot?: React.ReactNode
}

export function Header({ platform, navItems = [], showSearch = false, rightSlot }: HeaderProps) {
  const brand = platformColors[platform]

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
            <span className="hidden text-xs text-gray-400 sm:inline">· {brand.role}</span>
          </a>
          {navItems.length > 0 && (
            <nav className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
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
          <SiteSwitcher current={platform} />
          {rightSlot ?? (
            <a
              href="/auth/signin"
              className="hidden items-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:inline-flex"
            >
              로그인
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
