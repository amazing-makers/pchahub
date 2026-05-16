'use client'

import { Heart } from 'lucide-react'
import { LISTINGS } from '@/lib/mock-data'
import { ListingCard } from '@/components/listing-card'
import { useFavorites } from '@/hooks/use-favorites'
import { ListingCardSkeleton } from '@/components/skeletons'

export default function FavoritesSection() {
  const { favorites, hydrated } = useFavorites()

  // Show skeleton until the hook has read localStorage.
  // `hydrated` starts false (matching SSR), turns true after useEffect fires.
  if (!hydrated) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => <ListingCardSkeleton key={i} />)}
      </div>
    )
  }

  const saved = LISTINGS.filter(l => favorites.has(l.id))

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
        <Heart className="h-10 w-10 text-gray-200" />
        <p className="text-sm font-semibold text-gray-500">아직 찜한 매물이 없습니다</p>
        <p className="text-xs text-gray-400">매물 카드 오른쪽 아래 ♥ 를 눌러 찜해보세요.</p>
        <a
          href="/listings"
          className="mt-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
        >
          매물 둘러보기 →
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {saved.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  )
}
