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
      {/* 1-col feed + sidebar layout skeleton */}
      <div className="container mx-auto py-12">
        <div className="flex gap-8">
          {/* main feed */}
          <div className="flex-1 space-y-4">
            <div className="mb-4 h-7 w-40 rounded-lg bg-gray-200" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 h-28" />
            ))}
          </div>
          {/* sidebar */}
          <div className="hidden w-64 shrink-0 space-y-4 lg:block">
            <div className="rounded-2xl bg-gray-100 h-48" />
            <div className="rounded-2xl bg-gray-100 h-36" />
            <div className="rounded-2xl bg-gray-100 h-36" />
          </div>
        </div>
      </div>
    </div>
  )
}
