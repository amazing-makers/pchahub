'use client'

import { Heart } from 'lucide-react'
import { ListingCard } from './listing-card'
import { useFavorites } from '@/hooks/use-favorites'
import type { MockListing } from '@/lib/mock-data'

interface ListingCardWithSaveProps {
  listing: MockListing
}

export function ListingCardWithSave({ listing }: ListingCardWithSaveProps) {
  const { favorites, toggle, hydrated } = useFavorites()
  const saved = favorites.has(listing.id)

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggle(listing.id)
  }

  return (
    <div className="relative">
      <ListingCard listing={listing} />
      {hydrated && (
        <button
          type="button"
          onClick={handleToggle}
          className={
            'absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-colors z-10 ' +
            (saved
              ? 'border-rose-300 bg-rose-500 text-white hover:bg-rose-600'
              : 'border-gray-200 bg-white/90 text-gray-500 hover:bg-white hover:text-rose-500')
          }
          aria-label={saved ? '찜 해제' : '찜하기'}
        >
          <Heart className={'h-4 w-4 ' + (saved ? 'fill-white' : '')} />
        </button>
      )}
    </div>
  )
}
