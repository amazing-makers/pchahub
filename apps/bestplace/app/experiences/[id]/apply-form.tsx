'use client'

import { useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { Button } from '@amakers/ui'
import { CAMPAIGN_TYPE_COLOR, CAMPAIGN_TYPE_LABEL, type CampaignType } from '@/lib/mock-experiences'

interface Props {
  campaignId: string
  campaignType: CampaignType
}

export function ExperienceApplyForm({ campaignId, campaignType }: Props) {
  const [name, setName] = useState('')
  const [sns, setSns] = useState('')
  const [reason, setReason] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isValid = name.trim() && sns.trim() && reason.trim().length >= 20 && agreed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    try {
      const raw = window.localStorage.getItem('bestplace:experience-applications')
      const prev: object[] = raw ? (JSON.parse(raw) as object[]) : []
      window.localStorage.setItem(
        'bestplace:experience-applications',
        JSON.stringify([
          { id: `app-${Date.now()}`, campaignId, name, sns, reason, appliedAt: new Date().toISOString() },
          ...prev,
        ]),
      )
    } catch {
      // ignore
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mt-5 text-center">
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: 'var(--brand-primary)' }}
        >
          <CheckCircle2 className="h-6 w-6 text-white" />
        </div>
        <p className="mt-3 text-sm font-semibold text-gray-900">지원이 완료되었습니다!</p>
        <p className="mt-1 text-xs text-gray-500">마감 후 2~3일 이내 이메일로 결과를 안내해드립니다.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700">
          이름 <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">
          SNS 계정 <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={sns}
          onChange={(e) => setSns(e.target.value)}
          placeholder="@instagram_id 또는 블로그 URL"
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">
          지원 동기 <span className="text-rose-500">*</span>
          <span className="ml-1 font-normal text-gray-400">({reason.length}/20자 이상)</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="이 캠페인에 지원하는 이유를 20자 이상 작성해주세요."
          rows={3}
          className="mt-1 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          required
        />
      </div>
      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 shrink-0"
        />
        [필수] 개인정보가 해당 매장 캠페인 선발 목적으로 사용됨에 동의합니다.
      </label>
      <Button
        type="submit"
        size="lg"
        className="w-full gap-1"
        disabled={!isValid}
        style={isValid ? { background: CAMPAIGN_TYPE_COLOR[campaignType] } : undefined}
      >
        <Send className="h-4 w-4" />
        {CAMPAIGN_TYPE_LABEL[campaignType]} 지원하기
      </Button>
    </form>
  )
}
