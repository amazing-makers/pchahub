import { ContractorCard } from '@/components/contractor-card'
import { CATEGORIES, CONTRACTORS } from '@/lib/mock-data'

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주']

interface ContractorsPageProps {
  searchParams: { region?: string; specialty?: string }
}

export default function ContractorsPage({ searchParams }: ContractorsPageProps) {
  const { region, specialty } = searchParams
  let results = CONTRACTORS.slice()
  if (region) results = results.filter((c) => c.region === region)
  if (specialty) results = results.filter((c) => c.specialties.includes(specialty))

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">시공사 디렉토리</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            F&B 매장 시공 전문 시공사 {CONTRACTORS.length}곳. 평당 단가·예산 범위·시공 카테고리로 비교.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <FilterGroup title="지역">
              <div className="space-y-1">
                <FilterLink href={makeHref(searchParams, { region: undefined })} active={!region}>
                  전체
                </FilterLink>
                {REGIONS.map((r) => {
                  const count = CONTRACTORS.filter((c) => c.region === r).length
                  if (count === 0) return null
                  return (
                    <FilterLink
                      key={r}
                      href={makeHref(searchParams, { region: r })}
                      active={region === r}
                    >
                      {r} ({count})
                    </FilterLink>
                  )
                })}
              </div>
            </FilterGroup>

            <FilterGroup title="전문 카테고리">
              <div className="space-y-1">
                <FilterLink
                  href={makeHref(searchParams, { specialty: undefined })}
                  active={!specialty}
                >
                  전체
                </FilterLink>
                {CATEGORIES.map((c) => (
                  <FilterLink
                    key={c.key}
                    href={makeHref(searchParams, { specialty: c.key })}
                    active={specialty === c.key}
                  >
                    {c.label}
                  </FilterLink>
                ))}
              </div>
            </FilterGroup>
          </aside>

          <div>
            <div className="mb-3 text-sm font-semibold text-gray-700">{results.length}곳</div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((c) => (
                <ContractorCard key={c.id} contractor={c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function makeHref(
  current: ContractorsPageProps['searchParams'],
  changes: Partial<ContractorsPageProps['searchParams']>,
) {
  const next = { ...current, ...changes }
  const params = new URLSearchParams()
  if (next.region) params.set('region', next.region)
  if (next.specialty) params.set('specialty', next.specialty)
  const qs = params.toString()
  return qs ? `/contractors?${qs}` : '/contractors'
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={
        'block rounded-md px-3 py-1.5 text-sm transition-colors ' +
        (active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100')
      }
    >
      {children}
    </a>
  )
}
