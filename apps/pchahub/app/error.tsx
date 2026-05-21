'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@amakers/ui'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
          <AlertTriangle className="h-8 w-8 text-rose-400" />
        </div>
        <h1 className="mt-5 text-h3 font-bold text-gray-900">오류가 발생했습니다</h1>
        <p className="mt-2 text-sm text-gray-500">
          일시적인 문제입니다. 잠시 후 다시 시도해 주세요.
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-gray-400">#{error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </Button>
          <a href="/">
            <Button variant="outline">홈으로</Button>
          </a>
        </div>
      </div>
    </main>
  )
}
