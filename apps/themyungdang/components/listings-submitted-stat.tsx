'use client'

import { useEffect, useState } from 'react'
import { PencilLine } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

/** 등록한 매물 수를 themyungdang:listings-submitted localStorage에서 읽어 stat 카드로 표시 */
export function ListingsSubmittedStat() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('themyungdang:listings-submitted')
      const items: unknown[] = raw ? (JSON.parse(raw) as unknown[]) : []
      setCount(items.length)
    } catch {
      setCount(0)
    }
  }, [])

  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <PencilLine className="h-4 w-4 text-gray-400" />
        <div className="mt-2 text-xs text-gray-500">등록한 매물</div>
        <div className="mt-0.5 text-base font-semibold text-gray-900">
          {count === null ? '—' : `${count}건`}
        </div>
      </CardContent>
    </Card>
  )
}
