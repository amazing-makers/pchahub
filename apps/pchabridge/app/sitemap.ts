import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { MA_LISTINGS, ROUNDS } from '@/lib/mock-data'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap('pchabridge', [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/investments', changeFrequency: 'daily', priority: 0.9 },
    { path: '/portfolio', changeFrequency: 'daily', priority: 0.8 },
    { path: '/ma', changeFrequency: 'daily', priority: 0.9 },
    { path: '/funding', changeFrequency: 'daily', priority: 0.8 },
    { path: '/dealflow', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/guide', changeFrequency: 'monthly', priority: 0.7 },
    ...ROUNDS.map((r) => ({
      path: `/investments/${r.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...MA_LISTINGS.map((m) => ({
      path: `/ma/${m.id}`,
      lastModified: m.listedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ])
}
