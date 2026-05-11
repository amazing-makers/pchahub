import { Coffee, Beer, Fish, IceCream, Store, GraduationCap, Utensils, GlassWater, Sandwich, Drumstick } from 'lucide-react'
import { formatNumber } from '@amakers/utils'
import type { MockCategory } from '@/lib/mock-data'

const ICON_MAP: Record<string, typeof Coffee> = {
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

interface CategoryChipProps {
  category: MockCategory
}

export function CategoryChip({ category }: CategoryChipProps) {
  const Icon = ICON_MAP[category.key] ?? Utensils
  return (
    <a
      href={`/categories/${category.key}`}
      className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[var(--brand-primary)] hover:bg-gray-50"
    >
      <Icon className="h-6 w-6 text-gray-700" />
      <div className="text-sm font-medium text-gray-900">{category.label}</div>
      <div className="text-xs text-gray-500">{formatNumber(category.brandCount)}개 브랜드</div>
    </a>
  )
}
