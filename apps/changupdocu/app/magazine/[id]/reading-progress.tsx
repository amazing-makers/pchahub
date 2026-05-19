'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      setProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)))
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-gray-100">
      <div
        className="h-full transition-[width] duration-100 ease-linear"
        style={{ width: `${progress}%`, background: 'var(--brand-primary)' }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`읽기 진행률 ${progress}%`}
      />
    </div>
  )
}
