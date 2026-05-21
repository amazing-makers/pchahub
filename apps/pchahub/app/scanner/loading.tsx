export default function ScannerLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-80 rounded bg-gray-100" />
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse max-w-2xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-6">
          {/* scan area */}
          <div className="aspect-square max-h-64 w-full rounded-xl bg-gray-200 mx-auto" />
          {/* or manual input */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <div className="h-4 w-20 rounded bg-gray-100 bg-white px-2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 rounded-lg bg-gray-100" />
              <div className="h-10 w-24 rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
