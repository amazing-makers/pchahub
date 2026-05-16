'use client'

import { useEffect, useState } from 'react'
import { Calculator, Heart, MessageSquare, Sparkles, Star } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

export function StatsClient() {
  const [savedCount, setSavedCount] = useState(0)
  const [inquiryCount, setInquiryCount] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [listingContactCount, setListingContactCount] = useState(0)
  const [scannerCount, setScannerCount] = useState(0)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('pchahub:savedBrands')
      if (raw) setSavedCount((JSON.parse(raw) as string[]).length)
    } catch { /* ignore */ }
    try {
      const raw2 = window.localStorage.getItem('pchahub:inquiries')
      if (raw2) setInquiryCount((JSON.parse(raw2) as unknown[]).length)
    } catch { /* ignore */ }
    try {
      const raw3 = window.localStorage.getItem('pchahub:reviews')
      if (raw3) setReviewCount((JSON.parse(raw3) as unknown[]).length)
    } catch { /* ignore */ }
    try {
      const raw4 = window.localStorage.getItem('pchahub:listing-contacts')
      if (raw4) setListingContactCount((JSON.parse(raw4) as unknown[]).length)
    } catch { /* ignore */ }
    try {
      const raw5 = window.localStorage.getItem('pchahub:scanner-results')
      if (raw5) setScannerCount((JSON.parse(raw5) as unknown[]).length)
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <StatLink href="/mypage/saved" icon={Heart} label="찜한 브랜드" value={`${savedCount}개`} />
      <StatLink href="/mypage/inquiries" icon={MessageSquare} label="가맹 상담" value={`${inquiryCount}건`} />
      <StatLink href="/mypage/reviews" icon={Star} label="작성한 후기" value={`${reviewCount}건`} />
      <StatLink href="/listings" icon={Calculator} label="매물 문의" value={`${listingContactCount}건`} />
      <StatLink href="/scanner" icon={Sparkles} label="스캐너 결과" value={`${scannerCount}건`} />
    </div>
  )
}

function StatLink({
  href,
  icon: Icon,
  label,
  value,
}: {
  href: string
  icon: typeof Heart
  label: string
  value: string
}) {
  return (
    <a href={href} className="group block">
      <Card className="h-full border-gray-200 transition-shadow group-hover:shadow-md">
        <CardContent className="p-4">
          <Icon className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gray-700" />
          <div className="mt-2 text-xs text-gray-500">{label}</div>
          <div className="mt-0.5 text-base font-semibold text-gray-900">{value}</div>
        </CardContent>
      </Card>
    </a>
  )
}
