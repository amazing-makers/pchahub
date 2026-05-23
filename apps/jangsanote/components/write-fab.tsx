'use client'

import { PencilLine } from 'lucide-react'

export function WriteFAB() {
  return (
    <a
      href="/write"
      className="fixed bottom-20 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg text-white transition-transform hover:scale-105 active:scale-95 md:hidden"
      style={{ background: 'var(--brand-primary)' }}
      aria-label="글쓰기"
    >
      <PencilLine className="h-6 w-6" />
    </a>
  )
}
