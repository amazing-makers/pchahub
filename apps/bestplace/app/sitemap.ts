import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { AVAILABLE_YEARS, STORES } from '@/lib/mock-data'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap('bestplace', [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/stores', changeFrequency: 'daily', priority: 0.9 },
    { path: '/stores/new', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/awards', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/rankings', changeFrequency: 'daily', priority: 0.8 },
    ...AVAILABLE_YEARS.map((y) => ({
      path: `/awards/${y}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...STORES.map((s) => ({
      path: `/stores/${s.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ])
}
