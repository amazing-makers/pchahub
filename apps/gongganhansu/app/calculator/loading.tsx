export default function CalculatorLoading() {
  return (
    <main className="animate-pulse">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section space-y-3">
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="h-8 w-64 rounded bg-gray-200" />
          <div className="h-4 w-96 rounded bg-gray-100" />
        </div>
      </div>
      <div className="container mx-auto py-section">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-gray-100" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-80 rounded-2xl bg-gray-100" />
            <div className="h-40 rounded-2xl bg-gray-100" />
          </div>
        </div>
      </div>
    </main>
  )
}
