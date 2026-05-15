// 매물 사진 URL 변환 헬퍼.
//
// 사진 파일은 더명당(themyungdang)에서만 호스팅. cm-listings.json의 photos
// 경로는 상대 path(`/listings/cm{id}/{n}.jpg`)로 저장돼 있어 더명당 자신은
// 그대로 사용할 수 있지만, 다른 앱(pchahub 등)은 절대 URL이 필요하다.
//
// 환경변수 NEXT_PUBLIC_LISTINGS_HOST 가 설정돼 있으면 그 값을 prefix로 붙여
// 절대 URL을 만들어 반환. 미설정이면 상대 path 그대로 반환 (자기 도메인 호스팅).
//
// dev 환경 예: NEXT_PUBLIC_LISTINGS_HOST=http://localhost:3003
// 운영 환경 예: NEXT_PUBLIC_LISTINGS_HOST=https://themyungdang.kr

export function listingImageUrl(path: string | undefined): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const host = process.env.NEXT_PUBLIC_LISTINGS_HOST?.replace(/\/$/, '') ?? ''
  return `${host}${path}`
}

/** 사진 배열을 일괄 변환. */
export function listingImageUrls(paths: string[] | undefined): string[] {
  if (!paths) return []
  return paths.map(listingImageUrl)
}
