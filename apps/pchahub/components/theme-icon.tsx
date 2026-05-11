import {
  Coins,
  Home,
  Moon,
  Package,
  Sparkles,
  TrendingUp,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { Theme } from '@/lib/themes'

const ICON_MAP: Record<Theme['iconKey'], LucideIcon> = {
  wallet: Wallet,
  user: User,
  package: Package,
  trending: TrendingUp,
  moon: Moon,
  coins: Coins,
  home: Home,
  sparkles: Sparkles,
}

export function ThemeIcon({ iconKey, className }: { iconKey: Theme['iconKey']; className?: string }) {
  const Icon = ICON_MAP[iconKey] ?? Sparkles
  return <Icon className={className} aria-hidden />
}
