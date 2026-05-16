'use client'

import { useState } from 'react'
import { FileText, X } from 'lucide-react'
import { Button } from '@amakers/ui'

const IR_KEY = 'pchabridge:ir-requests'

interface IrRequestButtonProps {
  roundId: string
  brandName: string
}

export function IrRequestButton({ roundId, brandName }: IrRequestButtonProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [purpose, setPurpose] = useState('')
  const [done, setDone] = useState(false)

  function reset() {
    setName('')
    setEmail('')
    setPhone('')
    setPurpose('')
    setDone(false)
    setOpen(false)
  }

  function submit() {
    const entry = {
      id: `ir-${Date.now()}`,
      roundId,
      brandName,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      purpose: purpose.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
    }
    try {
      const raw = window.localStorage.getItem(IR_KEY)
      const prev: typeof entry[] = raw ? JSON.parse(raw) : []
      window.localStorage.setItem(IR_KEY, JSON.stringify([entry, ...prev]))
    } catch { /* ignore */ }
    setDone(true)
  }

  const isValid = name.trim().length > 0 && email.trim().length > 0

  return (
    <>
      <Button
        size="lg"
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <FileText className="mr-1.5 h-4 w-4" />
        IR 자료 받기
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">IR 자료 신청</h2>
              <button
                onClick={reset}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {done ? (
              <div className="mt-6 text-center">
                <div className="text-4xl">📄</div>
                <p className="mt-3 text-sm font-semibold text-gray-900">
                  IR 자료 요청이 접수되었습니다.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  영업일 1~2일 이내 입력하신 이메일로 발송됩니다.
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
                <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                  <span className="font-semibold">{brandName}</span> 투자 라운드 IR 자료를 요청합니다.
                  NDA 동의 후 영업일 기준 1~2일 이내 발송됩니다.
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
                    이메일 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investor@example.com"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    연락처 (선택)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    투자 목적 (선택)
                  </label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="예: 개인 투자자 / 벤처캐피탈 / 전략적 투자자"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  요청 시 표준 NDA에 동의한 것으로 간주됩니다.
                  자료는 투자 검토 목적 외 사용이 제한됩니다.
                </p>
                <button
                  onClick={submit}
                  disabled={!isValid}
                  className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  IR 자료 신청하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
