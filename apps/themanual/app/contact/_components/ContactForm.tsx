'use client'

import { useState } from 'react'

export default function ThemanualContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
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
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          subject: form.subject,
          message: form.message,
          type: 'mentor',
          metadata: form.area ? { area: form.area } : undefined,
        }),
      })
      if (!res.ok) throw new Error('서버 오류')
      setStatus('success')
      setForm({ name: '', email: '', phone: '', area: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-lg font-semibold text-green-800">상담 신청이 접수되었습니다.</p>
        <p className="mt-1 text-sm text-green-600">빠른 시일 내에 답변드리겠습니다.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-green-700 underline"
        >
          다시 신청하기
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
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">상담 분야</label>
        <input
          name="area"
          value={form.area}
          onChange={handleChange}
          placeholder="예: 외식업 창업, 프랜차이즈 계약 검토"
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
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
          placeholder="상담 받고 싶은 분야"
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
          placeholder="상담 내용을 자세히 적어주세요."
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
        {status === 'loading' ? '제출 중...' : '상담 신청하기'}
      </button>
    </form>
  )
}
