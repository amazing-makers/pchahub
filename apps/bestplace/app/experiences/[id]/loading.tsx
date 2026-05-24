export default function ExperienceDetailLoading() {
  return (
    <main className="animate-pulse bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6 space-y-3">
          <div className="h-4 w-48 rounded bg-gray-100" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-gray-200" />
            <div className="h-6 w-14 rounded-full bg-gray-200" />
          </div>
          <div className="h-7 w-96 rounded bg-gray-200" />
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 w-32 rounded bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-white" />
            ))}
          </div>
          <div className="h-80 rounded-2xl bg-white" />
        </div>
      </div>
    </main>
  )
}
