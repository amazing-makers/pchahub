'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@amakers/ui'

interface RsvpButtonProps {
  meetingId: string
  meetingTitle: string
  isFree: boolean
  feeWon: number
  disabled?: boolean
  disabledLabel?: string
}

const STORAGE_KEY = 'jangsanote:rsvps'

interface RsvpEntry {
  meetingId: string
  meetingTitle: string
  registeredAt: string
}

function readRsvps(): RsvpEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as RsvpEntry[]) : []
  } catch {
    return []
  }
}

export function RsvpButton({
  meetingId,
  meetingTitle,
  isFree,
  feeWon,
  disabled = false,
  disabledLabel,
}: RsvpButtonProps) {
  const [registered, setRegistered] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setRegistered(readRsvps().some((r) => r.meetingId === meetingId))
    setHydrated(true)
  }, [meetingId])

  if (!hydrated) {
    return (
      <Button size="lg" className="w-full" disabled>
        {disabledLabel ?? (isFree ? '참여 신청' : '참여 신청 + 입금 안내 받기')}
      </Button>
    )
  }

  if (disabled) {
    return (
      <Button size="lg" className="w-full" disabled>
        {disabledLabel}
      </Button>
    )
  }

  const handleRsvp = () => {
    if (registered) {
      // 취소
      const updated = readRsvps().filter((r) => r.meetingId !== meetingId)
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // ignore
      }
      setRegistered(false)
      return
    }

    // 신청
    const entry: RsvpEntry = {
      meetingId,
      meetingTitle,
      registeredAt: new Date().toISOString().slice(0, 10),
    }
    try {
      const prev = readRsvps()
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...prev]))
    } catch {
      // ignore
    }
    setRegistered(true)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  if (showSuccess) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
        <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-600" />
        <p className="mt-2 text-sm font-semibold text-emerald-800">참여 신청 완료!</p>
        <p className="mt-1 text-xs text-emerald-700">
          주최자가 1일 이내 확인 메시지를 보냅니다.
        </p>
      </div>
    )
  }

  if (registered) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          신청 완료
        </div>
        <button
          type="button"
          onClick={handleRsvp}
          className="w-full text-center text-xs text-gray-400 hover:text-gray-700 underline"
        >
          신청 취소
        </button>
      </div>
    )
  }

  return (
    <Button size="lg" className="w-full gap-1" onClick={handleRsvp}>
      {isFree ? '참여 신청' : `참여 신청 + 입금 안내 받기`}
    </Button>
  )
}
