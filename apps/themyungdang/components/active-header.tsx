'use client'

import { usePathname } from 'next/navigation'
import { Header, type HeaderAction, type HeaderNavItem } from '@amakers/ui'

interface ActiveHeaderProps {
  navItems: HeaderNavItem[]
  actions: HeaderAction[]
  rightSlot?: React.ReactNode
}

/**
 * Thin client wrapper around the shared Header.
 * Uses usePathname() to mark the current nav item as active.
 */
export function ActiveHeader({ navItems, actions, rightSlot }: ActiveHeaderProps) {
  const pathname = usePathname()

  const itemsWithActive: HeaderNavItem[] = navItems.map((item) => ({
    ...item,
    // Mark active when pathname equals the href or starts with it (for sub-routes).
    // The root path '/' is exact-match only.
    active:
      item.href === '/'
        ? pathname === '/'
        : pathname === item.href || pathname.startsWith(item.href + '/'),
  }))

  return (
    <Header
      platform="themyungdang"
      navItems={itemsWithActive}
      actions={actions}
      showRole={false}
      showSiteSwitcher={false}
      rightSlot={rightSlot}
    />
  )
}
