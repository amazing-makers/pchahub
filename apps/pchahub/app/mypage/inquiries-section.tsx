'use client'

import { useEffect, useState } from 'react'
import { Badge, Card, CardContent } from '@amakers/ui'

interface InquiryEntry {
  id: string
  brandId: string
  brandName: string
  status: string
  statusLabel?: string
  createdAt: string
}

export function InquiriesSection() {
  const [inquiries, setInquiries] = useState<InquiryEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('pchahub:inquiries')
      if (raw) setInquiries(JSON.parse(raw) as InquiryEntry[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  const staticMock: InquiryEntry[] = [
    { id: 'i1', brandId: 'b1', brandName: '치킨다이스', status: 'pending', statusLabel: '본사 응답 대기', createdAt: '2026-05-09' },
    { id: 'i2', brandId: 'b2', brandName: '데일리브루', status: 'replied', statusLabel: '본사 답변 완료', createdAt: '2026-05-05' },
  ]

  const localIds = new Set(inquiries.map((i) => i.id))
  const merged = [...inquiries, ...staticMock.filter((m) => !localIds.has(m.id))].slice(0, 8)

  if (!hydrated) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />)}
      </div>
    )
  }

  if (merged.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
        아직 상담 신청 내역이 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {merged.map((i) => (
        <Card key={i.id} className="border-gray-200">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <a href={`/brands/${i.brandId}`} className="text-sm font-semibold text-gray-900 hover:underline">
                {i.brandName}
              </a>
              <div className="mt-0.5 text-xs text-gray-500">신청일 {i.createdAt}</div>
            </div>
            <Badge variant={i.status === 'replied' ? 'success' : 'warning'}>
              {i.statusLabel ?? (i.status === 'replied' ? '답변 완료' : '응답 대기')}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
