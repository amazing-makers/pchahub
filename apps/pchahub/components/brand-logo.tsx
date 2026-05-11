import { Coffee, Beer, Fish, IceCream, Store, GraduationCap, Utensils, GlassWater, Sandwich, Drumstick } from 'lucide-react'
import type { MockBrand } from '@/lib/mock-data'

const CATEGORY_ICON: Record<string, typeof Coffee> = {
  chicken: Drumstick,
  cafe: Coffee,
  korean: Utensils,
  japanese: Fish,
  snack: Sandwich,
  dessert: IceCream,
  beverage: GlassWater,
  bar: Beer,
  convenience: Store,
  education: GraduationCap,
}

type Size = 'sm' | 'md' | 'lg' | 'xl'

const SIZE: Record<Size, { box: string; text: string; icon: string }> = {
  sm: { box: 'h-9 w-9 rounded-lg', text: 'text-sm', icon: 'h-4 w-4' },
  md: { box: 'h-12 w-12 rounded-xl', text: 'text-base', icon: 'h-5 w-5' },
  lg: { box: 'h-16 w-16 rounded-2xl', text: 'text-xl', icon: 'h-6 w-6' },
  xl: { box: 'h-20 w-20 rounded-2xl', text: 'text-2xl', icon: 'h-7 w-7' },
}

interface BrandLogoProps {
  brand: Pick<MockBrand, 'name' | 'logoColor' | 'category'>
  size?: Size
  /** Adds white ring/border — for use when overlapping a photo. */
  bordered?: boolean
  className?: string
}

/**
 * Brand "logo" — monogram-style fallback until real SVG logos are uploaded.
 * Pattern: colored box + first character (Korean glyph) of the brand name +
 * category icon as subtle background watermark.
 *
 * Used everywhere a brand identity needs to appear: cards, hero, mypage saved,
 * comparison table headers, etc.
 */
export function BrandLogo({ brand, size = 'md', bordered = false, className = '' }: BrandLogoProps) {
  const s = SIZE[size]
  const Icon = CATEGORY_ICON[brand.category] ?? Utensils
  // First Korean character (or first ascii fallback) as monogram
  const initial = brand.name.charAt(0)

  return (
    <span
      className={
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden font-bold text-white shadow-sm ' +
        s.box +
        ' ' +
        s.text +
        ' ' +
        (bordered ? 'ring-2 ring-white ' : '') +
        className
      }
      style={{ background: brand.logoColor }}
      aria-label={`${brand.name} 로고`}
    >
      {/* Subtle category icon watermark (low opacity) */}
      <Icon
        className={'absolute right-0.5 bottom-0.5 opacity-25 ' + s.icon}
        aria-hidden
      />
      <span className="relative z-10">{initial}</span>
    </span>
  )
}
