'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { TOAST_EVENT_NAME, type ToastPayload, type ToastType } from '@/hooks/use-toast'

// ─────────────────────────────────────────────────────────────────────────────
// Styles per type
// ─────────────────────────────────────────────────────────────────────────────
const STYLES: Record<ToastType, { bg: string; border: string; text: string; icon: typeof CheckCircle2 }> = {
  success: {
    bg:     'bg-emerald-50',
    border: 'border-emerald-200',
    text:   'text-emerald-800',
    icon:   CheckCircle2,
  },
  error: {
    bg:     'bg-rose-50',
    border: 'border-rose-200',
    text:   'text-rose-800',
    icon:   AlertCircle,
  },
  warning: {
    bg:     'bg-amber-50',
    border: 'border-amber-200',
    text:   'text-amber-800',
    icon:   TriangleAlert,
  },
  info: {
    bg:     'bg-blue-50',
    border: 'border-blue-200',
    text:   'text-blue-800',
    icon:   Info,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Single toast item
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ toast, onDismiss }: { toast: ToastPayload; onDismiss: (id: string) => void }) {
  const style = STYLES[toast.type]
  const Icon  = style.icon
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), toast.duration ?? 3000)
    return () => clearTimeout(timerRef.current)
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${style.bg} ${style.border}`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.text}`} />
      <span className={`flex-1 text-sm font-medium ${style.text}`}>{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className={`-mr-1 -mt-0.5 rounded-md p-1 transition-colors hover:bg-black/10 ${style.text}`}
        aria-label="닫기"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Container — placed once in the root layout
// ─────────────────────────────────────────────────────────────────────────────
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastPayload[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const payload = (e as CustomEvent<ToastPayload>).detail
      setToasts((prev) => [...prev.slice(-4), payload]) // cap at 5
    }
    window.addEventListener(TOAST_EVENT_NAME, handler)
    return () => window.removeEventListener(TOAST_EVENT_NAME, handler)
  }, [])

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  if (toasts.length === 0) return null

  return (
    <div
      aria-label="알림"
      className="fixed bottom-6 right-4 z-[9999] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </div>
  )
}
