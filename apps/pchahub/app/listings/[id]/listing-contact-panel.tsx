'use client'

import { useState } from 'react'
import { MessageSquare, Phone, X } from 'lucide-react'
import { Button } from '@amakers/ui'

const CONTACTS_KEY = 'pchahub:listing-contacts'

interface ListingContactPanelProps {
  listingId: string
  listingTitle: string
}

type ContactType = 'consultation' | 'visit' | null

export function ListingContactPanel({ listingId, listingTitle }: ListingContactPanelProps) {
  const [open, setOpen] = useState<ContactType>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [done, setDone] = useState(false)

  function reset() {
    setName('')
    setPhone('')
    setMessage('')
    setVisitDate('')
    setDone(false)
    setOpen(null)
  }

  function submit() {
    const entry = {
      id: `lc-${Date.now()}`,
      listingId,
      listingTitle,
      type: open,
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
      visitDate: visitDate || null,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
    }
    try {
      const raw = window.localStorage.getItem(CONTACTS_KEY)
      const prev: typeof entry[] = raw ? JSON.parse(raw) : []
      window.localStorage.setItem(CONTACTS_KEY, JSON.stringify([entry, ...prev]))
    } catch { /* ignore */ }
    setDone(true)
  }

  const isValid = name.trim().length > 0 && phone.trim().length > 0

  return (
    <>
      <Button size="lg" className="w-full gap-1" onClick={() => setOpen('consultation')}>
        <Phone className="h-4 w-4" />
        부동산 상담 신청
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-full gap-1"
        onClick={() => setOpen('visit')}
      >
        <MessageSquare className="h-4 w-4" />
        현장 방문 예약
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                {open === 'consultation' ? '부동산 상담 신청' : '현장 방문 예약'}
              </h2>
              <button
                onClick={reset}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {done ? (
              <div className="mt-6 text-center">
                <div className="text-4xl">✅</div>
                <p className="mt-3 text-sm font-semibold text-gray-900">
                  {open === 'consultation' ? '상담 신청이 완료되었습니다.' : '방문 예약이 완료되었습니다.'}
                </p>
                <p className="mt-1 text-xs text-gray-500">담당자가 확인 후 연락드립니다.</p>
                <button
                  onClick={reset}
                  className="mt-5 w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  닫기
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 line-clamp-1">
                  {listingTitle}
                </p>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    성함 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    연락처 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>
                {open === 'visit' && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      희망 방문 일자
                    </label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                    />
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    문의 내용 (선택)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder={
                      open === 'consultation'
                        ? '권리금 협의 가능 여부, 임대차 조건 등 궁금한 점을 적어주세요.'
                        : '방문 가능 시간대나 확인하고 싶은 사항을 적어주세요.'
                    }
                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>
                <button
                  onClick={submit}
                  disabled={!isValid}
                  className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {open === 'consultation' ? '상담 신청하기' : '방문 예약하기'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
