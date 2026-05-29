'use client'

/**
 * AiChatTriggerLink — dispatches 'openAiChat' CustomEvent to open the floating
 * AiChatWidget FAB panel. Styled as a plain text nav link using the platform's
 * brand primary colour (var(--brand-primary)).
 */
export function AiChatTriggerLink({ label = 'AI 상담' }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('openAiChat'))}
      className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
      style={{ color: 'var(--brand-primary)' }}
    >
      <SparklesIcon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4M22 5h-4M4 17v2M5 18H3" />
    </svg>
  )
}
