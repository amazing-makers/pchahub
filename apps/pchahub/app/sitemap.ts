import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { BRANDS, CATEGORIES } from '@/lib/mock-data'
import { DISCUSSIONS } from '@/lib/mock-community'
import { LISTINGS } from '@/lib/mock-listings'
import { THEMES } from '@/lib/themes'
import { GUIDE_ARTICLES, GUIDE_CATEGORIES } from '@/lib/guide-data'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap('pchahub', [
    { path: '/', changeFrequency: 'daily', priority: 1 },

    // 브랜드 탐색 (탭: 브랜드 검색 / 시장 트렌드 / 지역별 탐색)
    { path: '/brands', changeFrequency: 'daily', priority: 0.9 },
    { path: '/brands?tab=trends', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/brands?tab=regions', changeFrequency: 'weekly', priority: 0.8 },
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

    // 매물
    { path: '/listings', changeFrequency: 'daily', priority: 0.9 },
    ...LISTINGS.map((l) => ({
      path: `/listings/${l.id}`,
      lastModified: l.listedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),

    // 창업 가이드
    { path: '/guide', changeFrequency: 'weekly', priority: 0.9 },
    ...GUIDE_ARTICLES.map((a) => ({
      path: `/guide/${a.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...GUIDE_CATEGORIES.map((c) => ({
      path: `/guide?cat=${c.key}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),

    // 창업 도구 (탭: 브랜드 스캐너 / 수익 계산기)
    { path: '/scanner', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/scanner?tab=calculator', changeFrequency: 'monthly', priority: 0.7 },

    // 커뮤니티 (탭: 토론/후기 / 전문가Q&A / 점주 경험담)
    { path: '/community', changeFrequency: 'daily', priority: 0.8 },
    { path: '/community?tab=questions', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/community?tab=franchisee-qa', changeFrequency: 'weekly', priority: 0.7 },
    ...DISCUSSIONS.map((d) => ({
      path: `/community/${d.id}`,
      lastModified: d.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),

    // 기타
    { path: '/themes', changeFrequency: 'weekly', priority: 0.8 },
    ...THEMES.map((t) => ({
      path: `/themes/${t.key}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    { path: '/timeline', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/for-brands', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
  ])
}
