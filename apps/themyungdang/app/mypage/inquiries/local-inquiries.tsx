'use client'

import { useEffect, useState } from 'react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { LISTINGS } from '@/lib/mock-data'

interface LocalInquiry {
  id: string
  listingId: string
  title: string
  status: 'pending' | 'replied'
  statusLabel: string
  message: string
  createdAt: string
  updatedAt: string
}

export function LocalInquiries() {
  const [items, setItems] = useState<LocalInquiry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('themyungdang:inquiries')
      if (raw) setItems(JSON.parse(raw) as LocalInquiry[])
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  if (!hydrated || items.length === 0) return null

  return (
    <div className="mb-8">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
        내가 보낸 문의 ({items.length}건)
      </div>
      <div className="space-y-4">
        {items.map((inquiry) => {
          const listing = LISTINGS.find((l) => l.id === inquiry.listingId)
          return (
            <Card key={inquiry.id} className="border-[var(--brand-primary)]/20 bg-amber-50/30 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <a
                      href={`/listings/${inquiry.listingId}`}
                      className="text-sm font-semibold text-gray-900 hover:underline"
                    >
                      {inquiry.title}
                    </a>
                    {listing && (
                      <div className="mt-0.5 text-xs text-gray-500">
                        {listing.region} {listing.district} · {listing.area}평 · {listing.floor}
                      </div>
                    )}
                  </div>
                  <Badge variant="warning">{inquiry.statusLabel}</Badge>
                </div>

                {inquiry.message && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-3.5">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      내 문의
                    </p>
                    <p className="text-sm text-gray-700">{inquiry.message}</p>
                    <p className="mt-1.5 text-xs text-gray-400">{inquiry.createdAt}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
