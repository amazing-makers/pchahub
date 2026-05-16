'use client'

import { useEffect, useState } from 'react'
import { Clock, MessageSquare } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { BRANDS } from '@/lib/mock-data'

interface LocalInquiry {
  id: string
  brandId: string
  brandName: string
  name: string
  phone: string
  motives: string[]
  capital: string
  region: string
  message: string
  status: 'pending' | 'replied' | 'closed'
  createdAt: string
}

const MOTIVE_LABELS: Record<string, string> = {
  consider: '창업 검토',
  info: '브랜드 정보 문의',
  quote: '견적 / 비용 확인',
  location: '입지 추천',
  visit: '가맹점 방문 희망',
}

export function LocalInquiriesSection() {
  const [inquiries, setInquiries] = useState<LocalInquiry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('pchahub:inquiries')
      if (raw) setInquiries(JSON.parse(raw) as LocalInquiry[])
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  if (!hydrated || inquiries.length === 0) return null

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
        <Clock className="h-4 w-4 text-[var(--brand-primary)]" />
        내가 신청한 상담 ({inquiries.length}건)
      </div>
      <div className="space-y-3">
        {inquiries.map((i) => {
          const brand = i.brandId ? BRANDS.find((b) => b.id === i.brandId) : undefined
          return (
            <Card key={i.id} className="border-[var(--brand-primary)]/30 bg-indigo-50/30">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {brand && (
                        <span
                          className="h-7 w-7 shrink-0 rounded-lg"
                          style={{ background: brand.logoColor }}
                          aria-hidden
                        />
                      )}
                      <span className="text-base font-semibold text-gray-900">
                        {i.brandName}
                      </span>
                      <Badge variant="warning">본사 응답 대기</Badge>
                    </div>
                    <div className="mt-2 grid gap-1 text-xs text-gray-600 sm:grid-cols-3">
                      <span>희망 지역 · {i.region}</span>
                      <span>가용 자본 · {i.capital}</span>
                      <span>신청일 · {i.createdAt}</span>
                    </div>
                    {i.motives.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {i.motives.map((m) => (
                          <span
                            key={m}
                            className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-600 border border-gray-200"
                          >
                            {MOTIVE_LABELS[m] ?? m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {i.message && (
                  <div className="mt-4 rounded-lg bg-white p-3 text-sm text-gray-700 border border-gray-100">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      내가 보낸 메시지
                    </div>
                    <p className="mt-1 line-clamp-2">{i.message}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3 text-sm">
                  <span className="text-xs text-gray-400">
                    <MessageSquare className="mr-1 inline h-3 w-3" />
                    본사 연락 대기 중
                  </span>
                  {i.brandId && (
                    <a href={`/brands/${i.brandId}`} className="text-gray-600 hover:text-gray-900">
                      브랜드 보기 →
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
