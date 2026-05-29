import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { AVAILABLE_YEARS, AWARDS, STORES } from '@/lib/mock-data'
import { CAMPAIGNS } from '@/lib/mock-experiences'
import { BRAND_STORIES } from '@/lib/brand-stories-data'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap('bestplace', [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/monthly-best', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/experiences', changeFrequency: 'daily', priority: 0.9 },
    { path: '/stores', changeFrequency: 'daily', priority: 0.9 },
    { path: '/awards', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/rankings', changeFrequency: 'daily', priority: 0.8 },
    { path: '/stories', changeFrequency: 'monthly', priority: 0.8 },
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
    ...CAMPAIGNS.map((c) => ({
      path: `/experiences/${c.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...AWARDS.filter((a) => a.rank === 1).map((a) => ({
      path: `/certificate/${a.id}`,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
    ...BRAND_STORIES.map((s) => ({
      path: `/stories/${s.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ])
}
