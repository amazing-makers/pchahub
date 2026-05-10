import type { Config } from 'tailwindcss'
import preset from '@amakers/design-system/tailwind-preset'

const config: Config = {
  presets: [preset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#4F46E5',
      },
    },
  },
}

export default config