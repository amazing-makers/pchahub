import * as React from 'react'

/**
 * schema.org JSON-LD structured data 빌더.
 *
 * Google Rich Results 가이드라인을 따르며, 각 페이지에서 <script type="application/ld+json"/>
 * 형태로 inject한다.
 *
 * 사용 예:
 *   <script
 *     type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd(...)) }}
 *   />
 */

interface OrganizationInput {
  name: string
  url: string
  logo?: string
  description?: string
  /** 영업 지역 (시·도) */
  region?: string
  /** 사업자등록번호 */
  taxId?: string
}

export function buildOrganizationJsonLd(input: OrganizationInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.name,
    url: input.url,
    ...(input.logo && { logo: input.logo }),
    ...(input.description && { description: input.description }),
    ...(input.region && {
      address: {
        '@type': 'PostalAddress',
        addressRegion: input.region,
        addressCountry: 'KR',
      },
    }),
    ...(input.taxId && { taxID: input.taxId }),
  }
}

interface BrandJsonLdInput {
  name: string
  description: string
  url: string
  image?: string
  category?: string
  numberOfStores?: number
  aggregateRating?: { ratingValue: number; reviewCount: number }
}

export function buildBrandJsonLd(input: BrandJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image && { image: input.image }),
    ...(input.category && { category: input.category }),
    ...(input.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: input.aggregateRating.ratingValue,
        reviewCount: input.aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  }
}

interface RealEstateListingInput {
  name: string
  description: string
  url: string
  image?: string
  /** 단위: 만원 */
  priceWon?: number
  /** 양도/임대/매각 */
  listingType: '양도' | '신규임대' | '매각'
  region: string
  district: string
  fullAddress?: string
  areaPyeong: number
  availableFrom?: string
}

export function buildRealEstateListingJsonLd(input: RealEstateListingInput) {
  // schema.org는 평이 아니라 m²를 기본으로 사용 — 1평 ≈ 3.3m²
  const areaSqm = Math.round(input.areaPyeong * 3.3)
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image && { image: input.image }),
    datePosted: new Date().toISOString().slice(0, 10),
    ...(input.availableFrom && { availabilityStarts: input.availableFrom }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: input.district,
      addressRegion: input.region,
      addressCountry: 'KR',
      ...(input.fullAddress && { streetAddress: input.fullAddress }),
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: areaSqm,
      unitCode: 'MTK', // 제곱미터
    },
    ...(input.priceWon && {
      offers: {
        '@type': 'Offer',
        price: input.priceWon * 10000, // 만원 → 원
        priceCurrency: 'KRW',
        category: input.listingType,
      },
    }),
  }
}

interface LocalBusinessInput {
  name: string
  description?: string
  url: string
  image?: string
  region: string
  district: string
  fullAddress?: string
  rating?: number
  reviewCount?: number
  openedYear?: number
}

export function buildLocalBusinessJsonLd(input: LocalBusinessInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: input.name,
    ...(input.description && { description: input.description }),
    url: input.url,
    ...(input.image && { image: input.image }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: input.district,
      addressRegion: input.region,
      addressCountry: 'KR',
      ...(input.fullAddress && { streetAddress: input.fullAddress }),
    },
    ...(input.openedYear && {
      foundingDate: `${input.openedYear}-01-01`,
    }),
    ...(input.rating &&
      input.reviewCount && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: input.rating,
          reviewCount: input.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
      }),
  }
}

interface CourseJsonLdInput {
  name: string
  description: string
  url: string
  image?: string
  provider: string
  instructors?: Array<{ name: string }>
  /** 단위: 원 */
  price: number
  durationMin: number
  rating?: number
  reviewCount?: number
}

export function buildCourseJsonLd(input: CourseJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image && { image: input.image }),
    provider: {
      '@type': 'Organization',
      name: input.provider,
      sameAs: 'https://themanual.kr',
    },
    ...(input.instructors &&
      input.instructors.length > 0 && {
        instructor: input.instructors.map((i) => ({
          '@type': 'Person',
          name: i.name,
        })),
      }),
    offers: {
      '@type': 'Offer',
      price: input.price,
      priceCurrency: 'KRW',
      category: input.price === 0 ? 'Free' : 'Paid',
    },
    timeRequired: `PT${input.durationMin}M`,
    ...(input.rating &&
      input.reviewCount && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: input.rating,
          reviewCount: input.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
      }),
  }
}

interface ArticleJsonLdInput {
  headline: string
  description: string
  url: string
  image?: string
  authorName: string
  authorRole?: string
  publishedAt: string
  publisher: { name: string; url: string }
}

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: input.url,
    ...(input.image && { image: input.image }),
    datePublished: input.publishedAt,
    dateModified: input.publishedAt,
    author: {
      '@type': 'Person',
      name: input.authorName,
      ...(input.authorRole && { jobTitle: input.authorRole }),
    },
    publisher: {
      '@type': 'Organization',
      name: input.publisher.name,
      url: input.publisher.url,
    },
  }
}

interface BreadcrumbsInput {
  items: Array<{ name: string; url: string }>
}

export function buildBreadcrumbsJsonLd(input: BreadcrumbsInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: input.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * React 컴포넌트 형태로 JSON-LD를 inject하는 헬퍼.
 * 페이지 컴포넌트에서:
 *   <JsonLd data={buildBrandJsonLd(...)} />
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
