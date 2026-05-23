'use client'

import * as React from 'react'
import {
  Award,
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  ChefHat,
  FileText,
  GraduationCap,
  HandCoins,
  Home,
  Image as ImageIcon,
  LayoutGrid,
  type LucideIcon,
  Map,
  MapPin,
  MessageSquare,
  PlayCircle,
  Sparkles,
  Store,
  TrendingUp,
  Trophy,
  User,
  Users,
  Wrench,
} from 'lucide-react'
import { cn } from '@amakers/utils'
import type { PlatformKey } from '@amakers/design-system'

interface TabItem {
  href: string
  label: string
  icon: LucideIcon
}

/**
 * Platform-tailored bottom navigation. Mobile only (hidden on md+).
 * Each platform surfaces its 4–5 most important destinations so customers
 * reach core flows with one thumb, native-app style.
 */
const TABS: Record<PlatformKey, TabItem[]> = {
  pchahub: [
    { href: '/', label: '홈', icon: Home },
    { href: '/brands', label: '브랜드', icon: Store },
    { href: '/listings', label: '매물', icon: MapPin },
    { href: '/community', label: '커뮤니티', icon: MessageSquare },
    { href: '/mypage', label: '내정보', icon: User },
  ],
  themyungdang: [
    { href: '/', label: '홈', icon: Home },
    { href: '/listings', label: '매물', icon: Store },
    { href: '/listings/map', label: '지도', icon: Map },
    { href: '/areas', label: '상권', icon: MapPin },
    { href: '/mypage', label: '내정보', icon: User },
  ],
  themanual: [
    { href: '/', label: '홈', icon: Home },
    { href: '/courses', label: '강의', icon: GraduationCap },
    { href: '/mentors', label: '멘토', icon: Users },
    { href: '/knowhow', label: '노하우', icon: BookOpen },
    { href: '/mypage', label: '내정보', icon: User },
  ],
  bestplace: [
    { href: '/', label: '홈', icon: Home },
    { href: '/rankings', label: '랭킹', icon: Trophy },
    { href: '/awards', label: '어워드', icon: Award },
    { href: '/stores', label: '매장', icon: Store },
    { href: '/mypage', label: '내정보', icon: User },
  ],
  gongganhansu: [
    { href: '/', label: '홈', icon: Home },
    { href: '/contractors', label: '시공사', icon: Wrench },
    { href: '/gallery', label: '갤러리', icon: ImageIcon },
    { href: '/quote', label: '견적', icon: FileText },
    { href: '/mypage', label: '내정보', icon: User },
  ],
  jangsanote: [
    { href: '/', label: '홈', icon: Home },
    { href: '/meetings', label: '모임', icon: Calendar },
    { href: '/recipes', label: '레시피', icon: ChefHat },
    { href: '/support', label: '지원', icon: HandCoins },
    { href: '/mypage', label: '내정보', icon: User },
  ],
  changupdocu: [
    { href: '/', label: '홈', icon: Home },
    { href: '/episodes', label: '에피소드', icon: PlayCircle },
    { href: '/magazine', label: '매거진', icon: BookOpen },
    { href: '/categories', label: '카테고리', icon: LayoutGrid },
    { href: '/mypage', label: '내정보', icon: User },
  ],
  openrun: [
    { href: '/', label: '홈', icon: Home },
    { href: '/services', label: '서비스', icon: Sparkles },
    { href: '/portfolio', label: '사례', icon: BarChart3 },
    { href: '/contact', label: '문의', icon: MessageSquare },
    { href: '/mypage', label: '내정보', icon: User },
  ],
  pchabridge: [
    { href: '/', label: '홈', icon: Home },
    { href: '/investments', label: '투자', icon: TrendingUp },
    { href: '/ma', label: 'M&A', icon: Building2 },
    { href: '/funding', label: '펀딩', icon: Users },
    { href: '/mypage', label: '내정보', icon: User },
  ],
}

export interface MobileTabBarProps {
  platform: PlatformKey
}

export function MobileTabBar({ platform }: MobileTabBarProps) {
  const tabs = TABS[platform] ?? []
  const [path, setPath] = React.useState('')

  React.useEffect(() => {
    setPath(window.location.pathname)
  }, [])

  // Single active tab: the longest href that prefixes the current path.
  const activeHref = tabs
    .filter((t) =>
      t.href === '/' ? path === '/' : path === t.href || path.startsWith(t.href + '/'),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  if (tabs.length === 0) return null

  return (
    <nav
      aria-label="모바일 메뉴"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch">
        {tabs.map((t) => {
          const active = t.href === activeHref
          const Icon = t.icon
          return (
            <li key={t.href} className="flex-1">
              <a
                href={t.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
                  active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600',
                )}
                style={active ? { color: 'var(--brand-primary)' } : undefined}
              >
                <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 2} />
                <span>{t.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
