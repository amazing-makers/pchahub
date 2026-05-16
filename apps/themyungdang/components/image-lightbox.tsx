'use client'

import { useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

interface ImageLightboxProps {
  images: string[]
  current: number           // index of currently-open image; -1 = closed
  onClose: () => void
  onNavigate: (index: number) => void
  alt?: string
}

export function ImageLightbox({ images, current, onClose, onNavigate, alt }: ImageLightboxProps) {
  const total = images.length
  const hasPrev = current > 0
  const hasNext = current < total - 1

  const prev = useCallback(() => { if (hasPrev) onNavigate(current - 1) }, [hasPrev, current, onNavigate])
  const next = useCallback(() => { if (hasNext) onNavigate(current + 1) }, [hasNext, current, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (current < 0) return
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, onClose, prev, next])

  // Prevent body scroll
  useEffect(() => {
    if (current >= 0) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [current])

  if (current < 0 || !images[current]) return null

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
        {current + 1} / {total}
      </div>

      {/* Prev */}
      {hasPrev && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); prev() }}
          aria-label="이전 사진"
          className="absolute left-3 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-6"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current}
          src={images[current]}
          alt={alt ? `${alt} ${current + 1}` : `사진 ${current + 1}`}
          className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
          draggable={false}
        />
      </div>

      {/* Next */}
      {hasNext && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); next() }}
          aria-label="다음 사진"
          className="absolute right-3 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-6"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Thumbnail strip */}
      {total > 1 && (
        <div
          className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onNavigate(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`${i + 1}번 사진`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/** Trigger button overlay — placed on an image to indicate it's clickable */
export function LightboxTrigger({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 ${className ?? ''}`}>
      <div className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm">
        <ZoomIn className="h-5 w-5 text-white" />
      </div>
    </div>
  )
}
