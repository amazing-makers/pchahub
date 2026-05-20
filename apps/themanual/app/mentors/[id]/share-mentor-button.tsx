'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

interface ShareMentorButtonProps {
  mentorName: string
}

export function ShareMentorButton({ mentorName }: ShareMentorButtonProps) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = `${mentorName} 멘토 — 더메뉴얼`
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
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
    >
      {state === 'copied' ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Share2 className="h-3.5 w-3.5" />
      )}
      {state === 'copied' ? '복사됨' : '공유'}
    </button>
  )
}
