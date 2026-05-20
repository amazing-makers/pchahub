'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

interface SharePortfolioButtonProps {
  itemTitle: string
}

export function SharePortfolioButton({ itemTitle }: SharePortfolioButtonProps) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = `${itemTitle} — 공간의한수 시공 사례`
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
        'mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ' +
        (state === 'copied'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
      }
    >
      {state === 'copied' ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <Share2 className="h-3.5 w-3.5" />
      )}
      {state === 'copied' ? '링크 복사됨' : '사례 공유하기'}
    </button>
  )
}
