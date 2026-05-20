'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

interface ShareContractorButtonProps {
  contractorName: string
}

export function ShareContractorButton({ contractorName }: ShareContractorButtonProps) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = `${contractorName} — 공간한수 시공사`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // user cancelled — fall through to clipboard copy
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        setState('copied')
        setTimeout(() => setState('idle'), 2000)
      } catch {
        // ignore
      }
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
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
