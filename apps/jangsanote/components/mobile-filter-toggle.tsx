'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

export function MobileFilterToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        aria-expanded={open}
      >
        <SlidersHorizontal className="h-4 w-4" />
        필터
        {open && <X className="h-3.5 w-3.5 text-gray-400" />}
      </button>
      {open && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {children}
        </div>
      )}
    </div>
  )
}
