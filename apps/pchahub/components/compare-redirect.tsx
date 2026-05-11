'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, History } from 'lucide-react'

const COMPARE_KEY = 'pchahub:compareIds'

/**
 * On the empty compare page, suggest loading the user's saved compare list
 * (stored in localStorage by BrandActions). Server component renders the
 * static EmptyState — this client banner only appears if there's something
 * to restore.
 */
export function CompareRestoreBanner() {
  const [savedIds, setSavedIds] = useState<string[] | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(COMPARE_KEY)
      if (!raw) return
      const arr = JSON.parse(raw) as string[]
      if (Array.isArray(arr) && arr.length > 0) {
        setSavedIds(arr)
      }
    } catch {
      // ignore
    }
  }, [])

  if (!savedIds || savedIds.length === 0) return null

  const href = `/brands/compare?ids=${savedIds.slice(0, 3).join(',')}`

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
      <div className="flex items-start gap-3">
        <History className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
        <div>
          <div className="text-sm font-semibold text-indigo-900">
            이전에 비교 추가한 브랜드 {savedIds.length}개가 있어요
          </div>
          <p className="mt-0.5 text-xs text-indigo-700">
            "비교 추가" 버튼으로 저장한 브랜드를 자동으로 불러옵니다.
          </p>
        </div>
      </div>
      <a
        href={href}
        className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
      >
        저장한 목록 비교
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}
