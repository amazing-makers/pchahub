'use client'

interface BrandSelectProps {
  brands: string[]
  currentBrand?: string
  currentCategory?: string
  currentSort?: string
}

export function BrandSelect({
  brands,
  currentBrand,
  currentCategory,
  currentSort,
}: BrandSelectProps) {
  function makeHref(brand: string | undefined) {
    const params = new URLSearchParams()
    if (currentCategory) params.set('category', currentCategory)
    if (brand) params.set('brand', brand)
    if (currentSort && currentSort !== 'helpful') params.set('sort', currentSort)
    const qs = params.toString()
    return qs ? `/franchisee-qa?${qs}` : '/franchisee-qa'
  }

  return (
    <select
      defaultValue={currentBrand ?? ''}
      onChange={(e) => {
        window.location.href = makeHref(e.target.value || undefined)
      }}
      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">브랜드 전체</option>
      {brands.map((b) => (
        <option key={b} value={b}>
          {b}
        </option>
      ))}
    </select>
  )
}
