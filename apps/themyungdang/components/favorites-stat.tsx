'use client'

import { Bookmark } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { useFavorites } from '@/hooks/use-favorites'

/** Stat card that shows actual favorites count from localStorage. */
export default function FavoritesStat() {
  const { favorites } = useFavorites()

  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <Bookmark className="h-4 w-4 text-gray-400" />
        <div className="mt-2 text-xs text-gray-500">찜한 매물</div>
        <div className="mt-0.5 text-base font-semibold text-gray-900">{favorites.size}건</div>
      </CardContent>
    </Card>
  )
}
