'use client'

import { useState } from 'react'
import { BrandLogo } from '@amakers/ui'
import type { MockBrand } from '@/lib/mock-data'

interface Props {
  brand: MockBrand
  featured?: boolean
}

/**
 * 브랜드 카드 히어로 이미지 영역.
 * 이미지 로드 실패 시 브랜드 컬러 + 모노그램 플레이스홀더로 자동 전환.
 */
export function BrandCardImage({ brand, featured = false }: Props) {
  const [failed, setFailed] = useState(false)
  const showPhoto = !!brand.heroImage && !failed

  return (
    <>
      {/* 항상 뒤에 플레이스홀더 렌더 — 이미지 실패 시 노출 */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: brand.logoColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20" />
        <BrandLogo brand={brand} size="xl" bordered />
      </div>

      {/* 실제 이미지 — 로드 성공하면 플레이스홀더 위에 덮어씀 */}
      {brand.heroImage && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.heroImage}
          alt={`${brand.name} 매장`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}

      {/* 하단 그라디언트 — 이미지 있을 때만 */}
      {showPhoto && (
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
      )}

      {/* 로고 + 이름 오버레이 — 이미지 있을 때만 */}
      {showPhoto && (
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 z-10">
          <BrandLogo brand={brand} size={featured ? 'md' : 'sm'} bordered />
          <div className="min-w-0 text-white drop-shadow-sm">
            <span className="truncate text-sm font-bold block">{brand.name}</span>
            <span className="text-[11px] text-white/80">{brand.categoryLabel}</span>
          </div>
        </div>
      )}
    </>
  )
}
