'use client'

import { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { Button } from '@amakers/ui'

const KEY = 'themyungdang:inquiries'

interface InquiryButtonProps {
  listingId: string
  listingTitle: string
}

export function InquiryButton({ listingId, listingTitle }: InquiryButtonProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const raw = window.localStorage.getItem(KEY)
      const existing: unknown[] = raw ? JSON.parse(raw) : []
      const entry = {
        id: `inq-${Date.now()}`,
        listingId,
        listingTitle,
        name,
        phone,
        message,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      const next = [entry, ...existing].slice(0, 20)
      window.localStorage.setItem(KEY, JSON.stringify(next))
    } catch { /* ignore */ }
    setDone(true)
  }

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
        <div className="text-sm font-semibold text-emerald-800">문의가 접수되었습니다</div>
        <p className="mt-1 text-xs text-emerald-700">영업일 기준 1-2일 내에 연락드립니다.</p>
      </div>
    )
  }

  if (!open) {
    return (
      <Button
        size="md"
        className="w-full gap-2"
        onClick={() => setOpen(true)}
      >
        <MessageSquare className="h-4 w-4" />
        매물 문의하기
      </Button>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-900">매물 문의</div>
        <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
        />
        <input
          required
          placeholder="연락처"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
        />
        <textarea
          placeholder="문의 내용 (선택)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
        />
        <Button type="submit" size="md" className="w-full">
          문의 접수
        </Button>
      </form>
    </div>
  )
}
