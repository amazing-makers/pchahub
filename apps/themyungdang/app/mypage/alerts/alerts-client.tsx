'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, Plus, Trash2 } from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { LISTING_CATEGORIES, TYPE_LABEL } from '@/lib/mock-data'
import type { ListingType } from '@/lib/mock-data'

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '제주', '전북', '경남', '경북']

const PRICE_RANGES = [
  { key: 'any',       label: '제한 없음' },
  { key: 'under-1',  label: '1억 미만' },
  { key: '1-3',      label: '1억 ~ 3억' },
  { key: '3-5',      label: '3억 ~ 5억' },
  { key: '5-10',     label: '5억 ~ 10억' },
  { key: 'over-10',  label: '10억 이상' },
]

interface AlertRule {
  id: string
  name: string
  regions: string[]
  categories: string[]
  types: ListingType[]
  priceRange: string
  enabled: boolean
  createdAt: string
}

const STORAGE_KEY = 'themyungdang:alertRules'

function newRule(): AlertRule {
  return {
    id: `alert-${Date.now()}`,
    name: '',
    regions: [],
    categories: [],
    types: [],
    priceRange: 'any',
    enabled: true,
    createdAt: new Date().toISOString().split('T')[0] ?? '',
  }
}

export function AlertsClient() {
  const [rules, setRules] = useState<AlertRule[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [drafting, setDrafting] = useState(false)
  const [draft, setDraft] = useState<AlertRule>(newRule())

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setRules(JSON.parse(raw) as AlertRule[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  function persist(updated: AlertRule[]) {
    setRules(updated)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  function toggleRule(id: string) {
    persist(rules.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  function deleteRule(id: string) {
    persist(rules.filter((r) => r.id !== id))
  }

  function saveDraft() {
    if (!draft.name.trim()) return
    persist([draft, ...rules])
    setDraft(newRule())
    setDrafting(false)
  }

  function toggleDraftRegion(region: string) {
    setDraft((prev) => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter((r) => r !== region)
        : [...prev.regions, region],
    }))
  }

  function toggleDraftCategory(cat: string) {
    setDraft((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }))
  }

  function toggleDraftType(type: ListingType) {
    setDraft((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }))
  }

  if (!hydrated) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2].map((i) => <div key={i} className="h-28 rounded-xl bg-gray-100" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Active rules */}
      {rules.length > 0 && (
        <div className="space-y-3">
          {rules.map((rule) => (
            <Card key={rule.id} className="border-gray-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {rule.enabled
                        ? <Bell className="h-4 w-4 text-[var(--brand-primary)]" />
                        : <BellOff className="h-4 w-4 text-gray-400" />}
                      <span className="text-sm font-semibold text-gray-900">{rule.name}</span>
                      <Badge variant={rule.enabled ? 'primary' : 'default'}>
                        {rule.enabled ? '알림 ON' : '알림 OFF'}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {rule.regions.length > 0
                        ? rule.regions.map((r) => (
                            <span key={r} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{r}</span>
                          ))
                        : <span className="text-xs text-gray-400">전국</span>}
                      {rule.categories.map((c) => {
                        const cat = LISTING_CATEGORIES.find((lc) => lc.key === c)
                        return <span key={c} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{cat?.label ?? c}</span>
                      })}
                      {rule.types.map((t) => (
                        <span key={t} className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">{TYPE_LABEL[t]}</span>
                      ))}
                      {rule.priceRange !== 'any' && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                          {PRICE_RANGES.find((p) => p.key === rule.priceRange)?.label}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-gray-400">등록일 {rule.createdAt}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    >
                      {rule.enabled ? '끄기' : '켜기'}
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-red-200 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {rules.length === 0 && !drafting && (
        <Card className="border-dashed border-gray-200">
          <CardContent className="p-10 text-center">
            <Bell className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-4 text-sm font-medium text-gray-600">설정된 알림이 없습니다</p>
            <p className="mt-1 text-xs text-gray-400">
              조건을 설정하면 새 매물이 등록될 때 알림을 보내드립니다.
            </p>
          </CardContent>
        </Card>
      )}

      {/* New rule form */}
      {drafting ? (
        <Card className="border-[var(--brand-primary)]/30 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <h2 className="text-base font-semibold text-gray-900">새 알림 조건 추가</h2>

            {/* Rule name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                알림 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="예: 강남 카페 양도"
                value={draft.name}
                onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
            </div>

            {/* Region */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                지역 <span className="text-gray-400">(미선택 시 전국)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => toggleDraftRegion(region)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      draft.regions.includes(region)
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                업종 <span className="text-gray-400">(미선택 시 전체)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {LISTING_CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => toggleDraftCategory(cat.key)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      draft.categories.includes(cat.key)
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                매물 유형 <span className="text-gray-400">(미선택 시 전체)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(TYPE_LABEL) as ListingType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleDraftType(t)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      draft.types.includes(t)
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {TYPE_LABEL[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">가격 범위</label>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((range) => (
                  <button
                    key={range.key}
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, priceRange: range.key }))}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      draft.priceRange === range.key
                        ? 'border-amber-500 bg-amber-500 text-white'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
              <Button
                size="md"
                onClick={saveDraft}
                disabled={!draft.name.trim()}
              >
                알림 저장
              </Button>
              <button
                type="button"
                onClick={() => { setDrafting(false); setDraft(newRule()) }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                취소
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <button
          type="button"
          onClick={() => setDrafting(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-4 text-sm text-gray-500 transition-colors hover:border-[var(--brand-primary)]/40 hover:text-[var(--brand-primary)]"
        >
          <Plus className="h-4 w-4" />
          새 알림 조건 추가
        </button>
      )}

      {/* Info */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-5 text-sm">
          <div className="font-semibold text-amber-900">알림 발송 방법</div>
          <ul className="mt-2 space-y-1 text-amber-800 text-xs">
            <li>· 카카오톡 알림 또는 이메일로 발송됩니다.</li>
            <li>· 하루 최대 5건까지 발송됩니다.</li>
            <li>· 실제 서비스 오픈 후 적용됩니다 (현재 mock 환경).</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
