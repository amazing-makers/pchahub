'use client'

import * as React from 'react'
import { Check } from 'lucide-react'

export interface NewsletterFormProps {
  /** Submit button label. */
  cta?: string
  /** Confirmation message shown after a successful (mock) subscribe. */
  successMessage?: string
}

/**
 * Newsletter signup form with client-side validation and a success state.
 * Replaces the previous non-functional `<form action="#">` markup that did
 * nothing on submit. No backend wired yet — on submit it validates the email
 * and shows a confirmation so the interaction feels complete.
 */
export function NewsletterForm({
  cta = '구독하기',
  successMessage = '구독 신청이 완료되었습니다. 곧 첫 소식을 보내드릴게요.',
}: NewsletterFormProps) {
  const [email, setEmail] = React.useState('')
  const [done, setDone] = React.useState(false)

  if (done) {
    return (
      <div
        className="mt-6 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium"
        style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
        role="status"
      >
        <Check className="h-4 w-4 shrink-0" />
        {successMessage}
      </div>
    )
  }

  return (
    <form
      className="mt-6 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (email.trim()) setDone(true)
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="이메일 주소"
        placeholder="이메일 주소"
        className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
        style={{ ['--tw-ring-color' as string]: 'var(--brand-primary)' } as React.CSSProperties}
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: 'var(--brand-primary)' }}
      >
        {cta}
      </button>
    </form>
  )
}
