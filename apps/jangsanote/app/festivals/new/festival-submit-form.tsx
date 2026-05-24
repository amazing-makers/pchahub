'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@amakers/ui'
import { festivalCoverFor } from '@/lib/community-images'
import { FESTIVAL_TYPE_LABEL, type FestivalType } from '@/lib/hub-data'

const KEY = 'jangsanote:community:festivals'
const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '전북', '전남', '경북', '경남', '강원', '충북', '충남', '제주']

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--brand-primary)] focus:outline-none'

export function FestivalSubmitForm() {
  const [f, setF] = useState({
    title: '',
    type: 'expo' as FestivalType,
    summary: '',
    venue: '',
    region: '서울',
    startDate: '',
    endDate: '',
    organizer: '',
    website: '',
    isFree: true,
  })
  const [done, setDone] = useState(false)

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((prev) => ({ ...prev, [k]: v }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const id = `community-fs-${Date.now()}`
    const entry = {
      id,
      title: f.title.trim(),
      type: f.type,
      summary: f.summary.trim(),
      venue: f.venue.trim(),
      region: f.region,
      startDate: f.startDate,
      endDate: f.endDate || f.startDate,
      organizer: f.organizer.trim() || '제보자',
      isFree: f.isFree,
      feeNote: f.isFree ? '무료' : '유료',
      website: f.website.trim() || 'https://jangsanote.amakers.co.kr/festivals',
      tags: ['점주제보'],
      coverImage: festivalCoverFor(id),
      source: 'community' as const,
    }
    try {
      const prev = JSON.parse(window.localStorage.getItem(KEY) || '[]')
      window.localStorage.setItem(KEY, JSON.stringify([entry, ...prev]))
    } catch {
      /* ignore */
    }
    setDone(true)
    setTimeout(() => {
      window.location.href = '/festivals'
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
        제보가 등록되었습니다. 축제·박람회 목록으로 이동합니다…
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="행사명" required>
        <input className={inputCls} required value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="예: 우리 동네 플리마켓" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="유형">
          <select className={inputCls} value={f.type} onChange={(e) => set('type', e.target.value as FestivalType)}>
            {(Object.keys(FESTIVAL_TYPE_LABEL) as FestivalType[]).map((t) => (
              <option key={t} value={t}>{FESTIVAL_TYPE_LABEL[t]}</option>
            ))}
          </select>
        </Field>
        <Field label="지역">
          <select className={inputCls} value={f.region} onChange={(e) => set('region', e.target.value)}>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="소개" required>
        <textarea className={inputCls + ' min-h-[88px] resize-y'} required value={f.summary} onChange={(e) => set('summary', e.target.value)} placeholder="행사 내용·참가 방법을 간단히 적어주세요." />
      </Field>
      <Field label="장소" required>
        <input className={inputCls} required value={f.venue} onChange={(e) => set('venue', e.target.value)} placeholder="예: 한옥마을 광장" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="시작일" required>
          <input type="date" className={inputCls} required value={f.startDate} onChange={(e) => set('startDate', e.target.value)} />
        </Field>
        <Field label="종료일">
          <input type="date" className={inputCls} value={f.endDate} onChange={(e) => set('endDate', e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="주최/주관">
          <input className={inputCls} value={f.organizer} onChange={(e) => set('organizer', e.target.value)} placeholder="예: 우리상점가 상인회" />
        </Field>
        <Field label="공식 링크">
          <input type="url" className={inputCls} value={f.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" />
        </Field>
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={f.isFree} onChange={(e) => set('isFree', e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
        입장 무료
      </label>
      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" size="lg">제보 등록</Button>
        <a href="/festivals" className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:text-gray-900">취소</a>
      </div>
      <p className="text-xs text-gray-400">※ 제보 내용은 이 기기에 저장되어 목록에 ‘점주 제보’로 표시됩니다(데모).</p>
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
