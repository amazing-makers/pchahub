'use client'

import { useEffect, useState } from 'react'
import { Calculator, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'

const KEY = 'pchahub:savedCalcs'

interface SavedCalc {
  id: string
  label: string
  savedAt: string
  estimatedMonthlyRevenue: number
  netMonthlyProfit: number
  startupCost: number
}

export function SavedCalcs() {
  const [calcs, setCalcs] = useState<SavedCalc[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) setCalcs(JSON.parse(raw) as SavedCalc[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  function remove(id: string) {
    const next = calcs.filter((c) => c.id !== id)
    setCalcs(next)
    try { window.localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  if (!hydrated) return null
  if (calcs.length === 0) return null

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <Calculator className="h-4 w-4 text-gray-400" />
        <h2 className="text-h4 font-semibold text-gray-900">저장한 계산 내역</h2>
      </div>
      <div className="space-y-2">
        {calcs.map((c) => (
          <Card key={c.id} className="border-gray-200">
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-gray-900">{c.label}</div>
                <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-gray-500">
                  <span>예상 월매출 {formatNumber(c.estimatedMonthlyRevenue)}만</span>
                  <span>순이익 {formatNumber(c.netMonthlyProfit)}만</span>
                  <span>창업비 {formatNumber(c.startupCost)}만</span>
                </div>
                <div className="mt-0.5 text-xs text-gray-400">{c.savedAt}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={`/calculator?load=${c.id}`}
                  className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                >
                  다시 보기
                </a>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  className="rounded-md p-1 text-gray-400 hover:text-rose-500"
                  aria-label="삭제"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
