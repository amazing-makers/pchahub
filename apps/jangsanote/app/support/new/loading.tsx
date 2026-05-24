export default function SupportNewLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-3">
          <div className="h-4 w-24 rounded bg-gray-100" />
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-4 w-64 rounded bg-gray-100" />
        </div>
      </div>

      <div className="container mx-auto py-8 max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className={`w-full rounded-xl bg-gray-100 ${i === 3 ? 'h-32' : 'h-10'}`} />
            </div>
          ))}
          <div className="h-11 w-full rounded-xl bg-gray-200" />
        </div>
      </div>
    </main>
  )
}
