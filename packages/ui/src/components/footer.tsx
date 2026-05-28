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

const PLATFORM_LIST = (Object.entries(platformColors) as [PlatformKey, typeof platformColors[PlatformKey]][])

export function Footer({ platform, staffLoginHref }: FooterProps) {
  const brand = platform ? platformColors[platform] : null
  const brandName = brand?.name ?? '프차허브'
  return (
    <footer className="mt-section border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto py-12">

        {/* 브랜드 소개 */}
        <div className="mb-10">
          <div className="text-base font-semibold text-gray-900">{brandName}</div>
          <p className="mt-2 text-sm text-gray-600">
            한국 프랜차이즈 통합 플랫폼
            <br />
            &ldquo;한국 프랜차이즈의 모든 것을 OPEN한다&rdquo;
          </p>
        </div>

        {/* 9개 플랫폼 탐색 */}
        <div className="border-t border-gray-200 pt-8 pb-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            서비스 탐색
          </p>
          <div className="grid grid-cols-3 gap-x-4 gap-y-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9">
            {PLATFORM_LIST.map(([key, p]) => {
              const isCurrent = key === platform
              return isCurrent ? (
                <div key={key} className="flex flex-col gap-0.5">
                  <span
                    className="text-sm font-bold"
                    style={{ color: p.primary }}
                  >
                    {p.name}
                  </span>
                  <span className="text-[11px] text-gray-400">{p.role}</span>
                </div>
              ) : (
                <a
                  key={key}
                  href={`https://${p.domain}`}
                  className="group flex flex-col gap-0.5"
                >
                  <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                    {p.name}
                  </span>
                  <span className="text-[11px] text-gray-400">{p.role}</span>
                </a>
              )
            })}
          </div>
        </div>

        {/* 법적 링크 + 저작권 */}
        <div className="flex flex-col gap-2 border-t border-gray-200 pt-6 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
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
