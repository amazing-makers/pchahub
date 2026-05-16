'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, PlayCircle } from 'lucide-react'
import { Button } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'

const ENROLLMENTS_KEY = 'themanual:enrollments'

interface EnrollButtonProps {
  courseId: string
  courseTitle: string
  isFree: boolean
  price: number
}

interface Enrollment {
  courseId: string
  enrolledAt: string
}

export function EnrollButton({ courseId, courseTitle, isFree, price }: EnrollButtonProps) {
  const [enrolled, setEnrolled] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ENROLLMENTS_KEY)
      const list: Enrollment[] = raw ? (JSON.parse(raw) as Enrollment[]) : []
      setEnrolled(list.some((e) => e.courseId === courseId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [courseId])

  const enroll = () => {
    try {
      const raw = window.localStorage.getItem(ENROLLMENTS_KEY)
      const list: Enrollment[] = raw ? (JSON.parse(raw) as Enrollment[]) : []
      if (!list.some((e) => e.courseId === courseId)) {
        list.unshift({ courseId, enrolledAt: new Date().toISOString().slice(0, 10) })
        window.localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(list))
      }
    } catch { /* ignore */ }
    setEnrolled(true)
    setShowPayment(false)
  }

  if (!hydrated) {
    return (
      <Button size="lg" className="w-full gap-1" disabled>
        <PlayCircle className="h-4 w-4" />
        {isFree ? '바로 수강 시작' : '결제하고 수강 시작'}
      </Button>
    )
  }

  if (enrolled) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
        <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-600" />
        <div className="mt-1 text-sm font-semibold text-emerald-800">수강 중인 강의입니다</div>
        <a
          href="/mypage"
          className="mt-2 inline-block text-xs font-medium text-emerald-700 hover:underline"
        >
          마이페이지에서 이어보기 →
        </a>
      </div>
    )
  }

  if (!isFree && showPayment) {
    return (
      <div className="space-y-3 rounded-xl border border-[var(--brand-primary)] p-4">
        <div className="text-sm font-semibold text-gray-900">{courseTitle}</div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">결제 금액</span>
          <span className="font-bold text-gray-900">{formatNumber(price)}원</span>
        </div>
        <Button size="lg" className="w-full gap-1" onClick={enroll}>
          <CheckCircle2 className="h-4 w-4" />
          결제 확인 (Mock)
        </Button>
        <button
          type="button"
          onClick={() => setShowPayment(false)}
          className="w-full text-center text-xs text-gray-400 hover:text-gray-600"
        >
          취소
        </button>
        <p className="text-center text-[11px] text-gray-400">
          * 실제 결제 없이 수강 등록만 됩니다 (개발 환경)
        </p>
      </div>
    )
  }

  return (
    <Button
      size="lg"
      className="w-full gap-1"
      onClick={isFree ? enroll : () => setShowPayment(true)}
    >
      <PlayCircle className="h-4 w-4" />
      {isFree ? '바로 수강 시작' : `결제하고 수강 시작 (${formatNumber(price)}원)`}
    </Button>
  )
}
