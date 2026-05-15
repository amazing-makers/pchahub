'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BrandHeroSliderProps {
  /** 매장/대표 사진 URL 목록. 1장 이상. */
  images: string[]
  /** 접근성용 — 보통 브랜드명. */
  alt: string
}

/**
 * 브랜드 디테일 상단 사진 슬라이더.
 *
 * 디자인 원칙:
 * - 사진은 절대 잘리지 않는다 (object-contain). 가로 16:9 또는 21:9 컨테이너 안에서
 *   같은 사진의 블러 처리 버전을 backdrop으로 깔아 좌우 빈 영역을 메운다.
 * - 사진이 1장이면 화살표·인디케이터 없이 정적 표시.
 * - 사진이 여러 장이면 좌우 화살표·하단 dot 인디케이터 + 우상단 "n/total".
 *   키보드 ←/→ 지원.
 */
export function BrandHeroSlider({ images, alt }: BrandHeroSliderProps) {
  const [idx, setIdx] = React.useState(0)
  const total = images.length
  const current = images[idx] ?? images[0] ?? ''

  const go = React.useCallback(
    (delta: number) => {
      if (total <= 1) return
      setIdx((p) => (p + delta + total) % total)
    },
    [total],
  )

  React.useEffect(() => {
    if (total <= 1) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, total])

  if (total === 0) return null

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-900 sm:aspect-[21/9] sm:max-h-[520px]">
      {/* Blurred backdrop — 같은 이미지를 cover + blur로 깔아 letterbox 공간을 메움 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`bg-${idx}`}
        src={current}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl"
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Foreground — object-contain으로 사진 전체가 보이도록 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`fg-${idx}`}
        src={current}
        alt={alt}
        className="relative z-10 mx-auto h-full max-h-full max-w-full object-contain"
      />

      {total > 1 && (
        <>
          {/* Prev / Next */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="이전 사진"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="다음 사진"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dot indicator + 페이지 번호 */}
          <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`사진 ${i + 1}로 이동`}
                aria-current={i === idx}
                className={
                  'h-1.5 rounded-full transition-all ' +
                  (i === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80')
                }
              />
            ))}
          </div>
          <div className="absolute right-3 top-3 z-20 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {idx + 1} / {total}
          </div>
        </>
      )}
    </div>
  )
}
