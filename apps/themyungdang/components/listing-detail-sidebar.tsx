'use client'

import { useEffect, useRef, useState } from 'react'
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
import { LISTINGS, type MockListing } from '@/lib/mock-data'
import { useFavorites } from '@/hooks/use-favorites'
import { useRecentlyViewed } from '@/hooks/use-recently-viewed'
import { showToast } from '@/hooks/use-toast'

// ── Phone number auto-formatter (Korean) ─────────────────────────────────────
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.startsWith('02')) {
    if (digits.length <= 2) return digits
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`
  }
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
}

function formatManwon(manwon: number): string {
  if (manwon >= 10000) {
    const eok = manwon / 10000
    return eok % 1 === 0 ? `${eok}억` : `${Math.round(eok * 10) / 10}억`
  }
  return `${formatNumber(manwon)}만`
}

// ── Inquiry Modal — with localStorage draft save ──────────────────────────────
const DRAFT_KEY = (id: string) => `inquiry-draft-${id}`

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
  const [hasDraft, setHasDraft] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)
  const draftKey = DRAFT_KEY(listing.id)

  // Load saved draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey)
      if (raw) {
        const d = JSON.parse(raw) as { name?: string; phone?: string; message?: string }
        if (d.name)    setName(d.name)
        if (d.phone)   setPhone(d.phone)
        if (d.message) setMessage(d.message)
        setHasDraft(true)
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist draft on every keystroke (debounced to 600ms)
  useEffect(() => {
    if (sent) return
    const id = setTimeout(() => {
      try {
        if (name || phone || message) {
          localStorage.setItem(draftKey, JSON.stringify({ name, phone, message }))
        } else {
          localStorage.removeItem(draftKey)
        }
      } catch { /* ignore */ }
    }, 600)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, phone, message, sent])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const clearDraft = () => {
    try { localStorage.removeItem(draftKey) } catch { /* ignore */ }
    setName(''); setPhone(''); setMessage(''); setHasDraft(false)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    try { localStorage.removeItem(draftKey) } catch { /* ignore */ }
    // Mock submit — no backend yet
    setSent(true)
    showToast('문의가 접수되었습니다. 영업일 기준 1일 이내 연락드립니다.', 'success', 5000)
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

        {/* Draft notice */}
        {hasDraft && !sent && (
          <div className="mb-4 flex items-center justify-between rounded-xl bg-amber-50 px-3.5 py-2.5">
            <span className="text-xs font-medium text-amber-700">이전에 작성한 내용이 있습니다.</span>
            <button onClick={clearDraft} className="text-xs font-semibold text-amber-600 hover:text-amber-800">
              지우기
            </button>
          </div>
        )}

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
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="홍길동"
                className="form-input"
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
                onChange={e => setPhone(formatPhone(e.target.value))}
                placeholder="010-0000-0000"
                inputMode="numeric"
                className="form-input"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-gray-700">
                <span>문의 내용</span>
                {(name || phone || message) && (
                  <span className="text-[11px] font-normal text-gray-400">자동 저장 중…</span>
                )}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="궁금한 점을 자유롭게 적어주세요."
                className="form-input resize-none"
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
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => showToast('링크가 복사되었습니다.', 'success'))
      .catch(() => showToast('링크 복사에 실패했습니다.', 'error'))
  }
}

// ── Recently-viewed mini strip ────────────────────────────────────────────────
function RecentlyViewedMini({ currentId }: { currentId: string }) {
  const { recentIds } = useRecentlyViewed()
  const items = recentIds
    .filter((id) => id !== currentId)
    .slice(0, 3)
    .map((id) => LISTINGS.find((l) => l.id === id))
    .filter((l): l is MockListing => l !== undefined)

  if (items.length === 0) return null

  return (
    <Card className="border-gray-200">
      <CardContent className="p-5">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          최근 본 매물
        </div>
        <div className="space-y-3">
          {items.map((l) => (
            <a key={l.id} href={`/listings/${l.id}`} className="group flex gap-3">
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={l.images[0]}
                  alt={l.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 text-sm font-medium text-gray-900 group-hover:text-gray-600">
                  {l.title}
                </div>
                <div className="mt-0.5 text-xs text-gray-500">
                  {l.region} · {l.area}평
                </div>
                <div className="mt-0.5 text-xs font-semibold text-gray-900">
                  {l.type === 'sale'
                    ? `매각 ${formatManwon(l.salePrice ?? 0)}`
                    : `월세 ${formatNumber(l.monthlyRent)}만`}
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props { listing: MockListing }

export default function ListingDetailSidebar({ listing }: Props) {
  const { favorites, toggle: toggleFav } = useFavorites()
  const isFav = favorites.has(listing.id)
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
                onClick={() => toggleFav(listing.id)}
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
                <Phone className="h-3.5 w-3.5" />
                {listing.contactPhone ?? '1544-0000'}
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

        {/* Recently-viewed mini */}
        <RecentlyViewedMini currentId={listing.id} />
      </div>

      {/* Inquiry modal — portal-like, fixed overlay */}
      {inquiryOpen && (
        <InquiryModal listing={listing} onClose={() => setInquiryOpen(false)} />
      )}
    </>
  )
}
