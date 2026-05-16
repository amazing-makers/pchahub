'use client'

import { useEffect } from 'react'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { Button } from '@amakers/ui'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // In production, log to an error tracking service (Sentry, etc.)
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
          <AlertTriangle className="h-8 w-8 text-rose-500" />
        </div>

        {/* Message */}
        <h1 className="mt-6 text-h3 font-bold text-gray-900">문제가 발생했습니다</h1>
        <p className="mt-3 text-sm text-gray-500">
          일시적인 오류입니다. 아래 버튼으로 다시 시도하거나 홈으로 이동하세요.
        </p>

        {/* Error digest (for support) */}
        {error.digest && (
          <div className="mt-3 inline-block rounded bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-400">
            오류 ID: {error.digest}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={reset} className="gap-1.5">
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </Button>
          <a href="/">
            <Button size="lg" variant="outline" className="gap-1.5">
              <Home className="h-4 w-4" />
              홈으로
            </Button>
          </a>
        </div>
      </div>
    </main>
  )
}
