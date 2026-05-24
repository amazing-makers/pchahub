'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@amakers/ui'
import { SUPPORT_TYPE_LABEL, type SupportType } from '@/lib/hub-data'

const KEY = 'jangsanote:community:support'

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--brand-primary)] focus:outline-none'

export function SupportSubmitForm() {
  const [f, setF] = useState({
    title: '',
    type: 'support' as SupportType,
    summary: '',
    agency: '',
    target: '',
    amount: '',
    applyEnd: '',
    link: '',
  })
  const [done, setDone] = useState(false)

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((prev) => ({ ...prev, [k]: v }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const id = `community-sp-${Date.now()}`
    const entry = {
      id,
      title: f.title.trim(),
      type: f.type,
      summary: f.summary.trim(),
      agency: f.agency.trim() || '제보자',
      target: f.target.trim() || '소상공인·자영업자',
      amount: f.amount.trim() || '공고 참조',
      applyStart: new Date().toISOString().slice(0, 10),
      applyEnd: f.applyEnd,
      link: f.link.trim() || 'https://jangsanote.amakers.co.kr/support',
      tags: ['점주제보'],
      source: 'community' as const,
      status: 'pending' as const,
    }
    try {
      const prev = JSON.parse(window.localStorage.getItem(KEY) || '[]')
      window.localStorage.setItem(KEY, JSON.stringify([entry, ...prev]))
    } catch {
      /* ignore */
    }
    setDone(true)
    setTimeout(() => {
      window.location.href = '/support'
    }, 1300)
  }

  if (done) {
    return (
      <div
        className="flex items-center gap-2 rounded-xl border px-4 py-4 text-sm font-medium"
        style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
        role="status"
      >
        <Check className="h-5 w-5 shrink-0" />
        제보가 등록되었습니다. 검수 후 공개됩니다. 지원·이벤트 목록으로 이동합니다…
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="제목" required>
        <input className={inputCls} required value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="예: 우리 시장 디지털 전환 지원" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="유형">
          <select className={inputCls} value={f.type} onChange={(e) => set('type', e.target.value as SupportType)}>
            {(Object.keys(SUPPORT_TYPE_LABEL) as SupportType[]).map((t) => (
              <option key={t} value={t}>{SUPPORT_TYPE_LABEL[t]}</option>
            ))}
          </select>
        </Field>
        <Field label="마감일" required>
          <input type="date" className={inputCls} required value={f.applyEnd} onChange={(e) => set('applyEnd', e.target.value)} />
        </Field>
      </div>
      <Field label="내용" required>
        <textarea className={inputCls + ' min-h-[88px] resize-y'} required value={f.summary} onChange={(e) => set('summary', e.target.value)} placeholder="지원 내용·신청 방법을 간단히 적어주세요." />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="주관 기관">
          <input className={inputCls} value={f.agency} onChange={(e) => set('agency', e.target.value)} placeholder="예: ○○구청 / 상인회" />
        </Field>
        <Field label="지원 대상">
          <input className={inputCls} value={f.target} onChange={(e) => set('target', e.target.value)} placeholder="예: 관내 소상공인" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="지원 규모">
          <input className={inputCls} value={f.amount} onChange={(e) => set('amount', e.target.value)} placeholder="예: 점포당 200만원" />
        </Field>
        <Field label="공식 링크">
          <input type="url" className={inputCls} value={f.link} onChange={(e) => set('link', e.target.value)} placeholder="https://" />
        </Field>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" size="lg">제보 등록</Button>
        <a href="/support" className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:text-gray-900">취소</a>
      </div>
      <p className="text-xs text-gray-400">※ 제보는 관리자 검수 후 목록에 ‘점주 제보’로 공개됩니다(데모: 이 기기에 저장).</p>
    </form>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {children}
    </label>
  )
}
