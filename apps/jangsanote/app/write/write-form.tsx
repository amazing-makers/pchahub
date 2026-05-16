'use client'

import { useState } from 'react'
import { CheckCircle2, Send, Tag, X } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { CHANNELS } from '@/lib/mock-data'

// 채널 그룹
const CATEGORY_CHANNELS = CHANNELS.filter((c) => c.type === 'category')
const REGION_CHANNELS = CHANNELS.filter((c) => c.type === 'region')
const GENERAL_CHANNELS = CHANNELS.filter((c) => c.type === 'general')

const CATEGORIES = [
  { key: 'experience', label: '운영 후기' },
  { key: 'question', label: '질문' },
  { key: 'tip', label: '팁·노하우' },
  { key: 'news', label: '시장 동향' },
  { key: 'discussion', label: '토론' },
] as const

interface FormState {
  channelType: 'category' | 'region' | 'general'
  channelKey: string
  category: string
  title: string
  content: string
  tagInput: string
  tags: string[]
  anonymous: boolean
}

interface WriteFormProps {
  name: string
}

export function WriteForm({ name }: WriteFormProps) {
  const [state, setState] = useState<FormState>({
    channelType: 'general',
    channelKey: 'general',
    category: 'question',
    title: '',
    content: '',
    tagInput: '',
    tags: [],
    anonymous: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [postId, setPostId] = useState('')

  const channelOptions =
    state.channelType === 'category'
      ? CATEGORY_CHANNELS
      : state.channelType === 'region'
        ? REGION_CHANNELS
        : GENERAL_CHANNELS

  const isValid =
    state.title.trim().length >= 5 &&
    state.content.trim().length >= 20 &&
    state.channelKey

  const addTag = () => {
    const t = state.tagInput.trim().replace(/^#/, '')
    if (t && !state.tags.includes(t) && state.tags.length < 5) {
      setState((p) => ({ ...p, tags: [...p.tags, t], tagInput: '' }))
    }
  }

  const removeTag = (tag: string) =>
    setState((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    const id = `p-${Date.now()}`
    try {
      const raw = window.localStorage.getItem('jangsanote:posts')
      const prev: object[] = raw ? (JSON.parse(raw) as object[]) : []
      const entry = {
        id,
        title: state.title.trim(),
        excerpt: state.content.trim().slice(0, 80),
        content: state.content.trim().split('\n').filter(Boolean),
        channelType: state.channelType,
        channelKey: state.channelKey,
        category: state.category,
        tags: state.tags,
        anonymous: state.anonymous,
        authorName: state.anonymous ? '익명' : name,
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        commentCount: 0,
      }
      window.localStorage.setItem('jangsanote:posts', JSON.stringify([entry, ...prev]))
    } catch {
      // ignore
    }

    setPostId(id)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-10 text-center">
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: 'var(--brand-primary)' }}
            >
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
            <h2 className="mt-4 text-h3 font-bold text-gray-900">글이 등록되었습니다!</h2>
            <p className="mt-2 text-sm text-gray-500">
              장사노트에 내 글이 올라갔습니다. 다른 점주들의 댓글을 확인해보세요.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="/">
                <Button variant="outline" size="lg">피드로 이동</Button>
              </a>
              <a href="/write">
                <Button size="lg" onClick={() => {
                  setSubmitted(false)
                  setPostId('')
                  setState({
                    channelType: 'general',
                    channelKey: 'general',
                    category: 'question',
                    title: '',
                    content: '',
                    tagInput: '',
                    tags: [],
                    anonymous: false,
                  })
                }}>
                  또 쓰기
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl border-gray-200 shadow-sm">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={submit} className="space-y-6">

          {/* 채널 선택 */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              채널 선택 <span className="text-rose-500">*</span>
            </label>

            {/* 채널 유형 탭 */}
            <div className="flex gap-1.5 rounded-lg border border-gray-200 bg-gray-50 p-1">
              {(
                [
                  { value: 'category', label: '업종방' },
                  { value: 'region', label: '지역방' },
                  { value: 'general', label: '자유게시판' },
                ] as const
              ).map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    const defaultKey =
                      t.value === 'category'
                        ? 'chicken'
                        : t.value === 'region'
                          ? 'seoul'
                          : 'general'
                    setState((p) => ({ ...p, channelType: t.value, channelKey: defaultKey }))
                  }}
                  className={
                    'flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ' +
                    (state.channelType === t.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700')
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* 채널 선택 */}
            {state.channelType !== 'general' && (
              <div className="flex flex-wrap gap-1.5">
                {channelOptions.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setState((p) => ({ ...p, channelKey: c.key }))}
                    className={
                      'rounded-full border px-3 py-1 text-xs transition-colors ' +
                      (state.channelKey === c.key
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400')
                    }
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              카테고리 <span className="text-rose-500">*</span>
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setState((p) => ({ ...p, category: c.key }))}
                  className={
                    'rounded-full border px-3 py-1 text-xs transition-colors ' +
                    (state.category === c.key
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400')
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={state.title}
              onChange={(e) => setState((p) => ({ ...p, title: e.target.value }))}
              placeholder="제목을 입력하세요 (5자 이상)"
              maxLength={100}
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
            <div className="mt-1 text-right text-xs text-gray-400">{state.title.length}/100</div>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              내용 <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={state.content}
              onChange={(e) => setState((p) => ({ ...p, content: e.target.value }))}
              placeholder="내용을 입력하세요. 줄바꿈으로 단락을 구분합니다. (20자 이상)"
              rows={8}
              className="mt-1.5 w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
            <div className="mt-1 text-right text-xs text-gray-400">{state.content.length}자</div>
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              태그 <span className="text-xs font-normal text-gray-400">(선택, 최대 5개)</span>
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                value={state.tagInput}
                onChange={(e) => setState((p) => ({ ...p, tagInput: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="#본사갈등 #저자본 #회계"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
              <Button type="button" size="sm" variant="outline" onClick={addTag}>
                <Tag className="h-3.5 w-3.5" />
              </Button>
            </div>
            {state.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {state.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 익명 토글 */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="relative">
              <input
                type="checkbox"
                checked={state.anonymous}
                onChange={(e) => setState((p) => ({ ...p, anonymous: e.target.checked }))}
                className="sr-only"
              />
              <div
                className={
                  'h-5 w-9 rounded-full transition-colors ' +
                  (state.anonymous ? 'bg-gray-900' : 'bg-gray-200')
                }
              />
              <div
                className={
                  'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ' +
                  (state.anonymous ? 'left-5' : 'left-0.5')
                }
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900">익명 모드</div>
              <div className="text-xs text-gray-500">
                실명 대신 연차·업종만 표시됩니다. 본사 관계자에게도 작성자 정보가 노출되지 않습니다.
              </div>
            </div>
          </label>

          {/* 제출 */}
          <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
            <Button
              type="submit"
              size="lg"
              className="gap-1.5"
              disabled={!isValid}
            >
              <Send className="h-4 w-4" />
              글 등록하기
            </Button>
            <a href="/">
              <Button type="button" size="lg" variant="ghost" className="text-gray-600">
                취소
              </Button>
            </a>
            {!isValid && (
              <span className="text-xs text-gray-400">
                제목 5자·내용 20자 이상 입력해주세요
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
