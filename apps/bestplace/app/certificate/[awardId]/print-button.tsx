'use client'

import { Printer } from 'lucide-react'

export function CertificatePrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      <Printer className="h-4 w-4" />
      상장 인쇄
    </button>
  )
}
