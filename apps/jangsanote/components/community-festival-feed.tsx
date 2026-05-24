'use client'

import { useEffect, useState } from 'react'
import { FestivalCard } from './festival-card'
import type { MockFestival, ReviewStatus } from '@/lib/hub-data'

const KEY = 'jangsanote:community:festivals'

type StoredFestival = MockFestival & { status?: ReviewStatus }

interface CommunityFestivalFeedProps {
  /** 'all' 또는 FestivalType — 목록 필터와 동기화 */
  typeFilter?: string
}

/**
 * 점주가 제보한(localStorage) 축제·박람회를 목록 상단에 prepend.
 * 서버 시드 목록과 함께 같은 그리드에 자연스럽게 섞인다.
 */
export function CommunityFestivalFeed({ typeFilter = 'all' }: CommunityFestivalFeedProps) {
  const [items, setItems] = useState<StoredFestival[]>([])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw) as StoredFestival[])
    } catch {
      /* ignore */
    }
  }, [])

  // 승인된 제보만 공개(미설정 legacy는 공개로 간주)
  const approved = items.filter((f) => (f.status ?? 'approved') === 'approved')
  const filtered = typeFilter === 'all' ? approved : approved.filter((f) => f.type === typeFilter)
  if (filtered.length === 0) return null

  return (
    <>
      {filtered.map((f) => (
        <FestivalCard key={f.id} festival={{ ...f, source: 'community' }} />
      ))}
    </>
  )
}
