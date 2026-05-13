'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  CheckCircle2,
  Heart,
  MessageSquare,
  Phone,
  Send,
  Share2,
  X,
} from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import type { MockListing } from '@/lib/mock-data'

// ── Shared key (same as listing-card + map-search-client) ─────────────────────
const FAV_KEY = 'tmyd-fav'

function formatManwon(manwon: number): string {
  if (manwon >= 10000) {
    const eok = manwon / 10000
    return eok % 1 === 0 ? `${eok}억` : `${Math.round(eok * 10) / 10}억`
  }
  return `${formatNumber(manwon)}만`
}

function useFavorite(id: string) {
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY)
      if (raw) setIsFav((JSON.parse(raw) as string[]).includes(id))
    } catch { /* ignore */ }
  }, [id])

  const toggle = useCallback(() => {
    setIsFav(prev => {
      const next = !prev
      try {
        const raw = localStorage.getItem(FAV_KEY)
        const arr: string[] = raw ? JSON.parse(raw) : []
        const updated = next ? [...arr, id] : arr.filter(x => x !== id)
        localStorage.setItem(FAV_KEY, JSON.stringify(updated))
      } catch { /* ignore */ }
      return next
    })
  }, [id])

  return { isFav, toggle }
}

// ── Inquiry Modal ─────────────────────────────────────────────────────────────
function InquiryModal({
  listing,
  onClose,
}: {
  listing: MockListing
  onClose: () => void
}) {
  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [message, setMessage] = useState('')
  const [sent,    setSent]    = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    // Mock submit — no backend yet
    setSent(true)
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={e => { if (e.target === backdropRef.current) onClose() }}
    >
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">매물 문의하기</h2>
            <p className="mt-0.5 line-clamp-1 text-sm text-gray-500">{listing.title}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {sent ? (
          /* Success state */
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-base font-semibold text-gray-900">문의가 접수되었습니다</p>
            <p className="text-sm text-gray-500">
              영업일 기준 1일 이내에 연락드리겠습니다.
            </p>
            <Button onClick={onClose} className="mt-2 w-full">
              확인
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                이름 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                연락처 <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                문의 내용
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="궁금한 점을 자유롭게 적어주세요."
                className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <Button type="submit" size="lg" className="w-full gap-1.5">
              <Send className="h-4 w-4" />
              문의 전송
            </Button>
            <p className="text-center text-xs text-gray-400">
              개인정보는 매물 문의 목적으로만 사용됩니다.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Share helper ──────────────────────────────────────────────────────────────
function shareOrCopy(text: string) {
  if (typeof navigator === 'undefined') return
  if (navigator.share) {
    navigator.share({ title: text, url: window.location.href }).catch(() => {})
  } else {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    // A tiny toast would be ideal; keeping it simple for now
    alert('링크가 복사되었습니다.')
  }
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props { listing: MockListing }

export default function ListingDetailSidebar({ listing }: Props) {
  const { isFav, toggle } = useFavorite(listing.id)
  const [inquiryOpen, setInquiryOpen] = useState(false)

  return (
    <>
      <div className="space-y-4">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-5">

            {/* Price */}
            {listing.type === 'sale' ? (
              <div>
                <div className="text-xs text-gray-500">매각가</div>
                <div className="mt-0.5 text-h3 font-bold text-gray-900">
                  {formatManwon(listing.salePrice ?? 0)}
                  <span className="ml-1 text-base font-medium text-gray-500">원</span>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="text-xs text-gray-500">월세 / 보증금</div>
                  <div className="mt-0.5 text-h4 font-bold text-gray-900">
                    {formatNumber(listing.monthlyRent)}만
                    <span className="text-sm font-medium text-gray-500">
                      {' '}/ 보증금 {formatNumber(listing.deposit)}만
                    </span>
                  </div>
                </div>
                {listing.rightFee !== undefined && (
                  <div>
                    <div className="text-xs text-gray-500">권리금</div>
                    <div className="mt-0.5 text-base font-semibold text-gray-900">
                      {listing.rightFee === 0 ? '없음' : `${formatNumber(listing.rightFee)}만`}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Actions */}
            <Button
              size="lg"
              className="w-full gap-1.5"
              onClick={() => setInquiryOpen(true)}
            >
              <MessageSquare className="h-4 w-4" />
              매물 문의하기
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={toggle}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                  isFav
                    ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                {isFav ? '찜 해제' : '찜하기'}
              </button>
              <button
                type="button"
                onClick={() => shareOrCopy(listing.title)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4" />
                공유
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Owner/agent card */}
        <Card className="border-gray-200">
          <CardContent className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              등록자
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-sm font-medium text-gray-900">
                {listing.ownerType === 'agent' ? listing.agencyName : '직거래'}
              </div>
              <div className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                <Phone className="h-3.5 w-3.5" /> 1544-0000
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
              <div className="flex items-center gap-1 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                안전 거래 지원 매물
              </div>
              <p className="mt-1">에스크로 결제와 표준 계약서 검토를 무료로 제공합니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inquiry modal — portal-like, fixed overlay */}
      {inquiryOpen && (
        <InquiryModal listing={listing} onClose={() => setInquiryOpen(false)} />
      )}
    </>
  )
}
