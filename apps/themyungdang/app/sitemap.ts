import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { AREAS, LISTINGS } from '@/lib/mock-data'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap('themyungdang', [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/listings', changeFrequency: 'daily', priority: 0.9 },
    { path: '/listings/map', changeFrequency: 'daily', priority: 0.8 },
    { path: '/areas', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/safe-deal', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/price-guide', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/seller-guide', changeFrequency: 'monthly', priority: 0.8 },
    ...LISTINGS.map((l) => ({
      path: `/listings/${l.id}`,
      lastModified: l.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...AREAS.map((a) => ({
      path: `/areas/${a.key}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ])
}
