'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

interface ShareRoundButtonProps {
  roundLabel: string
}

export function ShareRoundButton({ roundLabel }: ShareRoundButtonProps) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = `${roundLabel} — 프차브릿지 투자 라운드`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch { /* ignore */ }
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
      className={
        'inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ' +
        (state === 'copied'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-gray-600 bg-white/10 text-white hover:bg-white/20')
      }
    >
      {state === 'copied' ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {state === 'copied' ? '주소 복사됨' : '공유하기'}
    </button>
  )
}
