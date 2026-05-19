'use client'

interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  avatarUrl: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  brandPrimary?: string
}

export function Testimonials({ testimonials, brandPrimary = '#F97316' }: TestimonialsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {testimonials.map((t) => (
        <div key={t.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-3xl font-bold" style={{ color: brandPrimary }}>"</div>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{t.quote}</p>
          <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
            {t.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={t.avatarUrl}
                alt={t.author}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget
                  img.style.display = 'none'
                  const fallback = img.nextElementSibling as HTMLElement | null
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
            ) : null}
            <div
              className="h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: brandPrimary, display: t.avatarUrl ? 'none' : 'flex' }}
              aria-hidden="true"
            >
              {t.author.slice(0, 1)}
            </div>
            <div className="text-sm">
              <div className="font-semibold text-gray-900">{t.author}</div>
              <div className="text-xs text-gray-500">{t.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
