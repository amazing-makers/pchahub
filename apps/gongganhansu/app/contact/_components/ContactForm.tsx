'use client'

import { useState } from 'react'

export default function GongganhansuContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    bizType: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const metadata: Record<string, string> = {}
      if (form.area) metadata.area = form.area
      if (form.bizType) metadata.bizType = form.bizType
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          subject: form.subject,
          message: form.message,
          type: 'quote',
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        }),
      })
      if (!res.ok) throw new Error('서버 오류')
      setStatus('success')
      setForm({ name: '', email: '', phone: '', area: '', bizType: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-lg font-semibold text-green-800">견적 문의가 접수되었습니다.</p>
        <p className="mt-1 text-sm text-green-600">빠른 시일 내에 견적을 안내해드리겠습니다.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-green-700 underline"
        >
          다시 문의하기
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="홍길동"
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            이메일 <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="example@email.com"
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">연락처</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="010-0000-0000"
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">공간 크기</label>
          <input
            name="area"
            value={form.area}
            onChange={handleChange}
            placeholder="예: 20평, 66㎡"
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">업종</label>
          <input
            name="bizType"
            value={form.bizType}
            onChange={handleChange}
            placeholder="예: 카페, 음식점, 사무실"
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          placeholder="인테리어 공사 내용"
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          문의 내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="공사 범위, 예산, 희망 시기 등을 적어주세요."
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
      </div>
      {status === 'error' && (
        <p className="text-sm text-red-600">오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:opacity-60"
      >
        {status === 'loading' ? '제출 중...' : '견적 문의하기'}
      </button>
    </form>
  )
}
