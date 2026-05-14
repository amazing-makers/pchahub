import * as React from 'react'
import { platformColors, type PlatformKey } from '@amakers/design-system'

export interface FooterProps {
  platform?: PlatformKey
}

const platforms = Object.entries(platformColors) as Array<
  [PlatformKey, (typeof platformColors)[PlatformKey]]
>

/**
 * 정책 페이지는 모든 사이트에서 pchahub(마스터 도메인)에 호스팅된 단일 정식
 * 문서를 가리킵니다. pchahub 내부에서는 상대 경로, 다른 앱에서는 절대 URL을 사용합니다.
 */
const PCHAHUB_DOMAIN = platformColors.pchahub.domain

function legalHref(path: string, platform?: PlatformKey) {
  return platform === 'pchahub' ? path : `https://${PCHAHUB_DOMAIN}${path}`
}

export function Footer({ platform }: FooterProps) {
  const brand = platform ? platformColors[platform] : null
  const brandName = brand?.name ?? '프차허브'
  return (
    <footer className="mt-section border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="text-base font-semibold text-gray-900">{brandName}</div>
            <p className="mt-2 text-sm text-gray-600">
              한국 프랜차이즈 통합 플랫폼
              <br />
              &ldquo;한국 프랜차이즈의 모든 것을 OPEN한다&rdquo;
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="text-sm font-semibold text-gray-900">9개 사이트</div>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              {platforms.map(([key, b]) => (
                <li key={key}>
                  <a
                    href={key === platform ? '/' : `https://${b.domain}`}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <span
                      className="mr-2 inline-block h-2 w-2 rounded-full"
                      style={{ background: b.primary }}
                      aria-hidden
                    />
                    {b.name}
                  </a>
                </li>
              ))}
            </ul>
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
          </div>
        </div>
      </div>
    </footer>
  )
}
