export default function IntelDetailLoading() {
  return (
    <main className="animate-pulse bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="rounded-2xl bg-white p-8 space-y-4">
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-gray-200" />
              <div className="h-5 w-24 rounded-full bg-gray-100" />
            </div>
            <div className="h-7 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-48 rounded bg-gray-100" />
            <div className="h-20 rounded-xl bg-gray-100" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 rounded bg-gray-100" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-52 rounded-2xl bg-white" />
            <div className="h-24 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    </main>
  )
}
