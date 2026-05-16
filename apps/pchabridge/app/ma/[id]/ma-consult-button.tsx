'use client'

import { useState } from 'react'
import { Briefcase, X } from 'lucide-react'
import { Button } from '@amakers/ui'

const CONSULT_KEY = 'pchabridge:ma-consults'

interface MaConsultButtonProps {
  listingId: string
  brandName: string
}

export function MaConsultButton({ listingId, brandName }: MaConsultButtonProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [question, setQuestion] = useState('')
  const [done, setDone] = useState(false)

  function reset() {
    setName('')
    setPhone('')
    setRole('')
    setQuestion('')
    setDone(false)
    setOpen(false)
  }

  function submit() {
    const entry = {
      id: `mac-${Date.now()}`,
      listingId,
      brandName,
      name: name.trim(),
      phone: phone.trim(),
      role: role.trim(),
      question: question.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
    }
    try {
      const raw = window.localStorage.getItem(CONSULT_KEY)
      const prev: typeof entry[] = raw ? JSON.parse(raw) : []
      window.localStorage.setItem(CONSULT_KEY, JSON.stringify([entry, ...prev]))
    } catch { /* ignore */ }
    setDone(true)
  }

  const isValid = name.trim().length > 0 && phone.trim().length > 0

  return (
    <>
      <Button
        size="lg"
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <Briefcase className="mr-1.5 h-4 w-4" />
        amakers 자문 받기
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">M&A 자문 신청</h2>
              <button
                onClick={reset}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {done ? (
              <div className="mt-6 text-center">
                <div className="text-4xl">🤝</div>
                <p className="mt-3 text-sm font-semibold text-gray-900">
                  자문 신청이 접수되었습니다.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  amakers M&A 팀이 영업일 1일 이내 연락드립니다.
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
                <p className="rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-800">
                  <span className="font-semibold">{brandName}</span> M&A 자문 신청입니다.
                  amakers 팀이 법무·실사·계약 전 과정을 지원합니다.
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
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    역할 (선택)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white"
                  >
                    <option value="">선택해주세요</option>
                    <option value="buyer">인수 희망자 (매수인)</option>
                    <option value="seller">매각 희망자 (매도인)</option>
                    <option value="advisor">자문사 / 중개인</option>
                    <option value="investor">투자자</option>
                    <option value="other">기타</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    문의 내용 (선택)
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={3}
                    placeholder="실사 일정, 가격 협의, 법무 자문 범위 등 궁금한 점을 남겨주세요."
                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>
                <button
                  onClick={submit}
                  disabled={!isValid}
                  className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  자문 신청하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
