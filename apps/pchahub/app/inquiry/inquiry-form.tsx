'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { BRANDS } from '@/lib/mock-data'

const KEY = 'pchahub:inquiries'

const ROLE_OPTIONS = [
  { value: 'prospect', label: '예비 창업자' },
  { value: 'franchisee', label: '기존 가맹점주' },
  { value: 'investor', label: '투자자' },
  { value: 'other', label: '기타' },
]

const BUDGET_OPTIONS = [
  { value: 'under-3000', label: '3,000만원 이하' },
  { value: '3000-5000', label: '3,000 ~ 5,000만원' },
  { value: '5000-1e', label: '5,000만 ~ 1억원' },
  { value: 'over-1e', label: '1억원 이상' },
  { value: 'unknown', label: '아직 모름' },
]

export function InquiryPageContent() {
  const searchParams = useSearchParams()
  const brandId = searchParams.get('brand') ?? ''
  const brand = BRANDS.find((b) => b.id === brandId)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('prospect')
  const [budget, setBudget] = useState('')
  const [region, setRegion] = useState('')
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const raw = window.localStorage.getItem(KEY)
      const existing: unknown[] = raw ? JSON.parse(raw) : []
      const entry = {
        id: `inq-${Date.now()}`,
        brandId,
        brandName: brand?.name ?? brandId,
        name,
        phone,
        email,
        role,
        budget,
        region,
        message,
        status: 'pending',
        statusLabel: '본사 응답 대기',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      window.localStorage.setItem(KEY, JSON.stringify([entry, ...existing].slice(0, 20)))
    } catch { /* ignore */ }
    setDone(true)
  }

  if (done) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
          <h2 className="mt-4 text-h3 font-bold text-gray-900">상담 신청 완료</h2>
          <p className="mt-2 text-sm text-gray-500">
            {brand ? `${brand.name}` : '해당 브랜드'} 본사에서 영업일 24시간 이내에 연락드립니다.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="/mypage">
              <Button variant="outline">내 상담 내역</Button>
            </a>
            <a href="/brands">
              <Button>다른 브랜드 보기</Button>
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6">
        {brand && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <span
              className="h-10 w-10 shrink-0 rounded-lg"
              style={{ background: brand.logoColor }}
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900">{brand.name}</div>
              <div className="text-xs text-gray-500">{brand.categoryLabel}</div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">이름 *</label>
              <input required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">연락처 *</label>
              <input required value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">신청자 유형 *</label>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((o) => (
                <button type="button" key={o.value}
                  onClick={() => setRole(o.value)}
                  className={
                    'rounded-full border px-3 py-1.5 text-sm transition-colors ' +
                    (role === o.value
                      ? 'border-transparent text-white'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50')
                  }
                  style={role === o.value ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : {}}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">창업 예산</label>
            <select value={budget} onChange={(e) => setBudget(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
            >
              <option value="">선택하세요</option>
              {BUDGET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">희망 지역</label>
            <input value={region} onChange={(e) => setRegion(e.target.value)}
              placeholder="예: 서울 강남구, 경기 성남시"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">추가 문의사항</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)}
              rows={4} className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            가맹 상담 신청
          </Button>
          <p className="text-center text-xs text-gray-400">
            개인정보는 가맹 상담 목적으로만 사용됩니다
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
