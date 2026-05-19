'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

interface MobileFilterToggleProps {
  children: React.ReactNode
  label?: string
}

export function MobileFilterToggle({ children, label = '필터' }: MobileFilterToggleProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50"
        aria-expanded={open}
      >
        {open ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
        {label}
      </button>
      {open && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {children}
        </div>
      )}
    </div>
  )
}
