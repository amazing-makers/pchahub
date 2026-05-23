import * as React from 'react'

export interface MobileCTAProps {
  /** Button label, e.g. "가맹 상담 신청". */
  label: string
  /** Destination href for the primary action. */
  href: string
  /** Optional secondary link shown beside the primary button. */
  secondary?: { label: string; href: string }
}

/**
 * Mobile-only sticky bottom CTA for detail pages. Sits directly above the
 * bottom tab bar (bottom-14) so the primary conversion action is always
 * reachable without scrolling. Renders an in-flow spacer so page content
 * isn't hidden behind the fixed bar. Hidden on md+ (desktop keeps its own
 * sticky sidebar / inline CTA).
 */
export function MobileCTA({ label, href, secondary }: MobileCTAProps) {
  return (
    <>
      <div className="h-20 md:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          {secondary && (
            <a
              href={secondary.href}
              className="flex shrink-0 items-center justify-center rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {secondary.label}
            </a>
          )}
          <a
            href={href}
            className="flex flex-1 items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--brand-primary)' }}
          >
            {label}
          </a>
        </div>
      </div>
    </>
  )
}
