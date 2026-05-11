import {
  Beer,
  Coffee,
  Drumstick,
  Fish,
  GlassWater,
  GraduationCap,
  IceCream,
  Sandwich,
  Store,
  Utensils,
  type LucideIcon,
} from 'lucide-react'

/**
 * Generic brand identity (monogram).
 *
 * Used across pchahub, bestplace, openrun, themanual, jangsanote, changupdocu
 * wherever a brand needs to appear as a small card icon. Renders a colored
 * box + first character + subtle category icon watermark.
 *
 * When real SVG logos are uploaded per brand, replace `category` prop with
 * `logoUrl?: string` and conditionally render an <img> instead of monogram.
 */

interface BrandLike {
  name: string
  /** Hex color for the box background. */
  logoColor: string
  /** Optional — used to pick a category icon as background watermark. */
  category?: string
}

type Size = 'sm' | 'md' | 'lg' | 'xl'

const SIZE: Record<Size, { box: string; text: string; icon: string }> = {
  sm: { box: 'h-9 w-9 rounded-lg', text: 'text-sm', icon: 'h-4 w-4' },
  md: { box: 'h-12 w-12 rounded-xl', text: 'text-base', icon: 'h-5 w-5' },
  lg: { box: 'h-16 w-16 rounded-2xl', text: 'text-xl', icon: 'h-6 w-6' },
  xl: { box: 'h-20 w-20 rounded-2xl', text: 'text-2xl', icon: 'h-7 w-7' },
}

const CATEGORY_ICON: Record<string, LucideIcon> = {
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

export interface BrandLogoProps {
  brand: BrandLike
  size?: Size
  /** Adds white ring/border — for use when overlapping a photo. */
  bordered?: boolean
  className?: string
}

export function BrandLogo({ brand, size = 'md', bordered = false, className = '' }: BrandLogoProps) {
  const s = SIZE[size]
  const Icon = brand.category ? CATEGORY_ICON[brand.category] ?? Utensils : null
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
      {Icon && (
        <Icon
          className={'absolute right-0.5 bottom-0.5 opacity-25 ' + s.icon}
          aria-hidden
        />
      )}
      <span className="relative z-10">{initial}</span>
    </span>
  )
}
