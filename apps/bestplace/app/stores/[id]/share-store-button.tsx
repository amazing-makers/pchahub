'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'
import { Button } from '@amakers/ui'

interface ShareStoreButtonProps {
  storeName: string
}

export function ShareStoreButton({ storeName }: ShareStoreButtonProps) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = `${storeName} — 베스트플레이스 우수 매장`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch { /* user cancelled or not supported */ }
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
    <Button
      size="md"
      variant="outline"
      onClick={share}
      className={
        'gap-1.5 transition-colors ' +
        (state === 'copied'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
          : '')
      }
    >
      {state === 'copied' ? (
        <Check className="h-4 w-4 text-emerald-600" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {state === 'copied' ? '복사됨' : '공유'}
    </Button>
  )
}
