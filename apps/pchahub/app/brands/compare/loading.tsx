export default function CompareLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-2">
          <div className="h-8 w-32 rounded bg-gray-200" />
          <div className="h-4 w-72 rounded bg-gray-100" />
        </div>
      </div>

      <div className="container mx-auto py-8">
        {/* comparison table */}
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <div className="grid grid-cols-4 divide-x divide-gray-100">
            {/* header row */}
            <div className="p-4 space-y-2">
              <div className="h-4 w-20 rounded bg-gray-100" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 space-y-3">
                <div className="h-12 w-12 rounded-xl bg-gray-200" />
                <div className="h-5 w-24 rounded bg-gray-200" />
                <div className="h-3 w-16 rounded bg-gray-100" />
              </div>
            ))}
            {/* data rows */}
            {Array.from({ length: 6 }).map((_, rowIdx) => (
              Array.from({ length: 4 }).map((_, colIdx) => (
                <div key={`${rowIdx}-${colIdx}`} className="border-t border-gray-100 p-4">
                  <div className={`h-4 rounded bg-gray-${colIdx === 0 ? '100' : '200'} w-${colIdx === 0 ? '24' : '16'}`} />
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
