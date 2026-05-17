export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="h-7 w-32 rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-64 rounded-full bg-gray-200" />
        </div>
      </div>
      <div className="container mx-auto py-8">
        {/* episode card grid — 2-col featured, then 4-col */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-gray-100 h-64" />
          <div className="rounded-2xl bg-gray-100 h-64" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 h-44" />
          ))}
        </div>
      </div>
    </div>
  )
}
