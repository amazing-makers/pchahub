import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { BRANDS, CATEGORIES } from '@/lib/mock-data'
import { DISCUSSIONS } from '@/lib/mock-community'
import { LISTINGS } from '@/lib/mock-listings'
import { THEMES } from '@/lib/themes'
import { GUIDE_ARTICLES, GUIDE_CATEGORIES } from '@/lib/guide-data'
import { KOREAN_REGIONS } from '@/lib/regions-data'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap('pchahub', [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/brands', changeFrequency: 'daily', priority: 0.9 },
    { path: '/listings', changeFrequency: 'daily', priority: 0.9 },
    // 창업 가이드
    { path: '/guide', changeFrequency: 'weekly', priority: 0.9 },
    ...GUIDE_ARTICLES.map((a) => ({
      path: `/guide/${a.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    // 시장 트렌드
    { path: '/trends', changeFrequency: 'monthly', priority: 0.8 },
    // 지역별 탐색
    { path: '/regions', changeFrequency: 'weekly', priority: 0.8 },
    ...KOREAN_REGIONS.map((r) => ({
      path: `/regions/${encodeURIComponent(r.key)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    { path: '/themes', changeFrequency: 'weekly', priority: 0.8 },
    ...THEMES.map((t) => ({
      path: `/themes/${t.key}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    { path: '/community', changeFrequency: 'daily', priority: 0.7 },
    ...DISCUSSIONS.map((d) => ({
      path: `/community/${d.id}`,
      lastModified: d.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    { path: '/scanner', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/calculator', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/timeline', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/for-brands', changeFrequency: 'monthly', priority: 0.6 },
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
    // 가이드 카테고리 필터 URL
    ...GUIDE_CATEGORIES.map((c) => ({
      path: `/guide?cat=${c.key}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ])
}
