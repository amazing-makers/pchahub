'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'
import { Button } from '@amakers/ui'

interface ShareListingButtonProps {
  listingTitle: string
}

export function ShareListingButton({ listingTitle }: ShareListingButtonProps) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = `${listingTitle} — 프차허브 매물`
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
        'w-full justify-between gap-1.5 transition-colors ' +
        (state === 'copied'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
          : '')
      }
    >
      <span className="inline-flex items-center gap-1.5">
        {state === 'copied' ? (
          <Check className="h-4 w-4 text-emerald-600" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        {state === 'copied' ? '링크 복사됨' : '매물 공유하기'}
      </span>
    </Button>
  )
}
