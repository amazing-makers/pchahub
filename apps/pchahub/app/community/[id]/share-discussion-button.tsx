'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

interface ShareDiscussionButtonProps {
  title: string
}

export function ShareDiscussionButton({ title }: ShareDiscussionButtonProps) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
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
        'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ' +
        (state === 'copied'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
      }
    >
      {state === 'copied' ? (
        <Check className="h-4 w-4 text-emerald-600" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {state === 'copied' ? '링크 복사됨' : '공유하기'}
    </button>
  )
}
