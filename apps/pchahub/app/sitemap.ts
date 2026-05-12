import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { BRANDS, CATEGORIES } from '@/lib/mock-data'
import { LISTINGS } from '@/lib/mock-listings'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap('pchahub', [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/brands', changeFrequency: 'daily', priority: 0.9 },
    { path: '/listings', changeFrequency: 'daily', priority: 0.9 },
    { path: '/themes', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/community', changeFrequency: 'daily', priority: 0.7 },
    { path: '/scanner', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/calculator', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/for-brands', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/for-brands/register', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
    ...BRANDS.map((b) => ({
      path: `/brands/${b.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...CATEGORIES.map((c) => ({
      path: `/categories/${c.key}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...LISTINGS.map((l) => ({
      path: `/listings/${l.id}`,
      lastModified: l.listedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ])
}
