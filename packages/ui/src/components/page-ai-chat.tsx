'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export interface PageAiChatProps {
  /** Opening greeting / context message */
  greeting?: string
  /** Placeholder in the input box */
  placeholder?: string
  /** Tailwind bg class for assistant bubbles and send button */
  accentBg?: string
  /** Tailwind hover bg class for send button */
  accentHoverBg?: string
  /** Tailwind text color class that works on accentBg */
  accentText?: string
  /**
   * Helpany company ID — when provided, a "상담사 연결" button allows
   * the user to escalate to a human agent via Helpany webchat.
   */
  helpanyCompanyId?: string
  /** Additional CSS class for the outer wrapper */
  className?: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

/**
 * PageAiChat — inline (non-floating) AI chat panel for embedding
 * directly inside category pages, guide pages, etc.
 */
export function PageAiChat({
  greeting = '이 페이지에 대해 궁금한 점을 물어보세요 😊',
  placeholder = '질문을 입력하세요…',
  accentBg = 'bg-indigo-600',
  accentHoverBg = 'hover:bg-indigo-700',
  accentText = 'text-white',
  helpanyCompanyId,
  className = '',
}: PageAiChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [helpanyMode, setHelpanyMode] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!helpanyMode) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming, helpanyMode])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg: Message = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setStreaming(true)
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

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
            const { text: chunk } = JSON.parse(payload) as { text: string }
            setMessages((prev) => {
              const next = [...prev]
              next[next.length - 1] = {
                role: 'assistant',
                content: next[next.length - 1].content + chunk,
              }
              return next
            })
          } catch { /* ignore malformed chunk */ }
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

  const helpanyUrl = helpanyCompanyId
    ? `https://www.helpany.work/public/chat/${helpanyCompanyId}`
    : undefined

  return (
    <div className={`flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 ${accentBg} ${accentText}`}>
        {helpanyMode ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHelpanyMode(false)}
              aria-label="AI로 돌아가기"
              className="rounded-lg p-0.5 transition-colors hover:bg-white/20"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <HeadsetIcon className="h-4 w-4" />
            <span className="text-sm font-semibold">상담사 채팅</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">실시간</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4" />
            <span className="text-sm font-semibold">AI 도우미</span>
          </div>
        )}
        {helpanyMode && helpanyUrl && (
          <button
            onClick={() => setHelpanyMode(false)}
            className="rounded-lg px-2 py-1 text-xs transition-colors hover:bg-white/20"
          >
            AI로 돌아가기
          </button>
        )}
      </div>

      {/* Body */}
      {helpanyMode && helpanyUrl ? (
        <iframe
          src={helpanyUrl}
          className="w-full border-none"
          style={{ height: '480px' }}
          allow="clipboard-write"
          title="상담사 채팅"
        />
      ) : (
        <>
          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            style={{ minHeight: '200px', maxHeight: '360px' }}
          >
            {/* Greeting */}
            <div className="flex gap-2">
              <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${accentBg} ${accentText}`}>
                <BotIcon className="h-4 w-4" />
              </div>
              <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 text-sm text-gray-800 leading-relaxed">
                {greeting}
              </div>
            </div>

            {messages.map((msg, i) =>
              msg.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className={`max-w-[88%] rounded-2xl rounded-tr-sm px-3 py-2 text-sm leading-relaxed ${accentBg} ${accentText}`}>
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex gap-2">
                  <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${accentBg} ${accentText}`}>
                    <BotIcon className="h-4 w-4" />
                  </div>
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
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

            {/* "상담사 연결" suggestion — after ≥1 AI reply */}
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

          {/* Input */}
          <div className="border-t border-gray-100 px-3 py-2 space-y-2">
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
                placeholder={placeholder}
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                style={{ maxHeight: '80px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || streaming}
                aria-label="전송"
                className={`flex-shrink-0 rounded-xl p-2 transition-colors disabled:opacity-40 ${accentBg} ${accentText} ${accentHoverBg}`}
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ── Icons ── */

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
