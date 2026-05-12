import type { MetadataRoute } from 'next'
import { platformColors, type PlatformKey } from './colors'

/**
 * sitemap.ts / robots.ts 헬퍼.
 *
 * 사용 예 (apps/pchahub/app/sitemap.ts):
 *
 *   import { buildSitemap } from '@amakers/design-system'
 *   import { BRANDS, CATEGORIES } from '@/lib/mock-data'
 *
 *   export default function sitemap() {
 *     return buildSitemap('pchahub', [
 *       { path: '/' },
 *       { path: '/brands', changeFrequency: 'daily' },
 *       ...BRANDS.map((b) => ({ path: `/brands/${b.id}` })),
 *       ...CATEGORIES.map((c) => ({ path: `/categories/${c.key}` })),
 *     ])
 *   }
 */

export interface SitemapEntry {
  path: string
  /** ISO date string. */
  lastModified?: string | Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export function buildSitemap(
  platform: PlatformKey,
  entries: SitemapEntry[],
): MetadataRoute.Sitemap {
  const brand = platformColors[platform]
  const baseUrl = `https://${brand.domain}`
  return entries.map((e) => ({
    url: new URL(e.path, baseUrl).toString(),
    lastModified: e.lastModified ? new Date(e.lastModified) : new Date(),
    changeFrequency: e.changeFrequency ?? 'weekly',
    priority: e.priority ?? (e.path === '/' ? 1 : 0.7),
  }))
}

/**
 * robots.ts 헬퍼.
 *
 * 사용 예:
 *
 *   import { buildRobots } from '@amakers/design-system'
 *   export default function robots() { return buildRobots('pchahub') }
 */

export function buildRobots(platform: PlatformKey): MetadataRoute.Robots {
  const brand = platformColors[platform]
  const baseUrl = `https://${brand.domain}`
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/mypage/',
          '/hq/',
          '/admin/',
          '/_next/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: brand.domain,
  }
}
