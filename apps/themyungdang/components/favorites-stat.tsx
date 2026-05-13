'use client'

import { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

const FAV_KEY = 'tmyd-fav'

/** Stat card that reads actual favorites count from localStorage. */
export default function FavoritesStat() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY)
      setCount(raw ? (JSON.parse(raw) as string[]).length : 0)
    } catch {
      setCount(0)
    }
  }, [])

  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <Bookmark className="h-4 w-4 text-gray-400" />
        <div className="mt-2 text-xs text-gray-500">찜한 매물</div>
        <div className="mt-0.5 text-base font-semibold text-gray-900">{count}건</div>
      </CardContent>
    </Card>
  )
}
