'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@amakers/ui'
import { recipeCoverFor } from '@/lib/community-images'
import { RECIPE_CATEGORIES, type RecipeDifficulty } from '@/lib/hub-data'

const KEY = 'jangsanote:community:recipes'
const DIFFICULTIES: RecipeDifficulty[] = ['쉬움', '보통', '어려움']

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--brand-primary)] focus:outline-none'

export function RecipeSubmitForm() {
  const [f, setF] = useState({
    title: '',
    category: '카페',
    difficulty: '쉬움' as RecipeDifficulty,
    cookTimeMin: 10,
    servings: '1인분',
    costPerWon: 1000,
    summary: '',
    ingredients: '',
    steps: '',
  })
  const [done, setDone] = useState(false)

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((prev) => ({ ...prev, [k]: v }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const id = `community-rc-${Date.now()}`
    const entry = {
      id,
      title: f.title.trim(),
      summary: f.summary.trim(),
      category: f.category,
      authorId: 'me',
      difficulty: f.difficulty,
      cookTimeMin: Number(f.cookTimeMin) || 0,
      servings: f.servings.trim() || '1인분',
      costPerWon: Number(f.costPerWon) || 0,
      ingredients: f.ingredients.split('\n').map((s) => s.trim()).filter(Boolean),
      steps: f.steps.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: ['점주제보', f.category],
      likes: 0,
      saves: 0,
      coverImage: recipeCoverFor(id, f.category),
      createdAt: new Date().toISOString().slice(0, 10),
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
      window.location.href = '/recipes'
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
        레시피가 등록되었습니다. 레시피 목록으로 이동합니다…
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="레시피 제목" required>
        <input className={inputCls} required value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="예: 원가 800원 시그니처 라떼" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="분류">
          <select className={inputCls} value={f.category} onChange={(e) => set('category', e.target.value)}>
            {RECIPE_CATEGORIES.filter((c) => c !== '전체').map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="난이도">
          <select className={inputCls} value={f.difficulty} onChange={(e) => set('difficulty', e.target.value as RecipeDifficulty)}>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="조리시간(분)">
          <input type="number" min={0} className={inputCls} value={f.cookTimeMin} onChange={(e) => set('cookTimeMin', Number(e.target.value))} />
        </Field>
        <Field label="분량">
          <input className={inputCls} value={f.servings} onChange={(e) => set('servings', e.target.value)} placeholder="1잔 / 2인분" />
        </Field>
        <Field label="원가(원)">
          <input type="number" min={0} className={inputCls} value={f.costPerWon} onChange={(e) => set('costPerWon', Number(e.target.value))} />
        </Field>
      </div>
      <Field label="소개" required>
        <textarea className={inputCls + ' min-h-[72px] resize-y'} required value={f.summary} onChange={(e) => set('summary', e.target.value)} placeholder="이 메뉴의 매장 활용 포인트를 적어주세요." />
      </Field>
      <Field label="재료 (한 줄에 하나씩)" required>
        <textarea className={inputCls + ' min-h-[96px] resize-y'} required value={f.ingredients} onChange={(e) => set('ingredients', e.target.value)} placeholder={'우유 250ml\n에스프레소 1샷\n시럽 15ml'} />
      </Field>
      <Field label="조리 순서 (한 줄에 한 단계)" required>
        <textarea className={inputCls + ' min-h-[120px] resize-y'} required value={f.steps} onChange={(e) => set('steps', e.target.value)} placeholder={'재료를 계량한다.\n베이스를 섞는다.\n잔에 담아 완성.'} />
      </Field>
      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" size="lg">레시피 등록</Button>
        <a href="/recipes" className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:text-gray-900">취소</a>
      </div>
      <p className="text-xs text-gray-400">※ 등록 레시피는 이 기기에 저장되어 목록에 ‘점주 제보’로 표시됩니다(데모).</p>
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
