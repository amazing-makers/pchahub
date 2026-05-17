'use client'

import { useEffect, useState } from 'react'
import { Badge, Card, CardContent } from '@amakers/ui'

interface InquiryEntry {
  id: string
  listingId: string
  listingTitle: string
  name?: string
  status: string
  createdAt: string
}

export function InquiriesSection() {
  const [inquiries, setInquiries] = useState<InquiryEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('themyungdang:inquiries')
      if (raw) setInquiries(JSON.parse(raw) as InquiryEntry[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  // Merge with static mock entries for demo purposes
  const staticMock: InquiryEntry[] = [
    {
      id: 'q1',
      listingId: 'l001',
      listingTitle: '강남역 도보 5분, 1층 코너 양도 매물',
      status: 'pending',
      createdAt: '2026-05-09',
    },
    {
      id: 'q2',
      listingId: 'l008',
      listingTitle: '판교 IT 단지 1층 코너 신축 매물',
      status: 'replied',
      createdAt: '2026-05-06',
    },
  ]

  // Real localStorage entries + static mock (deduplicate by id)
  const localIds = new Set(inquiries.map((i) => i.id))
  const merged = [...inquiries, ...staticMock.filter((m) => !localIds.has(m.id))].slice(0, 10)

  if (!hydrated) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {merged.map((i) => (
        <Card key={i.id} className="border-gray-200">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <a
                href={`/listings/${i.listingId}`}
                className="text-sm font-semibold text-gray-900 hover:underline"
              >
                {i.listingTitle}
              </a>
              <div className="mt-0.5 text-xs text-gray-500">신청일 {i.createdAt}</div>
            </div>
            <Badge variant={i.status === 'replied' ? 'success' : 'warning'}>
              {i.status === 'replied' ? '답변 완료' : '응답 대기'}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
