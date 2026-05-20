'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

interface ShareCaseButtonProps {
  caseTitle: string
}

export function ShareCaseButton({ caseTitle }: ShareCaseButtonProps) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = `${caseTitle} — 오픈런 캠페인 사례`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch { /* user cancelled */ }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        setState('copied')
        setTimeout(() => setState('idle'), 2000)
      } catch { /* ignore */ }
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-600 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
    >
      {state === 'copied' ? (
        <Check className="h-4 w-4 text-emerald-400" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {state === 'copied' ? '주소 복사됨' : '공유하기'}
    </button>
  )
}
