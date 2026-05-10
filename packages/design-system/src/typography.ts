export const fontFamily: Record<string, string[]> = {
  sans: ['Pretendard', 'Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}

export type FontSizeEntry = [string, { lineHeight: string; fontWeight: string }]

export const fontSize: Record<string, FontSizeEntry> = {
  hero: ['56px', { lineHeight: '64px', fontWeight: '700' }],
  h1: ['40px', { lineHeight: '48px', fontWeight: '700' }],
  h2: ['32px', { lineHeight: '40px', fontWeight: '600' }],
  h3: ['24px', { lineHeight: '32px', fontWeight: '600' }],
  h4: ['20px', { lineHeight: '28px', fontWeight: '600' }],
  body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
  small: ['14px', { lineHeight: '20px', fontWeight: '400' }],
  xs: ['12px', { lineHeight: '16px', fontWeight: '400' }],
}
