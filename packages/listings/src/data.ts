// 외부 출처 raw JSON → MockListing 변환.
//
// 더명당이 본가지만 매물 데이터 자체는 사이트 중립적. 패키지 import만 하면
// 어느 앱이든 동일한 LISTINGS 배열을 얻는다.

import type { ExternalListingRaw, ExternalListingsJson, MockListing } from './types'
import cmRaw from '../data/cm-listings.json'

function fromExternal(json: ExternalListingsJson): MockListing[] {
  return json.listings
    .filter((r): r is ExternalListingRaw => Boolean(r.title && r.region))
    .map((r): MockListing => ({
      id: `cm${r.sourceId}`,
      type: r.type,
      title: r.title,
      status: 'active',
      region: r.region,
      district: r.district,
      fullAddress: r.fullAddress || `${r.region} ${r.district}`.trim(),
      area: r.area || 0,
      floor: '',
      buildingType: '',
      rightFee: r.rightFee,
      // 창업몰은 보증금/월세 미수집. 0으로 둠.
      deposit: 0,
      monthlyRent: 0,
      fitCategories: r.fitCategories,
      currentBusiness: r.currentBusiness,
      monthlyRevenue: r.monthlyRevenue,
      revenueVerified: false,
      tags: [],
      footTraffic: 0,
      availableFrom: '협의',
      verified: false,
      featured: false,
      viewCount: 0,
      inquiryCount: 0,
      createdAt: json.fetchedAt.slice(0, 10),
      ownerType: 'agent',
      agencyName: json.label,
      imageColors: ['#e5e7eb', '#f3f4f6'],
      images: r.photos,
      externalSource: {
        name: json.source,
        label: json.label,
        sourceId: r.sourceId,
        url: r.url,
        fetchedAt: json.fetchedAt,
      },
    }))
}

const _CHANGUPMALL = fromExternal(cmRaw as ExternalListingsJson)

// 향후 다른 외부 출처(점포라인 등) 추가 시 같은 패턴으로 _XXX 만들어 합치기.
export const LISTINGS: MockListing[] = [..._CHANGUPMALL]
