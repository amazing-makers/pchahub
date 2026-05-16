'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

const REGISTER_KEY = 'pchabridge:investment-registrations'

const ROUND_TYPES = [
  { value: 'seed', label: 'Seed 라운드' },
  { value: 'series_a', label: 'Series A' },
  { value: 'series_b', label: 'Series B' },
  { value: 'bridge', label: 'Bridge 라운드' },
  { value: 'franchise_bond', label: '가맹점 채권' },
]

const CATEGORIES = ['치킨', '카페', '한식', '일식', '분식', '디저트', '음료', '주점', '편의점', '교육', '기타']

export function InvestmentRegisterForm() {
  const [brandName, setBrandName] = useState('')
  const [category, setCategory] = useState('')
  const [roundType, setRoundType] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [minInvestment, setMinInvestment] = useState('')
  const [expectedROI, setExpectedROI] = useState('')
  const [closeDate, setCloseDate] = useState('')
  const [hook, setHook] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [done, setDone] = useState(false)

  const isValid =
    brandName.trim().length > 0 &&
    category.length > 0 &&
    roundType.length > 0 &&
    targetAmount.trim().length > 0 &&
    contactName.trim().length > 0 &&
    contactPhone.trim().length > 0

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const entry = {
      id: `ir-reg-${Date.now()}`,
      brandName: brandName.trim(),
      category,
      roundType,
      targetAmount: targetAmount.trim(),
      minInvestment: minInvestment.trim(),
      expectedROI: expectedROI.trim(),
      closeDate,
      hook: hook.trim(),
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
    }
    try {
      const raw = window.localStorage.getItem(REGISTER_KEY)
      const prev: typeof entry[] = raw ? JSON.parse(raw) : []
      window.localStorage.setItem(REGISTER_KEY, JSON.stringify([entry, ...prev]))
    } catch { /* ignore */ }
    setDone(true)
  }

  if (done) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-10 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h2 className="mt-4 text-h3 font-bold text-gray-900">등록 신청 완료</h2>
          <p className="mt-2 text-sm text-gray-500">
            amakers 팀이 영업일 1~2일 이내 확인 후 연락드립니다.
            등록 승인 후 투자자에게 라운드 정보가 공개됩니다.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href="/investments"
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              투자 라운드 보기
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-base font-semibold text-gray-900">브랜드 정보</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                브랜드명 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="예: 교촌치킨"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                업종 <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
              >
                <option value="">선택</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-base font-semibold text-gray-900">라운드 조건</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                라운드 유형 <span className="text-rose-500">*</span>
              </label>
              <select
                value={roundType}
                onChange={(e) => setRoundType(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
              >
                <option value="">선택</option>
                {ROUND_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                목표 모집액 (만원) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="예: 50000"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                최소 투자 단위 (만원)
              </label>
              <input
                type="number"
                value={minInvestment}
                onChange={(e) => setMinInvestment(e.target.value)}
                placeholder="예: 1000"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                예상 연간 ROI (%)
              </label>
              <input
                type="number"
                value={expectedROI}
                onChange={(e) => setExpectedROI(e.target.value)}
                placeholder="예: 12"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                모집 마감일
              </label>
              <input
                type="date"
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              한 줄 투자 포인트
            </label>
            <input
              type="text"
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              placeholder="예: 연평균 매출 3억, 5년 연속 흑자 프랜차이즈의 가맹점 채권"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-base font-semibold text-gray-900">담당자 연락처</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                담당자명 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
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
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={!isValid}>
          투자 유치 등록 신청
        </Button>
      </div>
    </form>
  )
}
