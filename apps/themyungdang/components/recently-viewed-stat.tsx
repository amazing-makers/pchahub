'use client'

import { Eye } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { useRecentlyViewed } from '@/hooks/use-recently-viewed'
import { StatSkeleton } from '@/components/skeletons'

/** Stat card showing actual recently-viewed count from localStorage. */
export default function RecentlyViewedStat() {
  const { recentIds, hydrated } = useRecentlyViewed()

  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <Eye className="h-4 w-4 text-gray-400" />
        <div className="mt-2 text-xs text-gray-500">조회한 매물</div>
        <div className="mt-0.5 text-base font-semibold text-gray-900">
          {hydrated ? `${recentIds.length}건` : <StatSkeleton />}
        </div>
      </CardContent>
    </Card>
  )
}
