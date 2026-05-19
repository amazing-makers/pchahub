import type { Metadata } from 'next'
import { platformColors, type PlatformKey } from './colors'

/**
 * 사이트별 SEO 메타데이터 헬퍼.
 *
 * 9개 사이트의 layout.tsx에서 사용:
 *   export const metadata = buildSiteMetadata('pchahub')
 *
 * 페이지별 metadata는 export const metadata = buildPageMetadata('pchahub', {...})
 * 형태로 머지.
 */

interface SiteCopy {
  title: string
  description: string
  keywords: string[]
}

const SITE_COPY: Record<PlatformKey, SiteCopy> = {
  pchahub: {
    title: '프차허브 — 한국 프랜차이즈 가맹 정보 플랫폼',
    description:
      '협회 등록 정보공개서를 한눈에. 내게 맞는 프랜차이즈를 찾고 본사와 바로 연결되는 가맹 정보 플랫폼. 가맹비·매장 수·평균 매출·점주 후기를 한 화면에서 비교하세요.',
    keywords: ['프랜차이즈', '가맹', '가맹점', '창업', '정보공개서', '공정거래위원회', '본사', '가맹본부', '가맹 매장', '브랜드'],
  },
  themyungdang: {
    title: '더명당 — 프랜차이즈 입점 매물 + 안전 거래',
    description:
      '프랜차이즈 양도·신규 임대·매각 매물을 검증된 정보와 함께. 권리금·보증금·월세·매출까지 투명하게 공개하고 표준 계약서와 에스크로로 안전 거래.',
    keywords: ['매물', '점포', '상가', '권리금', '양도', '임대', '프랜차이즈 매물', '부동산', '상권', '입지'],
  },
  gongganhansu: {
    title: '공간의한수 — 가맹점 인테리어 시공 매칭',
    description:
      '검증된 시공사 + 매장 갤러리 + 시공 단가 인사이트. F&B 매장 시공 전문 시공사 디렉토리와 평당 단가 비교, 본사 가이드라인 통과 보장 시공 매칭.',
    keywords: ['인테리어', '시공', '시공사', '매장 인테리어', '카페 인테리어', '평당 단가', '본사 가이드라인', 'F&B 시공'],
  },
  themanual: {
    title: '더메뉴얼 — 가맹점 운영 교육 플랫폼',
    description:
      '협회 정보공개서 해석부터 매장 운영·회계·법률·마케팅까지. 실제 점주와 전문가가 가르치는 가맹 사업 교육 + 1:1 멘토링.',
    keywords: ['창업 교육', '가맹 교육', '점주 교육', '매장 운영', '회계', '세무', '가맹사업법', '멘토링'],
  },
  jangsanote: {
    title: '장사노트 — 자영업·가맹점주 커뮤니티',
    description:
      '본사와의 갈등, 매출 부진, 매물 시세, 인력 운영 — 현직 점주들과 함께 푸는 곳. 업종방·지역방·전문가 Q&A + 오프라인 모임.',
    keywords: ['자영업', '점주 커뮤니티', '가맹점주', '장사', '매장 운영', '점주 모임', '오프라인 모임', '본사 분쟁'],
  },
  bestplace: {
    title: '베스트플레이스 — 매장 디렉토리 + 베스트 어워드',
    description:
      '전국 프랜차이즈 매장과 매년 베스트 브랜드 시상. 평점·방문객·신규 오픈 기준으로 매장을 비교하고, 분기·연간 어워드 후보 매장을 한눈에.',
    keywords: ['매장 검색', '맛집', '어워드', '베스트 브랜드', '인기 매장', '프랜차이즈 매장'],
  },
  changupdocu: {
    title: '창업다큐 — 자영업·가맹의 진짜 이야기',
    description:
      '성공·실패·브랜드·트렌드. 한국 프랜차이즈 + 자영업 현장을 영상 다큐멘터리와 매거진으로 기록합니다. 실제 점주 인터뷰와 시장 분석.',
    keywords: ['프랜차이즈 다큐', '창업 매거진', '점주 인터뷰', '브랜드 다큐', '시장 분석', '창업 트렌드'],
  },
  openrun: {
    title: '오픈런 — 프랜차이즈 본사·매장 마케팅 에이전시',
    description:
      '그랜드 오픈 + 가맹 모집 + 본사 브랜드 마케팅을 통합 운영. SNS·인플루언서·배달앱·이벤트까지 패키지로 한 번에.',
    keywords: ['프랜차이즈 마케팅', '그랜드 오픈', '가맹 모집', 'SNS 마케팅', '인플루언서', '배달앱 광고'],
  },
  pchabridge: {
    title: '프차브릿지 — 프랜차이즈 투자 + M&A',
    description:
      '본사 Seed·Series·다점포 펀딩·M&A. 프랜차이즈 자본 거래 플랫폼. 본사 투자 라운드와 매각 매물을 검증된 데이터로 매칭.',
    keywords: ['프랜차이즈 투자', '본사 투자', '시리즈A', 'M&A', '다점포 펀딩', '크라우드펀딩', '가맹사업 매각'],
  },
}

/**
 * 사이트 루트 metadata. layout.tsx에서 사용.
 */
export function buildSiteMetadata(platform: PlatformKey): Metadata {
  const copy = SITE_COPY[platform]
  const brand = platformColors[platform]
  const url = `https://${brand.domain}`

  return {
    metadataBase: new URL(url),
    title: {
      default: copy.title,
      template: `%s | ${brand.name}`,
    },
    description: copy.description,
    keywords: copy.keywords,
    authors: [{ name: 'amakers' }],
    creator: 'amakers',
    publisher: 'amakers',
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url,
      siteName: brand.name,
      title: copy.title,
      description: copy.description,
      // og 이미지는 각 사이트 app/opengraph-image.tsx (Next.js file convention)
      // 에서 동적 생성되어 자동으로 첨부됨.
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  }
}

/**
 * 개별 페이지 metadata. /brands/[id] 같은 페이지에서 사용:
 *
 *   export const generateMetadata = (props) => buildPageMetadata('pchahub', {
 *     title: `${brand.name} 가맹 정보`,
 *     description: `${brand.name}의 가맹비·매장 수·평균 매출`,
 *   })
 */
export function buildPageMetadata(
  platform: PlatformKey,
  overrides: {
    title?: string
    description?: string
    path?: string
    /**
     * Open Graph 타입. 기사·영상·포스트 페이지는 'article', 기본값은 'website'.
     * 'article'로 설정하면 publishedTime·authors 메타 태그도 자동으로 포함.
     */
    openGraphType?: 'website' | 'article'
    /** ISO 날짜 문자열 (openGraphType === 'article'일 때 사용) */
    publishedTime?: string
    /** 저자 이름 목록 (openGraphType === 'article'일 때 사용) */
    authors?: string[]
  },
): Metadata {
  const base = buildSiteMetadata(platform)
  const brand = platformColors[platform]
  const url = overrides.path
    ? new URL(overrides.path, `https://${brand.domain}`).toString()
    : `https://${brand.domain}`

  const isArticle = overrides.openGraphType === 'article'

  return {
    ...base,
    title: overrides.title,
    description: overrides.description ?? base.description,
    openGraph: {
      ...(base.openGraph ?? {}),
      type: isArticle ? 'article' : 'website',
      title: overrides.title ?? undefined,
      description: overrides.description ?? base.description ?? undefined,
      url,
      ...(isArticle && overrides.publishedTime && {
        publishedTime: overrides.publishedTime,
      }),
      ...(isArticle && overrides.authors && {
        authors: overrides.authors,
      }),
    },
    twitter: {
      ...(base.twitter ?? {}),
      title: overrides.title ?? undefined,
      description: overrides.description ?? base.description ?? undefined,
    },
    alternates: {
      canonical: url,
    },
  }
}
