'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { Button } from '@amakers/ui'

const CONTACTS_KEY = 'jangsanote:meeting-contacts'

interface MeetingContactButtonProps {
  meetingId: string
  meetingTitle: string
  hostHandle: string
}

export function MeetingContactButton({
  meetingId,
  meetingTitle,
  hostHandle,
}: MeetingContactButtonProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)

  function reset() {
    setMessage('')
    setDone(false)
    setOpen(false)
  }

  function submit() {
    const entry = {
      id: `mc-${Date.now()}`,
      meetingId,
      meetingTitle,
      hostHandle,
      message: message.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    }
    try {
      const raw = window.localStorage.getItem(CONTACTS_KEY)
      const prev: typeof entry[] = raw ? JSON.parse(raw) : []
      window.localStorage.setItem(CONTACTS_KEY, JSON.stringify([entry, ...prev]))
    } catch { /* ignore */ }
    setDone(true)
  }

  return (
    <>
      <Button
        size="lg"
        variant="outline"
        className="w-full gap-1"
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="h-4 w-4" />
        주최자에게 문의
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">주최자에게 문의</h2>
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
                  문의가 전달되었습니다.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  주최자 <strong>{hostHandle}</strong>님이 확인 후 답변드립니다.
                </p>
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
                  {meetingTitle}
                </p>
                <div className="rounded-lg border border-gray-100 bg-amber-50/40 px-3 py-2 text-xs text-gray-600">
                  주최자: <strong>{hostHandle}</strong>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    문의 내용 <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="모임 장소, 참가비 납부 방법, 사전 준비물 등 궁금한 점을 남겨주세요."
                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>
                <button
                  onClick={submit}
                  disabled={message.trim().length === 0}
                  className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  문의 보내기
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
