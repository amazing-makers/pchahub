export const fontFamily: Record<string, string[]> = {
  sans: ['Pretendard', 'Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}

export type FontSizeEntry = [string, { lineHeight: string; fontWeight: string }]

// Headings use clamp() so they scale fluidly between mobile and desktop.
// The clamp MAX equals the previous fixed size, so desktop rendering is
// unchanged; the MIN keeps long Korean headlines from overflowing on
// narrow phones. Line-heights are unitless ratios that resolve to the
// original pixel line-heights at the desktop max.
export const fontSize: Record<string, FontSizeEntry> = {
  hero: ['clamp(2.125rem, 8vw, 3.5rem)', { lineHeight: '1.15', fontWeight: '700' }],
  h1: ['clamp(1.75rem, 6vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '700' }],
  h2: ['clamp(1.5rem, 5vw, 2rem)', { lineHeight: '1.25', fontWeight: '600' }],
  h3: ['clamp(1.25rem, 4vw, 1.5rem)', { lineHeight: '1.33', fontWeight: '600' }],
  h4: ['clamp(1.125rem, 3vw, 1.25rem)', { lineHeight: '1.4', fontWeight: '600' }],
  body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
  small: ['14px', { lineHeight: '20px', fontWeight: '400' }],
  xs: ['12px', { lineHeight: '16px', fontWeight: '400' }],
}
