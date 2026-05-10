const KRW = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 })
const NUM = new Intl.NumberFormat('ko-KR')

export function formatPrice(value: number | bigint | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return KRW.format(typeof value === 'bigint' ? value : value)
}

export function formatNumber(value: number | bigint | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return NUM.format(typeof value === 'bigint' ? value : value)
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diffMs = Date.now() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}시간 전`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}일 전`
  return formatDate(d)
}

export function formatPyeong(squareMeters: number): string {
  const pyeong = squareMeters / 3.3058
  return `${pyeong.toFixed(1)}평`
}
