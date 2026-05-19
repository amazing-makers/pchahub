import { Coffee, Beer, Fish, IceCream, Store, Utensils, GlassWater, Sandwich, Drumstick, Pizza, ShoppingBag, Croissant, Monitor, GraduationCap, BookOpen, Shirt, ShoppingCart, Gamepad2, Beef } from 'lucide-react'
import { formatNumber } from '@amakers/utils'
import type { MockCategory } from '@/lib/mock-data'

const ICON_MAP: Record<string, typeof Coffee> = {
  chicken:     Drumstick,
  cafe:        Coffee,
  korean:      Utensils,
  japanese:    Fish,
  snack:       Sandwich,
  dessert:     IceCream,
  beverage:    GlassWater,
  bar:         Beer,
  western:     Utensils,
  pizza:       Pizza,
  chinese:     Utensils,
  convenience: Store,
  bakery:      Croissant,
  fastfood:    Beef,
  pcbang:      Monitor,
  education:   GraduationCap,
  study:       BookOpen,
  laundry:     Shirt,
  life:        ShoppingCart,
  leisure:     Gamepad2,
}

const COLOR_MAP: Record<string, string> = {
  chicken:     '#F97316',
  cafe:        '#92400E',
  korean:      '#16A34A',
  japanese:    '#0284C7',
  snack:       '#DC2626',
  dessert:     '#DB2777',
  bar:         '#7C3AED',
  western:     '#CA8A04',
  pizza:       '#EA580C',
  chinese:     '#B91C1C',
  convenience: '#0891B2',
  bakery:      '#D97706',
  fastfood:    '#DC2626',
  pcbang:      '#6366F1',
  education:   '#0284C7',
  study:       '#0891B2',
  laundry:     '#0D9488',
  life:        '#7C3AED',
  leisure:     '#DB2777',
}

interface CategoryChipProps {
  category: MockCategory
}

export function CategoryChip({ category }: CategoryChipProps) {
  const Icon = ICON_MAP[category.key] ?? Utensils
  const color = COLOR_MAP[category.key] ?? '#6B7280'

  return (
    <a
      href={`/brands?category=${category.key}`}
      className="group flex flex-col items-center gap-2.5 rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-transparent hover:shadow-md"
      style={{ ['--chip-color' as string]: color }}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
        style={{ background: `${color}18` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-gray-900">{category.label}</div>
        <div className="mt-0.5 text-xs text-gray-400">{formatNumber(category.brandCount)}개</div>
      </div>
    </a>
  )
}
