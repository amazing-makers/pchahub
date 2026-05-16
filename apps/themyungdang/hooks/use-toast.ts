'use client'

/**
 * Lightweight event-based toast system.
 * No React context required — call showToast() anywhere and
 * ToastContainer (in layout) will pick it up via CustomEvent.
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastPayload {
  id: string
  message: string
  type: ToastType
  duration?: number
}

const TOAST_EVENT = 'tmyd-toast'

let _seq = 0

/** Call from any client component to show a toast notification */
export function showToast(
  message: string,
  type: ToastType = 'info',
  duration = 3000,
): void {
  if (typeof window === 'undefined') return
  const payload: ToastPayload = { id: `t${++_seq}`, message, type, duration }
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: payload }))
}

export const TOAST_EVENT_NAME = TOAST_EVENT
