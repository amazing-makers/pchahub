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
      {/* investment table-like rows */}
      <div className="container mx-auto py-12">
        <div className="mb-6 h-7 w-40 rounded-lg bg-gray-200" />
        {/* table header */}
        <div className="mb-3 rounded-xl bg-gray-200 h-10" />
        {/* rows */}
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-100 h-20" />
          ))}
        </div>
      </div>
    </div>
  )
}
