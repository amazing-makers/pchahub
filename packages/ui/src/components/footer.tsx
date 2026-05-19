import * as React from 'react'
import { platformColors, type PlatformKey } from '@amakers/design-system'

export interface FooterProps {
  platform?: PlatformKey
  /** 스태프(관리자/운영자) 로그인 링크. 설정 시 하단 법적 링크 옆에 표시됩니다. */
  staffLoginHref?: string
}

/**
 * 정책 페이지는 모든 사이트에서 pchahub(마스터 도메인)에 호스팅된 단일 정식
 * 문서를 가리킵니다. pchahub 내부에서는 상대 경로, 다른 앱에서는 절대 URL을 사용합니다.
 */
const PCHAHUB_DOMAIN = platformColors.pchahub.domain

function legalHref(path: string, platform?: PlatformKey) {
  return platform === 'pchahub' ? path : `https://${PCHAHUB_DOMAIN}${path}`
}

/** amakers 생태계 9개 플랫폼 목록 (현재 플랫폼은 강조, 나머지는 링크) */
const ECOSYSTEM: { key: PlatformKey; emoji: string; desc: string }[] = [
  { key: 'pchahub',      emoji: '🏢', desc: '브랜드·창업 허브' },
  { key: 'openrun',      emoji: '📣', desc: '오픈런 마케팅' },
  { key: 'gongganhansu', emoji: '🏗️', desc: '인테리어 시공' },
  { key: 'themyungdang', emoji: '📍', desc: '상권·매물 중개' },
  { key: 'themanual',    emoji: '📚', desc: '창업 교육·멘토' },
  { key: 'jangsanote',   emoji: '📝', desc: '장사 커뮤니티' },
  { key: 'bestplace',    emoji: '🏆', desc: '매장 랭킹·어워드' },
  { key: 'changupdocu',  emoji: '🎬', desc: '창업 미디어' },
  { key: 'pchabridge',   emoji: '🤝', desc: '투자·M&A 연결' },
]

export function Footer({ platform, staffLoginHref }: FooterProps) {
  const brand = platform ? platformColors[platform] : null
  const brandName = brand?.name ?? '프차허브'
  return (
    <footer className="mt-section border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto py-12">
        <div className="mb-10">
          <div className="text-base font-semibold text-gray-900">{brandName}</div>
          <p className="mt-2 text-sm text-gray-600">
            한국 프랜차이즈 통합 플랫폼
            <br />
            &ldquo;한국 프랜차이즈의 모든 것을 OPEN한다&rdquo;
          </p>
        </div>

        {/* 생태계 링크 */}
        <div className="border-t border-gray-200 pt-8">
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            amakers 생태계
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9">
            {ECOSYSTEM.map(({ key, emoji, desc }) => {
              const p = platformColors[key]
              const isCurrent = key === platform
              return (
                <a
                  key={key}
                  href={isCurrent ? '#' : `https://${p.domain}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={
                    'group flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors ' +
                    (isCurrent
                      ? 'border-gray-300 bg-white shadow-sm'
                      : 'border-transparent hover:border-gray-200 hover:bg-white')
                  }
                >
                  <span className="text-xl leading-none">{emoji}</span>
                  <span
                    className={
                      'text-xs font-semibold leading-tight ' +
                      (isCurrent ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900')
                    }
                  >
                    {p.name}
                  </span>
                  <span className="text-[10px] leading-tight text-gray-400">{desc}</span>
                </a>
              )
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-gray-200 pt-6 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} {brandName}. All rights reserved.</div>
          <div className="flex gap-4">
            <a href={legalHref('/about', platform)} className="hover:text-gray-700">
              회사소개
            </a>
            <a href={legalHref('/terms', platform)} className="hover:text-gray-700">
              이용약관
            </a>
            <a href={legalHref('/privacy', platform)} className="hover:text-gray-700">
              개인정보처리방침
            </a>
            {staffLoginHref && (
              <>
                <span className="select-none text-gray-300">|</span>
                <a href={staffLoginHref} className="hover:text-gray-700">
                  관리자 로그인
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
