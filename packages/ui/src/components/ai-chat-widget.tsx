'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export interface AiChatWidgetProps {
  /** Short platform key, used to call /api/chat */
  platform: string
  /** Human-readable platform name shown in the chat header */
  platformName: string
  /** Opening greeting shown before the user types */
  greeting?: string
  /** Tailwind bg class for the FAB and send button (e.g. "bg-indigo-600") */
  accentBg?: string
  /** Tailwind hover bg class for the FAB and send button */
  accentHoverBg?: string
  /**
   * Helpany company ID — when provided, a "상담사 연결" button appears
   * so users can escalate from AI to a human agent via Helpany webchat.
   */
  helpanyCompanyId?: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AiChatWidget({
  platformName,
  greeting = '안녕하세요! 무엇이든 물어보세요 😊',
  accentBg = 'bg-indigo-600',
  accentHoverBg = 'hover:bg-indigo-700',
  helpanyCompanyId,
}: AiChatWidgetProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [helpanyMode, setHelpanyMode] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  /* ── scroll to bottom on new content ── */
  useEffect(() => {
    if (!helpanyMode) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming, helpanyMode])

  /* ── focus input when panel opens ── */
  useEffect(() => {
    if (open && !helpanyMode) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open, helpanyMode])

  /* ── reset helpany mode when panel closes ── */
  useEffect(() => {
    if (!open) setHelpanyMode(false)
  }, [open])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg: Message = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setStreaming(true)

    // placeholder for streaming assistant reply
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          if (payload === '[DONE]') break
          try {
            const { text } = JSON.parse(payload) as { text: string }
            setMessages((prev) => {
              const next = [...prev]
              next[next.length - 1] = {
                role: 'assistant',
                content: next[next.length - 1].content + text,
              }
              return next
            })
          } catch {
            // ignore malformed chunk
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        setMessages((prev) => {
          const next = [...prev]
          next[next.length - 1] = {
            role: 'assistant',
            content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          }
          return next
        })
      }
    } finally {
      setStreaming(false)
    }
  }, [input, messages, streaming])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleClose = () => {
    abortRef.current?.abort()
    setOpen(false)
  }

  const helpanyUrl = helpanyCompanyId
    ? `https://www.helpany.work/public/chat/${helpanyCompanyId}`
    : undefined

  return (
    <>
      {/* ── Chat Panel ── */}
      {open && (
        <div
          role="dialog"
          aria-label={`${platformName} ${helpanyMode ? '상담사 채팅' : 'AI 도우미'}`}
          className="fixed bottom-20 right-4 z-[9990] flex w-[calc(100vw-2rem)] max-w-sm flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 md:bottom-24 md:right-6"
          style={{ height: 'min(520px, calc(100dvh - 7rem))' }}
        >
          {/* ── Header ── */}
          <div className={`flex items-center justify-between rounded-t-2xl px-4 py-3 ${accentBg} text-white`}>
            {helpanyMode ? (
              /* Helpany mode header */
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setHelpanyMode(false)}
                  aria-label="AI로 돌아가기"
                  className="rounded-lg p-1 transition-colors hover:bg-white/20 flex-shrink-0"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <HeadsetIcon className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-semibold truncate">상담사 채팅</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs flex-shrink-0">실시간</span>
              </div>
            ) : (
              /* AI mode header */
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-4 w-4" />
                <span className="text-sm font-semibold">AI 도우미</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{platformName}</span>
              </div>
            )}
            <button
              onClick={handleClose}
              aria-label="닫기"
              className="rounded-lg p-1 transition-colors hover:bg-white/20 flex-shrink-0"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          {/* ── Body: AI chat OR Helpany iframe ── */}
          {helpanyMode && helpanyUrl ? (
            /* Helpany iframe */
            <iframe
              src={helpanyUrl}
              className="flex-1 w-full border-none rounded-b-2xl"
              allow="clipboard-write"
              title="상담사 채팅"
            />
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {/* Greeting */}
                <div className="flex gap-2">
                  <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${accentBg} text-white`}>
                    <BotIcon className="h-4 w-4" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 text-sm text-gray-800 leading-relaxed">
                    {greeting}
                  </div>
                </div>

                {messages.map((msg, i) =>
                  msg.role === 'user' ? (
                    <div key={i} className="flex justify-end">
                      <div className={`max-w-[85%] rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-white leading-relaxed ${accentBg}`}>
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex gap-2">
                      <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${accentBg} text-white`}>
                        <BotIcon className="h-4 w-4" />
                      </div>
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                        {streaming && i === messages.length - 1 && msg.content === '' && (
                          <span className="inline-flex gap-0.5">
                            <span className="animate-bounce h-1.5 w-1.5 rounded-full bg-gray-400 inline-block" />
                            <span className="animate-bounce h-1.5 w-1.5 rounded-full bg-gray-400 inline-block" style={{ animationDelay: '0.15s' }} />
                            <span className="animate-bounce h-1.5 w-1.5 rounded-full bg-gray-400 inline-block" style={{ animationDelay: '0.3s' }} />
                          </span>
                        )}
                      </div>
                    </div>
                  )
                )}

                {/* "상담사 연결" suggestion — shown after ≥1 AI reply */}
                {helpanyUrl && messages.some((m) => m.role === 'assistant' && m.content) && !streaming && (
                  <div className="flex justify-center pt-1">
                    <button
                      onClick={() => setHelpanyMode(true)}
                      className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
                    >
                      <HeadsetIcon className="h-3.5 w-3.5 text-gray-400" />
                      상담사 연결
                    </button>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input area */}
              <div className="border-t border-gray-100 px-3 py-2 space-y-2">
                {/* 상담사 연결 button (footer, always visible when helpany enabled) */}
                {helpanyUrl && (
                  <button
                    onClick={() => setHelpanyMode(true)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-100"
                  >
                    <HeadsetIcon className="h-3.5 w-3.5" />
                    사람과 직접 상담하기
                  </button>
                )}
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요…"
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    style={{ maxHeight: '96px' }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || streaming}
                    aria-label="전송"
                    className={`flex-shrink-0 rounded-xl p-2 text-white transition-colors disabled:opacity-40 ${accentBg} ${accentHoverBg}`}
                  >
                    <SendIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── FAB ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'AI 도우미 닫기' : 'AI 도우미 열기'}
        className={`fixed bottom-[4.5rem] right-4 z-[9991] flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95 md:bottom-6 md:right-6 ${accentBg} ${accentHoverBg}`}
      >
        {open ? <XIcon className="h-5 w-5" /> : <SparklesIcon className="h-5 w-5" />}
      </button>
    </>
  )
}

/* ── Inline SVG icons (no lucide dep needed in this pkg) ── */

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4M22 5h-4M4 17v2M5 18H3" />
    </svg>
  )
}

function BotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2M20 14h2M9 13v2M15 13v2" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

function HeadsetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm16 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5Z" />
      <path d="M3 11a9 9 0 1 1 18 0" />
      <path d="M21 16v2a4 4 0 0 1-4 4h-2.5" />
    </svg>
  )
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}
