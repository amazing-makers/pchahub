export default function PricingLoading() {
  return (
    <main className="animate-pulse">
      <div className="border-b border-gray-100 bg-gray-50 py-section">
        <div className="container mx-auto flex flex-col items-center gap-3">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="h-4 w-80 rounded bg-gray-100" />
        </div>
      </div>
      <div className="border-b border-gray-200 bg-white py-4">
        <div className="container mx-auto flex gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-5 w-24 rounded bg-gray-200" />
          ))}
        </div>
      </div>
      <div className="container mx-auto py-section">
        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    </main>
  )
}
