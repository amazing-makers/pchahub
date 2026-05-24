'use client'

import { useEffect, useState } from 'react'
import { SupportCard } from './support-card'
import type { MockSupport, ReviewStatus } from '@/lib/hub-data'

const KEY = 'jangsanote:community:support'

type StoredSupport = MockSupport & { status?: ReviewStatus }

interface CommunitySupportFeedProps {
  /** 'all' 또는 SupportType — 목록 필터와 동기화 */
  typeFilter?: string
}

/** 점주가 제보한(localStorage) 지원·이벤트 중 승인된 것을 목록 상단에 prepend. */
export function CommunitySupportFeed({ typeFilter = 'all' }: CommunitySupportFeedProps) {
  const [items, setItems] = useState<StoredSupport[]>([])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw) as StoredSupport[])
    } catch {
      /* ignore */
    }
  }, [])

  const approved = items.filter((s) => (s.status ?? 'approved') === 'approved')
  const filtered = typeFilter === 'all' ? approved : approved.filter((s) => s.type === typeFilter)
  if (filtered.length === 0) return null

  return (
    <>
      {filtered.map((s) => (
        <SupportCard key={s.id} support={{ ...s, source: 'community' }} />
      ))}
    </>
  )
}
