import React from 'react'
import { platformColors, type PlatformKey } from './colors'

/**
 * OG 이미지의 JSX 컨텐츠.
 *
 * Next.js의 ImageResponse는 design-system 안에서 직접 사용하지 않고
 * (next/og 의존성을 design-system에 넣지 않기 위해), JSX만 생성해서
 * 각 사이트 app/opengraph-image.tsx에서 ImageResponse로 감싼다.
 *
 * 사용 예 (apps/pchahub/app/opengraph-image.tsx):
 *
 *   import { ImageResponse } from 'next/og'
 *   import { buildOgImageJsx, OG_IMAGE_SIZE } from '@amakers/design-system'
 *
 *   export const runtime = 'edge'
 *   export const alt = '프차허브'
 *   export const size = OG_IMAGE_SIZE
 *   export const contentType = 'image/png'
 *
 *   export default function Image() {
 *     return new ImageResponse(buildOgImageJsx('pchahub'), { ...OG_IMAGE_SIZE })
 *   }
 */

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
}

const SITE_TAGLINE: Record<PlatformKey, string> = {
  pchahub: '한국 프랜차이즈 가맹 정보 플랫폼',
  themyungdang: '프랜차이즈 입점 매물 + 안전 거래',
  gongganhansu: '가맹점 인테리어 시공 매칭',
  themanual: '가맹점 운영 교육 + 멘토링',
  jangsanote: '자영업·가맹점주 커뮤니티',
  bestplace: '매장 디렉토리 + 베스트 어워드',
  changupdocu: '자영업·가맹의 진짜 이야기',
  openrun: '프랜차이즈 마케팅 에이전시',
  pchabridge: '프랜차이즈 투자 + M&A',
}

/**
 * 사이트 루트 OG 이미지의 JSX.
 * 사이트 브랜드 색상 + 사이트명 + 한 줄 소개 + amakers 워터마크.
 */
export function buildOgImageJsx(platform: PlatformKey) {
  const brand = platformColors[platform]
  const tagline = SITE_TAGLINE[platform]

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${brand.primary} 0%, ${darken(brand.primary, 18)} 100%)`,
        padding: 96,
        color: 'white',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      {/* amakers 워터마크 */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 48,
          right: 48,
          fontSize: 24,
          opacity: 0.7,
          letterSpacing: '0.1em',
        }}
      >
        amakers
      </div>

      {/* 사이트 로고 박스 */}
      <div
        style={{
          width: 128,
          height: 128,
          borderRadius: 28,
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 64,
          fontWeight: 800,
        }}
      >
        {brand.name.charAt(0)}
      </div>

      <div style={{ flex: 1 }} />

      {/* 사이트명 + 태그라인 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', fontSize: 28, opacity: 0.85, letterSpacing: '0.02em' }}>
          {brand.role}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          {brand.name}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            opacity: 0.92,
            marginTop: 8,
          }}
        >
          {tagline}
        </div>
      </div>

      {/* 도메인 */}
      <div
        style={{
          display: 'flex',
          marginTop: 24,
          fontSize: 22,
          opacity: 0.7,
          letterSpacing: '0.05em',
        }}
      >
        {brand.domain}
      </div>
    </div>
  )
}

/**
 * Hex 색상을 살짝 어둡게 — gradient 끝점 생성용.
 */
function darken(hex: string, percent: number): string {
  const h = hex.replace('#', '')
  const num = parseInt(h, 16)
  const r = Math.max(0, ((num >> 16) & 0xff) - Math.round((percent / 100) * 255))
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round((percent / 100) * 255))
  const b = Math.max(0, (num & 0xff) - Math.round((percent / 100) * 255))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

/**
 * 페이지별 OG 이미지 — 페이지 제목 + 부제 + 메타 칩들.
 *
 * 사용 예 (apps/pchahub/app/brands/[id]/opengraph-image.tsx):
 *
 *   export default async function Image({ params }: { params: { id: string } }) {
 *     const brand = BRANDS.find(b => b.id === params.id)!
 *     return new ImageResponse(buildPageOgImageJsx('pchahub', {
 *       title: brand.name,
 *       subtitle: brand.description,
 *       chips: [`매장 ${brand.storeCount}개`, `창업비 ${brand.startupCost}만`, `본사 ${brand.hqRegion}`],
 *     }), { ...OG_IMAGE_SIZE })
 *   }
 */
export interface PageOgInput {
  /** 페이지 제목 (브랜드명, 매물 제목 등). */
  title: string
  /** 한 줄 부제. */
  subtitle?: string
  /** 화면 하단에 표시할 메타 칩 (최대 4개). */
  chips?: string[]
  /** "브랜드 정보", "매물", "매장" 등 페이지 종류 라벨. */
  pageType?: string
}

export function buildPageOgImageJsx(platform: PlatformKey, input: PageOgInput) {
  const brand = platformColors[platform]

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${brand.primary} 0%, ${darken(brand.primary, 22)} 100%)`,
        padding: 80,
        color: 'white',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      {/* 우상단 amakers + 사이트명 */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          right: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 4,
        }}
      >
        <div style={{ display: 'flex', fontSize: 20, opacity: 0.7, letterSpacing: '0.1em' }}>
          {`amakers / ${brand.domain}`}
        </div>
        <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, opacity: 0.95 }}>
          {brand.name}
        </div>
      </div>

      {/* 좌상단 페이지 타입 라벨 */}
      {input.pageType && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 20px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(12px)',
            fontSize: 22,
            fontWeight: 600,
            alignSelf: 'flex-start',
            marginBottom: 32,
          }}
        >
          {input.pageType}
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* 페이지 제목 */}
      <div
        style={{
          display: 'flex',
          fontSize: input.title.length > 24 ? 64 : 80,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: 24,
          maxWidth: '90%',
        }}
      >
        {input.title}
      </div>

      {/* 부제 */}
      {input.subtitle && (
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            opacity: 0.92,
            lineHeight: 1.35,
            marginBottom: 32,
            maxWidth: '85%',
          }}
        >
          {input.subtitle.length > 80 ? input.subtitle.slice(0, 80) + '…' : input.subtitle}
        </div>
      )}

      {/* 메타 칩들 */}
      {input.chips && input.chips.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {input.chips.slice(0, 4).map((chip, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 22px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.22)',
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
