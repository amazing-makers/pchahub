'use client'

import { useEffect, useState } from 'react'
import { BarChart2, Check } from 'lucide-react'

const STORAGE_KEY = 'gongganhansu:compare'
const MAX_COMPARE = 3

function getIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function saveIds(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {}
}

interface Props {
  contractorId: string
  contractorName: string
}

export function CompareToggleButton({ contractorId, contractorName }: Props) {
  const [selected, setSelected] = useState(false)
  const [atMax, setAtMax] = useState(false)

  useEffect(() => {
    const sync = () => {
      const ids = getIds()
      setSelected(ids.includes(contractorId))
      setAtMax(ids.length >= MAX_COMPARE && !ids.includes(contractorId))
    }
    sync()
    window.addEventListener('ggh-compare-update', sync)
    return () => window.removeEventListener('ggh-compare-update', sync)
  }, [contractorId])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const ids = getIds()
    if (ids.includes(contractorId)) {
      saveIds(ids.filter((id) => id !== contractorId))
    } else {
      if (ids.length >= MAX_COMPARE) return
      saveIds([...ids, contractorId])
    }
    window.dispatchEvent(new Event('ggh-compare-update'))
  }

  return (
    <button
      onClick={toggle}
      disabled={atMax}
      title={
        atMax
          ? '최대 3곳까지 비교 가능'
          : selected
            ? `${contractorName} 비교에서 제거`
            : `${contractorName} 비교에 추가`
      }
      className={
        'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm transition-colors ' +
        (selected
          ? 'text-white'
          : atMax
            ? 'cursor-not-allowed border border-gray-200 bg-white text-gray-300'
            : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900')
      }
      style={selected ? { background: 'var(--brand-primary)' } : undefined}
    >
      {selected ? <Check className="h-3 w-3" /> : <BarChart2 className="h-3 w-3" />}
      {selected ? '선택됨' : '비교'}
    </button>
  )
}
