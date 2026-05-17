export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* hero skeleton */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-16">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <div className="mx-auto h-4 w-24 rounded-full bg-gray-200" />
            <div className="mx-auto h-10 w-96 rounded-xl bg-gray-200" />
            <div className="mx-auto h-4 w-80 rounded-full bg-gray-200" />
            <div className="mx-auto h-12 w-64 rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>
      {/* featured 2-col skeleton */}
      <div className="container mx-auto py-12">
        <div className="mb-6 h-7 w-40 rounded-lg bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-gray-100 h-72" />
          <div className="rounded-2xl bg-gray-100 h-72" />
        </div>
      </div>
      {/* episode 4-col grid skeleton */}
      <div className="container mx-auto py-8">
        <div className="mb-6 h-7 w-32 rounded-lg bg-gray-200" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 h-48" />
          ))}
        </div>
      </div>
    </div>
  )
}
