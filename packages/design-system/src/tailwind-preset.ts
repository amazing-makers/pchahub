import type { Config } from 'tailwindcss'
import { semanticColors, grayColors } from './colors'
import { fontFamily, fontSize } from './typography'
import { borderRadius, spacing } from './layout'

const preset: Partial<Config> = {
  theme: {
    extend: {
      fontFamily,
      fontSize,
      colors: {
        gray: { ...grayColors },
        success: semanticColors.success,
        error: semanticColors.error,
        warning: semanticColors.warning,
        info: semanticColors.info,
      },
      borderRadius: { ...borderRadius },
      spacing: {
        section: spacing.section,
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '16px',
          md: '32px',
        },
        screens: {
          '2xl': '1280px',
        },
      },
    },
  },
}

export default preset
