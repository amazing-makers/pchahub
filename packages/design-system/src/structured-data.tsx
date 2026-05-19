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

interface CreativeWorkInput {
  name: string
  description: string
  url: string
  image?: string
  publishedAt?: string
  authorName?: string
  publisher?: { name: string; url: string }
}

/** 시공 사례·캠페인 사례 같은 일반 콘텐츠. */
export function buildCreativeWorkJsonLd(input: CreativeWorkInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image && { image: input.image }),
    ...(input.publishedAt && { datePublished: input.publishedAt }),
    ...(input.authorName && {
      author: { '@type': 'Person', name: input.authorName },
    }),
    ...(input.publisher && {
      publisher: {
        '@type': 'Organization',
        name: input.publisher.name,
        url: input.publisher.url,
      },
    }),
  }
}

interface VideoJsonLdInput {
  name: string
  description: string
  url: string
  thumbnailUrl: string
  uploadDate: string
  duration?: string
}

/** 다큐멘터리 에피소드 — Google VideoObject. */
export function buildVideoJsonLd(input: VideoJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: input.name,
    description: input.description,
    thumbnailUrl: input.thumbnailUrl,
    uploadDate: input.uploadDate,
    contentUrl: input.url,
    ...(input.duration && { duration: input.duration }),
  }
}

interface DiscussionInput {
  headline: string
  url: string
  upvoteCount?: number
  commentCount?: number
}

export function buildDiscussionJsonLd(input: DiscussionInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: input.headline,
    url: input.url,
    ...(input.upvoteCount && {
      interactionStatistic: [
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/LikeAction',
          userInteractionCount: input.upvoteCount,
        },
        ...(input.commentCount
          ? [
              {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/CommentAction',
                userInteractionCount: input.commentCount,
              },
            ]
          : []),
      ],
    }),
  }
}

interface InvestmentJsonLdInput {
  name: string
  description: string
  url: string
  image?: string
  /** 만원 단위 — schema.org 단위는 KRW */
  targetAmount: number
  expectedRoi: number
  closeDate: string
}

/** 투자 라운드 — InvestmentOrDeposit. */
export function buildInvestmentJsonLd(input: InvestmentJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'InvestmentOrDeposit',
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image && { image: input.image }),
    amount: {
      '@type': 'MonetaryAmount',
      value: input.targetAmount * 10000,
      currency: 'KRW',
    },
    interestRate: input.expectedRoi,
    validThrough: input.closeDate,
  }
}

interface ItemListInput {
  /** 목록 페이지 자체의 canonical URL (선택) */
  url?: string
  /** 목록에 노출되는 항목들 — position은 자동 부여 */
  items: Array<{ name: string; url: string }>
}

/**
 * Google 구조화 데이터 — ItemList.
 * 브랜드·강의·멘토·매물·시공사 등 목록 페이지에 추가하면
 * 검색결과 사이트링크(Sitelinks) 형태로 노출될 수 있다.
 */
export function buildItemListJsonLd(input: ItemListInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(input.url && { url: input.url }),
    itemListElement: input.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  }
}

interface PersonJsonLdInput {
  name: string
  url: string
  description?: string
  image?: string
  jobTitle?: string
  /** 소속 조직 이름 */
  organization?: string
  /** 전문 분야 키워드 목록 */
  knowsAbout?: string[]
  /** 서비스 상품 (멘토링 등) */
  offer?: {
    /** 단위: 원 */
    price: number
    description?: string
  }
  /** 집계 평점 */
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
}

/**
 * Google 구조화 데이터 — Person.
 * 멘토·전문가 상세 페이지에 추가하면 인물 카드로 노출될 수 있다.
 */
export function buildPersonJsonLd(input: PersonJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    url: input.url,
    ...(input.description && { description: input.description }),
    ...(input.image && { image: input.image }),
    ...(input.jobTitle && { jobTitle: input.jobTitle }),
    ...(input.organization && {
      worksFor: { '@type': 'Organization', name: input.organization },
    }),
    ...(input.knowsAbout?.length && { knowsAbout: input.knowsAbout }),
    ...(input.offer && {
      offers: {
        '@type': 'Offer',
        price: input.offer.price,
        priceCurrency: 'KRW',
        ...(input.offer.description && { description: input.offer.description }),
      },
    }),
    ...(input.aggregateRating &&
      input.aggregateRating.reviewCount > 0 && {
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

interface WebSiteInput {
  /** 사이트 이름 */
  name: string
  /** 사이트 canonical URL (홈) */
  url: string
  /**
   * 검색 URL 패턴. 예: "https://example.kr/search?q={search_term_string}"
   * 제공하면 Google Sitelinks Searchbox SearchAction 포함.
   */
  searchUrlTemplate?: string
}

/**
 * Google 구조화 데이터 — WebSite.
 * 홈페이지에 추가하면 Google 검색에서 사이트 이름과 Sitelinks Searchbox로 노출될 수 있다.
 */
export function buildWebSiteJsonLd(input: WebSiteInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: input.name,
    url: input.url,
    ...(input.searchUrlTemplate && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: input.searchUrlTemplate,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  }
}

interface EventJsonLdInput {
  name: string
  description: string
  url: string
  image?: string
  /** ISO date string or yyyy-mm-dd */
  startDate: string
  /** ISO date string or yyyy-mm-dd */
  endDate?: string
  startTime?: string
  endTime?: string
  /** 'offline' | 'online' | 'hybrid' */
  eventType: 'offline' | 'online' | 'hybrid'
  locationName?: string
  locationAddress?: string
  /** 만원 단위 — 0이면 무료 */
  priceWon?: number
  organizer?: { name: string; url?: string }
  /** 'scheduled' | 'cancelled' | 'sold-out' */
  status?: 'scheduled' | 'cancelled' | 'sold-out'
}

/**
 * Google 구조화 데이터 — Event.
 * 모임·세미나·오프라인 이벤트에 추가하면 Google 검색에서 이벤트 카드로 노출될 수 있다.
 */
export function buildEventJsonLd(input: EventJsonLdInput) {
  const startDateTime = input.startTime
    ? `${input.startDate}T${input.startTime}:00+09:00`
    : input.startDate
  const endDateTime = input.endDate
    ? input.endTime
      ? `${input.endDate}T${input.endTime}:00+09:00`
      : input.endDate
    : input.startTime && input.endTime
    ? `${input.startDate}T${input.endTime}:00+09:00`
    : undefined

  const eventStatusMap = {
    scheduled: 'https://schema.org/EventScheduled',
    cancelled: 'https://schema.org/EventCancelled',
    'sold-out': 'https://schema.org/EventSoldOut',
  }

  const locationObj =
    input.eventType === 'offline' || input.eventType === 'hybrid'
      ? {
          location: {
            '@type': 'Place',
            name: input.locationName ?? '장소 미정',
            ...(input.locationAddress && {
              address: {
                '@type': 'PostalAddress',
                streetAddress: input.locationAddress,
                addressCountry: 'KR',
              },
            }),
          },
        }
      : {
          location: {
            '@type': 'VirtualLocation',
            url: input.url,
          },
        }

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image && { image: input.image }),
    startDate: startDateTime,
    ...(endDateTime && { endDate: endDateTime }),
    eventStatus: eventStatusMap[input.status ?? 'scheduled'],
    eventAttendanceMode:
      input.eventType === 'online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : input.eventType === 'hybrid'
        ? 'https://schema.org/MixedEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
    ...locationObj,
    ...(input.priceWon !== undefined && {
      offers: {
        '@type': 'Offer',
        price: input.priceWon === 0 ? '0' : String(input.priceWon * 10000),
        priceCurrency: 'KRW',
        availability:
          input.status === 'sold-out'
            ? 'https://schema.org/SoldOut'
            : 'https://schema.org/InStock',
        url: input.url,
      },
    }),
    ...(input.organizer && {
      organizer: {
        '@type': 'Organization',
        name: input.organizer.name,
        ...(input.organizer.url && { url: input.organizer.url }),
      },
    }),
  }
}

interface FaqPageInput {
  /** Array of question-answer pairs */
  items: Array<{ question: string; answer: string }>
  /** Page URL (optional) */
  url?: string
}

/**
 * Google 구조화 데이터 — FAQPage.
 * 자주 묻는 질문이 있는 페이지에 추가하면 검색 결과에 FAQ 아코디언으로 노출될 수 있다.
 */
export function buildFaqPageJsonLd(input: FaqPageInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(input.url && { url: input.url }),
    mainEntity: input.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
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

interface HowToInput {
  name: string
  description: string
  url: string
  steps: Array<{ name: string; text: string }>
  /** 총 소요 시간 (ISO 8601 duration, 예: 'PT30M', 'P3D') */
  totalTime?: string
  /** 비용 (원 단위, 0이면 무료) */
  price?: number
}

/**
 * Google 구조화 데이터 — HowTo.
 * 절차·단계가 있는 가이드 페이지에 추가하면 검색 결과에 단계별 리치 카드로 노출될 수 있다.
 */
export function buildHowToJsonLd(input: HowToInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.totalTime && { totalTime: input.totalTime }),
    ...(input.price !== undefined && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        value: String(input.price),
        currency: 'KRW',
      },
    }),
    step: input.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}

interface ServiceJsonLdInput {
  name: string
  description: string
  url: string
  /** 서비스 제공 조직 */
  provider: { name: string; url: string }
  /** 서비스 분야 카테고리 */
  serviceType?: string
  /** 가격 안내 문자열 (정확한 가격을 공개하지 않는 경우) */
  priceLabel?: string
}

/**
 * Google 구조화 데이터 — Service.
 * 마케팅·컨설팅·시공 등 B2B 서비스 상세 페이지에 추가하면
 * 검색 결과에서 서비스 카드로 노출될 수 있다.
 */
export function buildServiceJsonLd(input: ServiceJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: input.url,
    provider: {
      '@type': 'Organization',
      name: input.provider.name,
      url: input.provider.url,
    },
    ...(input.serviceType && { serviceType: input.serviceType }),
    ...(input.priceLabel && {
      offers: {
        '@type': 'Offer',
        description: input.priceLabel,
        priceCurrency: 'KRW',
      },
    }),
  }
}

interface SoftwareApplicationInput {
  name: string
  description: string
  url: string
  /** e.g. 'BusinessApplication', 'FinanceApplication', 'UtilitiesApplication' */
  applicationCategory?: string
  /** 'Free' or price in KRW */
  price?: number | 'Free'
  operatingSystem?: string
}

/**
 * Google 구조화 데이터 — SoftwareApplication / WebApplication.
 * 계산기·스캐너 같은 웹 도구 페이지에 추가하면 검색결과에 앱 카드로 노출될 수 있다.
 */
export function buildSoftwareApplicationJsonLd(input: SoftwareApplicationInput) {
  const isFree = input.price === 'Free' || input.price === 0 || input.price === undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: input.applicationCategory ?? 'WebApplication',
    operatingSystem: input.operatingSystem ?? 'Web',
    offers: {
      '@type': 'Offer',
      price: isFree ? '0' : String(input.price),
      priceCurrency: 'KRW',
    },
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
