'use client'

import * as React from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

export interface MobileFilterDrawerProps {
  /** Filter UI — rendered inline as the desktop sidebar AND inside the mobile sheet. */
  children: React.ReactNode
  /** Trigger button + sheet heading label. */
  label?: string
  /** Extra classes for the desktop <aside> wrapper (e.g. spacing). */
  asideClassName?: string
}

/**
 * Filter shell for list pages. On desktop (lg+) renders its children inline as
 * a sidebar <aside>. On mobile it hides the sidebar and shows a "필터·정렬"
 * button that opens a bottom sheet with the same filter controls, so results
 * aren't pushed down by a tall sidebar.
 *
 * Drop-in for an existing `<aside>`: the hidden-on-mobile <aside> and the
 * hidden-on-desktop trigger are display:none on the other breakpoint, so a CSS
 * grid that expects a single sidebar item still lays out correctly (display:none
 * items don't participate in grid placement).
 */
export function MobileFilterDrawer({
  children,
  label = '필터·정렬',
  asideClassName = 'space-y-5',
}: MobileFilterDrawerProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Desktop: inline sidebar */}
      <aside className={`hidden lg:block ${asideClassName}`}>{children}</aside>

      {/* Mobile: trigger button (hidden on desktop) */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {label}
        </button>

        {open && (
          <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={label}>
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
            <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <h2 className="text-base font-bold text-gray-900">{label}</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="닫기"
                  className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">{children}</div>
              <div
                className="border-t border-gray-100 px-5 py-3"
                style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-lg py-3 text-sm font-semibold text-white"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  결과 보기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
