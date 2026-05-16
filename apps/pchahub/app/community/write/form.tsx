'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

const COMMUNITY_KEY = 'pchahub:community-posts'

const CATEGORIES = [
  { key: 'experience', label: '창업 후기' },
  { key: 'question', label: '질문' },
  { key: 'tip', label: '팁·노하우' },
  { key: 'news', label: '시장 동향' },
] as const

interface CommunityWriteFormProps {
  authorName: string
}

export function CommunityWriteForm({ authorName }: CommunityWriteFormProps) {
  const [category, setCategory] = useState<string>('question')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [done, setDone] = useState(false)

  const isValid = title.trim().length >= 5 && content.trim().length >= 20

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const entry = {
      id: `cp-${Date.now()}`,
      category,
      title: title.trim(),
      content: content.trim(),
      author: anonymous ? '익명' : authorName,
      anonymous,
      createdAt: new Date().toISOString().slice(0, 10),
      views: 0,
      comments: 0,
      likes: 0,
    }
    try {
      const raw = window.localStorage.getItem(COMMUNITY_KEY)
      const prev: typeof entry[] = raw ? JSON.parse(raw) : []
      window.localStorage.setItem(COMMUNITY_KEY, JSON.stringify([entry, ...prev]))
    } catch { /* ignore */ }
    setDone(true)
  }

  if (done) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-10 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h2 className="mt-4 text-h3 font-bold text-gray-900">글이 등록되었습니다!</h2>
          <p className="mt-2 text-sm text-gray-500">
            커뮤니티 회원들에게 공유되었습니다. 답변과 반응을 기다려보세요.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href="/community"
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              커뮤니티로 돌아가기
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-base font-semibold text-gray-900">카테고리</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className={
                  'rounded-lg border px-3 py-1.5 text-xs font-medium ' +
                  (category === c.key
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50')
                }
              >
                {c.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-base font-semibold text-gray-900">글 내용</h2>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="궁금한 점 또는 공유하고 싶은 주제를 입력하세요"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
            <div className="mt-1 text-right text-xs text-gray-400">{title.length}자 (최소 5자)</div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              내용 <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="자세한 내용을 적어주세요. 구체적인 상황과 맥락을 공유할수록 더 좋은 답변을 받을 수 있습니다."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
            <div className="mt-1 text-right text-xs text-gray-400">{content.length}자 (최소 20자)</div>
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">익명으로 작성</span>
          </label>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <a
          href="/community"
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          취소
        </a>
        <Button type="submit" size="lg" disabled={!isValid}>
          글 올리기
        </Button>
      </div>
    </form>
  )
}
