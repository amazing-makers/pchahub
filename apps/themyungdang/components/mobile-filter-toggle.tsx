'use client'
import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'

export function MobileFilterToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <SlidersHorizontal className="h-4 w-4" />
        필터
      </button>
      {open && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">
          {children}
        </div>
      )}
    </div>
  )
}
