'use client'

import { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@amakers/ui'

const STORAGE_KEY = 'bestplace:savedStores'

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function SaveStoreButton({ storeId }: { storeId: string }) {
  const [saved, setSaved] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSaved(readSaved().includes(storeId))
    setHydrated(true)
  }, [storeId])

  const toggle = () => {
    const ids = readSaved()
    const isSaved = ids.includes(storeId)
    const next = isSaved ? ids.filter((id) => id !== storeId) : [storeId, ...ids]
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
    setSaved(!isSaved)
  }

  if (!hydrated) {
    return (
      <Button size="md" variant="outline" className="gap-1.5" disabled>
        <Bookmark className="h-4 w-4" />
        찜하기
      </Button>
    )
  }

  return (
    <Button
      size="md"
      variant={saved ? 'primary' : 'outline'}
      className={'gap-1.5 ' + (saved ? 'bg-rose-600 hover:bg-rose-700' : '')}
      onClick={toggle}
    >
      <Bookmark className={'h-4 w-4 ' + (saved ? 'fill-white' : '')} />
      {saved ? '찜 완료' : '찜하기'}
    </Button>
  )
}
