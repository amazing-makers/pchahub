'use client'

import { useEffect, useState } from 'react'
import { Award } from 'lucide-react'
import { Button } from '@amakers/ui'

const KEY = 'themanual:completedLessons'

interface CertificateButtonProps {
  courseId: string
  courseTitle: string
  lessonIds: string[]
}

export function CertificateButton({ courseId, courseTitle, lessonIds }: CertificateButtonProps) {
  const [completedCount, setCompletedCount] = useState(0)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setCompletedCount(lessonIds.filter((id) => ids.includes(id)).length)
    } catch { /* ignore */ }
    setHydrated(true)
  }, [lessonIds])

  function download() {
    // Generate a simple text "certificate" and trigger download
    const text = [
      '═══════════════════════════════',
      '           수  료  증',
      '═══════════════════════════════',
      '',
      `과정명: ${courseTitle}`,
      `수료일: ${new Date().toLocaleDateString('ko-KR')}`,
      `플랫폼: 더메뉴얼 (themanual.kr)`,
      '',
      '위 과정을 성공적으로 이수하였음을 증명합니다.',
      '',
      '═══════════════════════════════',
    ].join('\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `수료증_${courseTitle}_${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)

    // Save completion record
    try {
      const raw = window.localStorage.getItem('themanual:certificates')
      const certs: unknown[] = raw ? JSON.parse(raw) : []
      const cert = { courseId, courseTitle, completedAt: new Date().toISOString().slice(0, 10) }
      if (!certs.find((c: unknown) => (c as { courseId: string }).courseId === courseId)) {
        window.localStorage.setItem('themanual:certificates', JSON.stringify([cert, ...certs]))
      }
    } catch { /* ignore */ }
  }

  if (!hydrated || lessonIds.length === 0) return null

  const pct = Math.round((completedCount / lessonIds.length) * 100)
  if (pct < 100) return null

  return (
    <Button
      size="sm"
      variant="primary"
      className="gap-1.5"
      onClick={download}
    >
      <Award className="h-3.5 w-3.5" />
      수료증 다운로드
    </Button>
  )
}
