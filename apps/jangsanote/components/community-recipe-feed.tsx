'use client'

import { useEffect, useState } from 'react'
import { RecipeCard } from './recipe-card'
import type { MockRecipe, ReviewStatus } from '@/lib/hub-data'

const KEY = 'jangsanote:community:recipes'

type StoredRecipe = MockRecipe & { status?: ReviewStatus }

interface CommunityRecipeFeedProps {
  /** '전체' 또는 분류명 — 목록 필터와 동기화 */
  categoryFilter?: string
}

/** 점주가 작성한(localStorage) 레시피를 목록 상단에 prepend. */
export function CommunityRecipeFeed({ categoryFilter = '전체' }: CommunityRecipeFeedProps) {
  const [items, setItems] = useState<StoredRecipe[]>([])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw) as StoredRecipe[])
    } catch {
      /* ignore */
    }
  }, [])

  // 승인된 제보만 공개(미설정 legacy는 공개로 간주)
  const approved = items.filter((r) => (r.status ?? 'approved') === 'approved')
  const filtered = categoryFilter === '전체' ? approved : approved.filter((r) => r.category === categoryFilter)
  if (filtered.length === 0) return null

  return (
    <>
      {filtered.map((r) => (
        <RecipeCard key={r.id} recipe={{ ...r, source: 'community' }} />
      ))}
    </>
  )
}
